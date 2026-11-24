/* Conflict-safe three-way sync of learning and rewards. Never guess old device history identities. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningSync=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const tracks=['mathHistory','readingHistory'];
const subjects=['science','logic','knowledge','coding'];
const requireCount=(v,name)=>{if(!Number.isSafeInteger(v)||v<0)throw Error('Invalid '+name+' counter');return v;};
function prepare(backup,device){
 const b=copy(backup);
 if(!/^[0-9a-f-]{36}$/.test(device))throw Error('Invalid device identity');
 for(const field of tracks){
  if(!Array.isArray(b.learning[field]))b.learning[field]=[];
  b.learning[field]=b.learning[field].map((entry,i)=>{
   if(!entry||typeof entry!=='object')throw Error('Invalid activity');
   return {...entry,id:entry.id||'legacy:'+device+':'+field+':'+i};
  });
 }
 return b;
}
function addActivity(history,record){
 if(!globalThis.crypto?.randomUUID)throw Error('Secure activity ID unavailable');
 return [...(Array.isArray(history)?history:[]),{...record,id:globalThis.crypto.randomUUID()}].slice(-60);
}
function choose(b,l,r,name){
 if(same(l,r))return copy(l);
 if(same(l,b))return copy(r);
 if(same(r,b))return copy(l);
 throw Error('Conflicting '+name+' changes require parent review');
}
function mergeHistory(b,l,r,name){
 if(![b,l,r].every(Array.isArray))throw Error('Invalid '+name);
 const found=new Map();
 for(const item of [...b,...r,...l]){
  if(!item||typeof item.id!=='string'||!item.id)throw Error('Unidentified '+name+' entry');
  const prior=found.get(item.id);
  if(prior&&!same(prior,item))throw Error('Conflicting '+name+' entry');
  found.set(item.id,copy(item));
 }
 return [...found.values()].slice(-60);
}
function mergeWallet(b,l,r){
 for(const x of [b,l,r])if(!x||!Array.isArray(x.items)||!Array.isArray(x.payouts))throw Error('Invalid wallet');
 const out=copy(l),items=new Map();
 for(const item of [...b.items,...r.items,...l.items]){
  if(!item||typeof item.key!=='string'||!item.key)throw Error('Unidentified reward');
  if(items.has(item.key)&&!same(items.get(item.key),item))throw Error('Conflicting reward key');
  items.set(item.key,copy(item));
 }
 out.items=[...items.values()];
 out.payouts=choose(b.payouts,l.payouts,r.payouts,'payout');
 const monthly=new Map();
 for(const item of out.items){
  if(!Number.isSafeInteger(item.pence)||item.pence<0||!/^\d{4}-\d{2}$/.test(item.month))throw Error('Invalid reward');
  if(item.status!=='rejected'){
   const sum=(monthly.get(item.month)||0)+item.pence;
   if(sum>4000)throw Error('Monthly reward cap exceeded');
   monthly.set(item.month,sum);
  }
 }
 return out;
}
function merge(base,local,remote){
 for(const x of [base,local,remote])
  if(!x||x.schemaVersion!==1||!x.learning||!x.wallet)throw Error('Invalid sync record');
 const b=base.learning,l=local.learning,r=remote.learning,combined=copy(local);
 for(const field of tracks)combined.learning[field]=mergeHistory(b[field],l[field],r[field],field);
 for(const field of ['mathCorrect','readingCorrect']){
  const a=requireCount(b[field],field),x=requireCount(l[field],field),y=requireCount(r[field],field);
  if(x<a||y<a)throw Error('Decreased '+field+' counter');
  combined.learning[field]=x+y-a;
 }
 const explore={};
 for(const field of subjects){
  const a=requireCount((b.exploreCorrect||{})[field]||0,field);
  const x=requireCount((l.exploreCorrect||{})[field]||0,field);
  const y=requireCount((r.exploreCorrect||{})[field]||0,field);
  if(x<a||y<a)throw Error('Decreased '+field+' counter');
  explore[field]=x+y-a;
 }
 combined.learning.exploreCorrect=explore;
 combined.learning.mathLevel=choose(b.mathLevel,l.mathLevel,r.mathLevel,'maths level');
 combined.learning.streak=choose(b.streak,l.streak,r.streak,'streak');
 combined.learning.lastDay=choose(b.lastDay,l.lastDay,r.lastDay,'last practice day');
 combined.learning.audioMode=l.audioMode; // preference belongs to the current device
 for(const field of ['assessmentLevel','assessmentAttempts']){
  if(field in b||field in l||field in r)
   combined.learning[field]=choose(b[field]??null,l[field]??null,r[field]??null,field);
 }
 combined.wallet=mergeWallet(base.wallet,local.wallet,remote.wallet);
 combined.exportedAt=new Date().toISOString();
 return combined;
}
return {prepare,addActivity,merge};
});
