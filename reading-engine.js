/* Reading and English question bank v0.6. Local, zero-dependency learning content. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningReading=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ITEMS=[
{topic:'comprehension',text:'The fox ran to the big tree. Where did the fox run?',answer:'To the tree',options:['To the tree','To the river','To school','To the shop'],hint:'Find the words after “ran to”.'},
{topic:'comprehension',text:'Mia has a red bag. She puts three books inside it. What colour is her bag?',answer:'Red',options:['Blue','Green','Red','Yellow'],hint:'Read the first sentence again.'},
{topic:'comprehension',text:'On Monday, Ben planted a seed. He watered it every day. What did Ben plant?',answer:'A seed',options:['A flower','A seed','A tree','A carrot'],hint:'Look at what Ben did on Monday.'},
{topic:'comprehension',text:'The small bird sat on a wall. It sang when the sun came up. When did the bird sing?',answer:'At sunrise',options:['At night','At sunrise','At lunchtime','In the rain'],hint:'What does “when the sun came up” mean?'},
{topic:'comprehension',text:'Aisha chose a warm coat because the wind was cold. Why did she choose the coat?',answer:'To stay warm',options:['To swim','To stay warm','To go to bed','To cook'],hint:'The word “because” gives you a clue.'},
{topic:'comprehension',text:'Tom had six apples. He gave two to his friend. How many apples did he have left?',answer:'Four',options:['Two','Three','Four','Eight'],hint:'Six take away two.'},
{topic:'inference',text:'The sky grew dark. Leah grabbed her umbrella before leaving home. What did she expect?',answer:'Rain',options:['Rain','Snow','A birthday party','A heatwave'],hint:'Why might someone carry an umbrella?'},
{topic:'inference',text:'When Mum opened the oven, a warm smell filled the kitchen. Learning fetched plates. What was probably happening?',answer:'Food was ready',options:['Food was ready','The car broke down','It was bedtime','The garden was watered'],hint:'Think about the oven and the plates.'},
{topic:'sequence',text:'First Ava washed her hands. Next she cut the fruit. Finally she shared it. What did Ava do second?',answer:'Cut the fruit',options:['Cut the fruit','Wash her hands','Share the fruit','Go to sleep'],hint:'Look for the word “Next”.'},
{topic:'vocabulary',text:'The puppy was exhausted after running all afternoon. What does “exhausted” mean?',answer:'Very tired',options:['Very tired','Very angry','Very hungry','Very loud'],hint:'Think about how you feel after lots of running.'},
{topic:'vocabulary',text:'The path was narrow, so the children walked in single file. What does “narrow” mean?',answer:'Not very wide',options:['Not very wide','Very bright','Very noisy','Very steep'],hint:'Why might people need to walk one behind another?'},
{topic:'grammar',text:'Choose the sentence with the correct capital letter and full stop.',answer:'The dog is sleeping.',options:['the dog is sleeping.','The dog is sleeping.','The dog is sleeping','the Dog is sleeping.'],hint:'A sentence begins with a capital and ends with a full stop.'},
{topic:'grammar',text:'Which word completes this sentence? “Yesterday, I ___ to the park.”',answer:'went',options:['go','going','went','goes'],hint:'Yesterday tells us this happened in the past.'},
{topic:'grammar',text:'Which sentence uses the apostrophe correctly?',answer:"It's raining outside.",options:["Its' raining outside.","Its raining outside.","It's raining outside.","It s raining outside."],hint:'“It is” can be shortened to “it’s”.'},
{topic:'spelling',text:'Which word is spelled correctly?',answer:'because',options:['becos','becuase','because','becouse'],hint:'Sound out: be-cause.'},
{topic:'spelling',text:'Which word is spelled correctly?',answer:'beautiful',options:['beautifull','beautiful','beutiful','beautful'],hint:'Think: beau-ti-ful.'},
{topic:'sentence building',text:'Choose the sentence that makes sense.',answer:'The children played in the garden.',options:['Children the garden in played.','The children played in the garden.','Played children the garden.','The in children played garden.'],hint:'Who did something, what did they do, and where?'},
{topic:'sentence building',text:'Which word best joins these ideas? “I wore my coat ___ it was cold.”',answer:'because',options:['because','although','before','until'],hint:'Choose the word that explains the reason.'}
];
function question(index,rng=Math.random){
 const item=ITEMS[((Math.floor(Number(index)||0)%ITEMS.length)+ITEMS.length)%ITEMS.length];
 const opts=item.options.slice();
 for(let i=opts.length-1;i>0;i--){const raw=Number(rng());const j=Math.floor(Math.max(0,Math.min(.999999999,Number.isFinite(raw)?raw:0))*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}
 return {...item,options:opts,skill:'reading'};
}
return {ITEMS,question};
});
