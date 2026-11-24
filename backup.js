/* Full local learning + wallet export. No upload, restore, or storage mutation. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningBackup=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LEARNING='learning-lab-v1',WALLET='learning-lab-wallet-v1';
function validObject(x){return x&&typeof x==='object'&&!Array.isArray(x);}
function build(learningJson,walletJson,exportedAt){
 if(typeof learningJson!=='string'||typeof walletJson!=='string')throw Error('Learning and reward records are both required');
 let learning,wallet;
 try{learning=JSON.parse(learningJson);wallet=JSON.parse(walletJson);}catch{throw Error('Saved records could not be read');}
 if(!validObject(learning)||!Number.isFinite(Number(learning.mathCorrect))||!Number.isFinite(Number(learning.readingCorrect)))throw Error('Learning records are invalid');
 if(!validObject(wallet)||!Array.isArray(wallet.items)||!Array.isArray(wallet.payouts))throw Error('Reward records are invalid');
 if(typeof exportedAt!=='string'||Number.isNaN(Date.parse(exportedAt)))throw Error('Invalid export date');
 return {schemaVersion:1,exportedAt,source:'Learning Lab',learning,wallet};
}
return {LEARNING,WALLET,build};
});
