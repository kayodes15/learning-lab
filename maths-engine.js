/* Learning Learning Lab maths engine v0.5 — deterministic core, injected RNG for testing. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningMaths=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const MAX_LEVEL=8,MIN_LEVEL=1;
const TOPICS=['addition','subtraction','multiplication','division','fractions','decimals','percentages','reasoning'];
const clamp=n=>Math.max(MIN_LEVEL,Math.min(MAX_LEVEL,Math.floor(Number(n)||1)));
function question(level,rng=Math.random){
 level=clamp(level);
 const rand=n=>Math.floor(Math.max(0,Math.min(.999999999,Number(rng())||0))*n);
 const add=(min,max)=>min+rand(max-min+1);
 let answer,text,hint,topic=TOPICS[level-1],options;
 if(level===1){const a=add(5,25),b=add(2,24);answer=a+b;text=a+' + '+b+' = ?';hint='Start with the bigger number and count on.';}
 if(level===2){const b=add(4,35),a=b+add(5,45);answer=a-b;text=a+' − '+b+' = ?';hint='Subtract the tens first, then the ones.';}
 if(level===3){const a=add(3,12),b=add(3,12);answer=a*b;text=a+' × '+b+' = ?';hint='Count '+a+' groups of '+b+'.';}
 if(level===4){const b=add(2,12),x=add(3,12);answer=x;text=(b*x)+' ÷ '+b+' = ?';hint='Find how many groups of '+b+' fit evenly.';}
 if(level===5){const denominator=[2,4,5,10][rand(4)],whole=denominator*add(2,12);answer=whole/denominator;text='What is 1/'+denominator+' of '+whole+'?';hint='Divide the total into '+denominator+' equal parts.';}
 if(level===6){const a=add(11,98)/10,b=add(2,49)/10;answer=Number((a+b).toFixed(1));text=a.toFixed(1)+' + '+b.toFixed(1)+' = ?';hint='Line up the decimal points and add.';}
 if(level===7){const pct=[10,20,25,50][rand(4)],whole=add(2,16)*20;answer=pct*whole/100;text='What is '+pct+'% of '+whole+'?';hint=pct===25?'25% means one quarter.':pct===50?'50% means one half.':'Find 10% first, then scale it.';}
 if(level===8){const packs=add(3,12),each=add(4,15),used=add(2,Math.min(12,packs*each-1));answer=packs*each-used;text='A shop has '+packs+' packs of '+each+' pencils. '+used+' pencils are given away. How many remain?';hint='Multiply the packs by pencils per pack, then subtract what was given away.';}
 if(typeof answer!=='number'||!Number.isFinite(answer))throw Error('Invalid generated answer');
  const wrong=[answer+1,answer-1,answer+2,answer+10,answer-2].filter(n=>n>=0&&n!==answer);
 const choices=[answer];for(const x of wrong){if(!choices.includes(x))choices.push(x);if(choices.length===4)break;}
 // Fisher–Yates shuffle; fixed RNG makes questions testable.
 for(let i=choices.length-1;i>0;i--){const j=rand(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {text,answer,options:choices,hint,level,topic,skill:'maths'};
}
function progression(current,history){
 current=clamp(current);const recent=(Array.isArray(history)?history:[]).filter(x=>x&&x.level===current&&typeof x.firstTry==='boolean').slice(-5);
 if(recent.length<5)return current;
 const first=recent.filter(x=>x.firstTry).length;
 if(first>=4)return Math.min(MAX_LEVEL,current+1);
 if(first<=1)return Math.max(MIN_LEVEL,current-1);
 return current;
}
return {MAX_LEVEL,TOPICS,clamp,question,progression};
});
