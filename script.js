const yes=document.querySelector('#yes');
const no=document.querySelector('#no');
const status=document.querySelector('#status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let timer, noPresses=0;
const noZone=document.querySelector('#no-zone');
const noLabels=[
  'Are you sure?', 'Absolutely sure?', 'One more thought?', 'Final answer?',
  'Even for Olivia?', 'Not even a maybe?', 'Have a little think?', 'Still a no?',
  'A very firm no?', 'Quick reconsider?', 'What about the music?', 'No concert snacks?',
  'Still deciding?', 'A tiny maybe?', 'Sleeping on it?', 'Sure about sure?',
  'Last few chances?', 'One last maybe?', 'Okay, last question!'
];
function resetNo(){clearTimeout(timer);no.style.cssText='';}
function moveNo(){
  const bounds=noZone.getBoundingClientRect(),box=no.getBoundingClientRect(),pad=6;
  const maxX=Math.max(pad,bounds.width-box.width-pad);
  const maxY=Math.max(pad,bounds.height-box.height-pad);
  const oldX=box.left-bounds.left,oldY=box.top-bounds.top;
  const candidates=[];
  for(let i=0;i<30;i++){
    const x=pad+Math.random()*(maxX-pad),y=pad+Math.random()*(maxY-pad);
    candidates.push({x,y,distance:Math.hypot(x-oldX,y-oldY)});
  }
  candidates.sort((a,b)=>b.distance-a.distance);
  const next=candidates[Math.floor(Math.random()*5)];
  no.style.position='absolute';no.style.left=next.x+'px';no.style.top=next.y+'px';
}
function dodge(){
  if(noPresses>=20)return;
  noPresses++;
  clearTimeout(timer);
  if(noPresses===20){
    no.hidden=true;
    document.querySelector('.actions').classList.add('yes-final');
    document.querySelector('#hint').hidden=true;
    yes.focus();
    return;
  }
  no.textContent=noLabels[noPresses-1];
  moveNo();
  // Instant relocation with reduced motion; otherwise a short playful blink.
  if(!reduced.matches){no.style.visibility='hidden';timer=setTimeout(()=>{no.style.visibility='visible'},100);}
}
// Native click covers touch, mouse, pen, Enter and Space. Press 20 retires NO.
no.addEventListener('click',dodge);
yes.addEventListener('click',()=>{
  resetNo();document.querySelector('#invite').hidden=true;document.querySelector('#confirmation').hidden=false;
  document.querySelector('#confirmed-title').focus();status.textContent='';
  notifyYes();
  if(!reduced.matches)for(let i=0;i<16;i++){
    const star=document.createElement('span');star.className='heart';star.textContent='✦';star.setAttribute('aria-hidden','true');
    star.style.left=(10+Math.random()*80)+'vw';star.style.top=(55+Math.random()*35)+'vh';star.style.animationDelay=Math.random()*.5+'s';
    document.body.append(star);setTimeout(()=>star.remove(),3000);
  }
});
window.addEventListener('resize',()=>{if(noPresses>0&&noPresses<20&&!document.querySelector('#invite').hidden)moveNo()});
reduced.addEventListener('change',()=>{no.style.visibility='visible';clearTimeout(timer)});

// The embed supplies background sound; the page exposes its own music toggle.
let player,ready=false,started=false,userPaused=false;
const musicStatus=document.querySelector('#music-status');
const musicToggle=document.querySelector('#music-toggle');
const musicFallback=document.querySelector('#music-fallback');
function musicUnavailable(){
  ready=false;musicToggle.disabled=true;musicToggle.textContent='Music unavailable';
  musicStatus.textContent='You can listen using the link below.';musicFallback.hidden=false;
}
window.onYouTubeIframeAPIReady=()=>{
  player=new YT.Player('music-player',{
    width:'360',height:'203',videoId:'euYe6W7d-rI',
    playerVars:{autoplay:1,playsinline:1,controls:1,rel:0,...(/^https?:$/.test(location.protocol)?{origin:location.origin}:{})},
    events:{
      onReady:event=>{
        ready=true;musicToggle.disabled=false;musicToggle.textContent='♫ Play music';
        const iframe=event.target.getIframe();iframe.title='Background music';iframe.tabIndex=-1;
        event.target.setVolume(50);event.target.unMute();event.target.playVideo();
      },
      onStateChange:event=>{
        if(event.data===YT.PlayerState.PLAYING){
          started=true;musicToggle.textContent='Ⅱ Pause music';musicToggle.setAttribute('aria-label','Pause background music');
          musicStatus.textContent='A Couple Minutes · Olivia Dean';
        }else if(event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.ENDED){
          musicToggle.textContent='♫ Play music';musicToggle.setAttribute('aria-label','Play background music');
        }
      },
      onAutoplayBlocked:()=>{musicStatus.textContent='Tap “Play music” to start.'},
      onError:musicUnavailable
    }
  });
};
musicToggle.addEventListener('click',()=>{
  if(!ready)return;
  if(player.getPlayerState()===YT.PlayerState.PLAYING){userPaused=true;player.pauseVideo()}
  else{userPaused=false;player.unMute();player.playVideo()}
});
function tryMusic(event){
  if(event.target===musicToggle)return;
  if(ready&&!userPaused){
    player.unMute();
    if(!started)player.playVideo();
  }
}
document.addEventListener('click',tryMusic);
document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')tryMusic(event)});
const youtubeScript=document.createElement('script');youtubeScript.src='https://www.youtube.com/iframe_api';youtubeScript.async=true;
youtubeScript.onerror=musicUnavailable;
document.head.append(youtubeScript);

const notificationStatus=document.querySelector('#notification-status');
const retryNotification=document.querySelector('#notification-retry');
const notificationTest=new URLSearchParams(location.search).get('notification_test')==='1';
const notificationKey='thea-concert-2027-01-14-yes-submitted'+(notificationTest?'-test':'');
let notificationSending=false,notificationSubmitted=false;
function alreadySubmitted(){
  if(notificationTest)return false;
  try{return localStorage.getItem(notificationKey)==='true'}catch{return false}
}
async function notifyYes(){
  if(notificationSending)return;
  if(notificationSubmitted||alreadySubmitted()){
    notificationStatus.textContent='Your response was already submitted from this browser.';return;
  }
  notificationSending=true;retryNotification.hidden=true;
  notificationStatus.textContent=notificationTest?'Sending a test email (not an RSVP)…':'Sending your YES… Please keep this page open.';
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),60000);
  try{
    const response=await fetch('https://formsubmit.co/ajax/randzellcura@gmail.com',{
      method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:controller.signal,
      body:JSON.stringify({
        _subject:notificationTest?'BROWSER TEST — concert invitation (not an acceptance)':'Concert invitation: YES was pressed',_template:'table',
        invitation:'Thea — Olivia Dean, Manila, January 14, 2027',
        response:notificationTest?'TEST ONLY — not an acceptance':'YES, Absolutely',
        message:notificationTest?'Browser verification test only. Thea has NOT accepted the invitation.':'The YES button was pressed on the concert invitation for Thea.',
        submitted_at:new Date().toISOString(),
        _url:'https://rilcura.github.io/olivia-dean-concert-invitation/'
      })
    });
    const result=await response.json();
    if(/activat|confirm.*email|check.*email/i.test(result.message||'')){
      notificationStatus.textContent='Email setup is still pending. Please message me your answer.';
      retryNotification.hidden=false;return;
    }
    if(!response.ok||!(result.success===true||result.success==='true'))throw new Error(result.message||'Email service rejected the request');
    notificationSubmitted=true;
    try{localStorage.setItem(notificationKey,'true')}catch{}
    notificationStatus.textContent=notificationTest?'Test email submitted. This was not an RSVP.':'Your YES was submitted. Message me and we’ll sort out the details.';
  }catch(error){
    console.warn('Email notification failed:',error.name,error.message);
    notificationStatus.textContent=error.name==='AbortError'?'The email service is taking too long. Your YES is noted here. Try again or message me.':'Your YES is noted here, but the email couldn’t be submitted. Try again or message me.';
    retryNotification.hidden=false;
  }finally{clearTimeout(timeout);notificationSending=false}
}
retryNotification.addEventListener('click',notifyYes);
