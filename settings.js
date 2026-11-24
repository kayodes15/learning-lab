/* Public Learning Lab settings. On-device only; no network or personal account. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningSettings=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='learning-lab-public-settings-v1';
const DEFAULT=Object.freeze({nickname:'',age:7,schoolYear:'',mathMode:'auto',mathLevel:1,readingMode:'all',rewardsEnabled:true,currency:'GBP',mathReward:30,readingReward:40,weeklyReward:150,monthlyCap:4000});
const CURRENCIES=Object.freeze(['GBP','USD','EUR','NGN']);
function clean(input){
 const s={...DEFAULT};if(!input||typeof input!=='object'||Array.isArray(input))return s;
 s.nickname=String(input.nickname||'').trim().slice(0,32);
 s.age=Number.isInteger(Number(input.age))?Math.max(5,Math.min(16,Number(input.age))):DEFAULT.age;
 s.schoolYear=String(input.schoolYear||'').trim().slice(0,28);
 s.mathMode=input.mathMode==='fixed'?'fixed':'auto';
 s.mathLevel=Number.isInteger(Number(input.mathLevel))?Math.max(1,Math.min(8,Number(input.mathLevel))):1;
 s.readingMode=['all','foundation','advanced'].includes(input.readingMode)?input.readingMode:'all';
 s.rewardsEnabled=input.rewardsEnabled!==false;
 s.currency=CURRENCIES.includes(input.currency)?input.currency:'GBP';
 for(const key of ['mathReward','readingReward','weeklyReward','monthlyCap']){
  const v=Number(input[key]);if(Number.isInteger(v)&&v>=0&&v<=100000)s[key]=v;
 }
 return s;
}
function read(){try{return clean(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{return clean();}}
function save(settings){const cleaned=clean(settings);localStorage.setItem(KEY,JSON.stringify(cleaned));return cleaned;}
function money(amount,settings=read()){
 const s=clean(settings);return new Intl.NumberFormat('en-GB',{style:'currency',currency:s.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format((Number(amount)||0)/100);
}
function readingItems(mode,items){
 if(mode==='foundation')return items.filter(x=>['comprehension','sequence','spelling','sentence building'].includes(x.topic));
 if(mode==='advanced')return items.filter(x=>['inference','vocabulary','grammar'].includes(x.topic));
 return items;
}
return {KEY,DEFAULT,CURRENCIES,clean,read,save,money,readingItems};
});
