/* Automatic progress rewards — no PIN, manual approval or payout action. */
(()=>{'use strict';
const KEY='learning-lab-wallet-v1',PROGRESS='learning-lab-v1',$=id=>document.getElementById(id);
let wallet=load();
const cfg=()=>LearningSettings.read();
function load(){try{
 const stored=JSON.parse(localStorage.getItem(KEY)||'null');
 return LearningWallet.migrate(stored&&Array.isArray(stored.items)&&Array.isArray(stored.payouts)?stored:LearningWallet.zero());
}catch(e){return LearningWallet.zero();}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(wallet));return true;}catch(e){$('walletNotice').textContent='This browser could not save the reward progress.';return false;}}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function progress(){try{return JSON.parse(localStorage.getItem(PROGRESS)||'{}');}catch(e){return {};}}
function claim(type,date,proof){try{const updated=LearningWallet.claim(wallet,type,date,proof,cfg());wallet=updated;save();}catch(e){if(!/already|not completed|cap reached/.test(e.message))$('walletNotice').textContent=e.message;}}
function evaluate(){
 if(!cfg().rewardsEnabled){render();return;}
 const p=progress(),d=today();
 const maths=LearningWallet.eligibleCompletions(p.mathHistory,d);
 const reading=LearningWallet.eligibleCompletions(p.readingHistory,d);
 if(maths>=5)claim('maths',d,maths);
 if(reading>=2)claim('reading',d,reading);
 const days=LearningWallet.eligiblePracticeDays(p.mathHistory,p.readingHistory,d);
 if(days>=4)claim('weekly',d,days);
 render();
}
function render(){const s=LearningWallet.summary(wallet,today(),cfg()),money=pence=>LearningSettings.money(pence,cfg());
 $('walletEarned').textContent=money(s.monthEarned);
 $('walletRemaining').textContent=money(s.remaining);
 $('walletSave').textContent=money(s.savings);
 $('walletSpend').textContent=money(s.spending);
 $('walletFill').style.width=(s.cap?Math.min(100,s.reserved/s.cap*100):0)+'%';
 $('rewardsCard').classList.toggle('hidden',!cfg().rewardsEnabled);
 $('walletMonth').textContent=s.month;
 $('rewardRulesText').textContent='Maths: '+money(cfg().mathReward)+' after five qualifying questions daily. Reading: '+money(cfg().readingReward)+' after two qualifying questions daily. Weekly: '+money(cfg().weeklyReward)+' after qualifying practice on four days. Monthly cap: '+money(cfg().monthlyCap)+'. The first two attempts qualify; later attempts are practice only.';
 const entries=$('walletEntries');entries.replaceChildren();
 const current=wallet.items.filter(x=>x.month===s.month&&x.status==='approved').slice().reverse();
 if(!current.length)entries.textContent='No rewards yet this month. Keep learning to earn your first reward!';
 for(const item of current){const el=document.createElement('p');el.className='wallet-entry';
 el.textContent=item.date+' · '+LearningWallet.RULES[item.type].label+' · +'+money(item.pence);
 entries.appendChild(el);}
}
window.addEventListener('learning-lab-progress',evaluate);
window.addEventListener('learning-lab-settings-changed',()=>{render();evaluate();});
$('walletNotice').textContent='Virtual rewards only. No money is paid. Records are stored locally, not automatically backed up.';
save();evaluate();
})();
