/* Parent progress summary — local browser data only, no financial transactions. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningParentReport=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TOPICS=['science','logic','knowledge','coding'];
const labels={science:'Science',logic:'Logic',knowledge:'General Knowledge',coding:'Coding Basics'};
const n=x=>Number.isFinite(Number(x))&&Number(x)>=0?Math.floor(Number(x)):0;
function summarise(progress,wallet,date){
 const p=progress||{},mh=Array.isArray(p.mathHistory)?p.mathHistory:[],rh=Array.isArray(p.readingHistory)?p.readingHistory:[];
 const mathsFirst=mh.filter(x=>x&&x.firstTry===true).length,readFirst=rh.filter(x=>x&&x.firstTry===true).length;
 const mathsEligible=mh.filter(x=>x&&x.rewardEligible!==false).length,readEligible=rh.filter(x=>x&&x.rewardEligible!==false).length;
 const explore=TOPICS.map(key=>({key,label:labels[key],correct:n((p.exploreCorrect||{})[key])}));
 const s={mathsCorrect:n(p.mathCorrect),readingCorrect:n(p.readingCorrect),mathLevel:Math.max(1,Math.min(8,n(p.mathLevel)||1)),
 mathsFirst,readFirst,mathsEligible,readEligible,mathsHistory:mh.length,readingHistory:rh.length,explore,
 activeDays:new Set([...mh,...rh].filter(x=>x&&typeof x.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.day)).map(x=>x.day)).size};
 if(wallet&&typeof wallet==='object'&&Array.isArray(wallet.items)&&Array.isArray(wallet.payouts)&&typeof LearningWallet!=='undefined'){
 try{s.wallet=LearningWallet.summary(wallet,date);}catch(e){s.wallet=null;}
 }
 return s;
}
return {summarise};
});
