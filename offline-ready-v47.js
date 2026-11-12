(function(){
 'use strict';
 const ID='offline-ready-v47-status';
 function update(msg,ready){
   let el=document.getElementById(ID);
   if(!el){el=document.createElement('div');el.id=ID;el.setAttribute('role','status');
     el.style.cssText='position:fixed;bottom:calc(8px + env(safe-area-inset-bottom, 0px));left:8px;right:8px;z-index:99999;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;color:#18324c;border:2px solid #dbc7f8;border-radius:14px;padding:9px 11px;font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 20px #0002;';
     const name=document.createElement('span');name.id=ID+'-text';el.appendChild(name);
     const button=document.createElement('button');button.textContent='Check';button.type='button';button.style.cssText='background:#6555b4;color:#fff;border:0;border-radius:12px;padding:7px 12px;font:600 12px sans-serif;';button.onclick=()=>setup(true);el.appendChild(button);
     document.body.appendChild(el);
   }
   el.querySelector('#'+ID+'-text').textContent=(ready?'✅ ':'🔄 ')+msg;
 }
 async function ask(controller){
   return new Promise(resolve=>{
     const channel=new MessageChannel();
     channel.port1.onmessage=e=>resolve(e.data);
     controller.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);
     setTimeout(()=>resolve({ready:false,reason:'check timeout'}),9000);
   });
 }
 async function setup(force){
   try{
     update('Checking offline files…',false);
     if(!('serviceWorker'in navigator)||!('caches'in window))throw Error('Offline storage unavailable in this browser');
     if(force){const existing=await navigator.serviceWorker.getRegistration('./'); if(existing)await existing.update();}
     const reg=await navigator.serviceWorker.register('./service-worker.js?v=47',{scope:'./'});
     await navigator.serviceWorker.ready;
     const worker=reg.active||navigator.serviceWorker.controller;
     if(!worker)throw Error('Offline worker not active');
     const result=await ask(worker);
     if(result.ready){update('Offline Ready — boleh cuba Airplane Mode',true);}
     else{update('Offline belum siap; tekan Check dengan internet ON',false);console.warn('Offline check:',result);}
   }catch(error){update('Offline belum siap; tekan Check dengan internet ON',false);console.warn('Offline setup:',error);}
 }
 // Register after DOM exists but without relying on loading the giant app bundle.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setup(false),{once:true});
 else setup(false);
})();
