/* Learning Learning Lab — automatic, local-only progress rewards (not a payment service). */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningWallet=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LIMIT=4000,SAVE_PERCENT=60;
const RULES=Object.freeze({
 maths:{pence:30,label:'Five maths questions completed'},
 reading:{pence:40,label:'Two reading questions completed'},
 weekly:{pence:150,label:'Practised on four different days this week'}
});
const zero=()=>({version:2,items:[],payouts:[]});
const validDate=d=>{if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;const check=new Date(d+'T12:00:00Z');return !Number.isNaN(check.getTime())&&check.toISOString().slice(0,10)===d;};
const month=d=>d.slice(0,7);
function isoWeek(date){if(!validDate(date))throw Error('Invalid date');const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const year=d.getUTCFullYear();const start=new Date(Date.UTC(year,0,1));return year+'-W'+String(Math.ceil((((d-start)/86400000)+1)/7)).padStart(2,'0');}
function validate(w){if(!w||!Array.isArray(w.items)||!Array.isArray(w.payouts))throw Error('Invalid wallet');return w;}
const clone=x=>JSON.parse(JSON.stringify(x));
function migrate(w){validate(w);const next=clone(w);next.version=2;delete next.pin;for(const item of next.items){if(item.status==='pending'){item.status='approved';item.approvedAt='automatic-migration';}}return next;}
function reserved(w,m){validate(w);return w.items.filter(x=>x.month===m&&x.status!=='rejected').reduce((n,x)=>n+x.pence,0);}
function claim(w,type,date,proof,settings){
 validate(w);if(!RULES[type]||!validDate(date))throw Error('Invalid activity');
 const cfg=settings||{rewardsEnabled:true,mathReward:30,readingReward:40,weeklyReward:150,monthlyCap:LIMIT};if(cfg.rewardsEnabled===false)throw Error('Rewards are disabled');
 if(!Number.isInteger(proof)||proof<0)throw Error('Invalid proof');
 if(proof<({maths:5,reading:2,weekly:4}[type]))throw Error('Activity not completed');
 const key=type+':'+(type==='weekly'?isoWeek(date):date);
 if(w.items.some(x=>x.key===key))throw Error('Reward already recorded');
 const amountKey={maths:'mathReward',reading:'readingReward',weekly:'weeklyReward'}[type];const cost=cfg[amountKey]??RULES[type].pence,m=month(date);
 if(!Number.isInteger(cost)||cost<0||cost>100000||reserved(w,m)+cost>(cfg.monthlyCap??LIMIT))throw Error('Monthly reward cap reached');
 const next=clone(w);
 next.items.push({id:key,key,type,date,month:m,pence:cost,status:'approved',approvedAt:'automatic'});
 return next;
}
function balances(w){validate(w);const approved=w.items.filter(x=>x.status==='approved');
 const total=approved.reduce((n,x)=>n+x.pence,0);
 const saved=approved.reduce((n,x)=>n+Math.floor(x.pence*SAVE_PERCENT/100),0);
 const paidSave=w.payouts.filter(x=>x.pocket==='save').reduce((n,x)=>n+x.pence,0);
 const paidSpend=w.payouts.filter(x=>x.pocket==='spend').reduce((n,x)=>n+x.pence,0);
 return {earned:total,savings:saved-paidSave,spending:total-saved-paidSpend,paidSavings:paidSave,paidSpending:paidSpend};
}
function summary(w,date,settings){if(!validDate(date))throw Error('Invalid date');const m=month(date);const spent=reserved(w,m);
 const limit=settings?.monthlyCap??LIMIT;return {month:m,cap:limit,reserved:spent,remaining:Math.max(0,limit-spent),monthEarned:w.items.filter(x=>x.month===m&&x.status==='approved').reduce((n,x)=>n+x.pence,0),...balances(w)};}
function rewardEligible(attempts){return Number.isInteger(attempts)&&attempts>=1&&attempts<=2;}
function eligibleCompletions(history,date){if(!validDate(date))throw Error('Invalid date');return (Array.isArray(history)?history:[]).filter(x=>x&&x.day===date&&x.rewardEligible!==false).length;}
function eligiblePracticeDays(mathHistory,readingHistory,date){const week=isoWeek(date),all=[...(Array.isArray(mathHistory)?mathHistory:[]),...(Array.isArray(readingHistory)?readingHistory:[])];return new Set(all.filter(x=>{try{return x&&x.rewardEligible!==false&&isoWeek(x.day)===week;}catch{return false;}}).map(x=>x.day)).size;}
const money=pence=>'£'+(pence/100).toFixed(2);
return {LIMIT,RULES,zero,migrate,claim,summary,balances,money,isoWeek,rewardEligible,eligibleCompletions,eligiblePracticeDays};
});
