// Live backend + real YouTube SDK/media. Only microphone input is synthetic.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5188';
const video=process.env.SHADOWING_VIDEO_ID || 'M7lc1UVf-VE';
await mkdir('docs/ai_log/practice-live',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const context=await browser.newContext({permissions:['microphone']});
await context.addInitScript(()=>{
 window.__liveStreams=[];window.__liveAudios=[];window.__liveCommands=[];
 const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
 navigator.mediaDevices.getUserMedia=async(...args)=>{const s=await get(...args);window.__liveStreams.push(s);return s;};
 const NativeAudio=window.Audio;window.Audio=function(...args){const a=new NativeAudio(...args);window.__liveAudios.push(a);return a;};window.Audio.prototype=NativeAudio.prototype;
});
try{
 for(const width of [1440,375]){
  const page=await context.newPage();
  await page.setViewportSize({width,height:900});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(`${base}/playground`,{waitUntil:'domcontentloaded'});
   await page.locator('.sh-source-options summary').click();
   await page.getByLabel('Sentence grouping',{exact:true}).selectOption('SENTENCE');
   await page.getByLabel('YouTube video URL',{exact:true}).fill(`https://www.youtube.com/watch?v=${video}`);
   const pending=page.waitForResponse(r=>r.url().includes('/api/v1/ytb-transcript?'),{timeout:25000});
   await page.getByRole('button',{name:'Open video',exact:true}).click();
   const response=await pending;assert.equal(response.status(),200);const data=(await response.json()).data;
   await page.getByText('Transcript ready',{exact:true}).waitFor();
   await page.waitForFunction(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Start practice'));return b&&!b.disabled;},null,{timeout:35000});
   await page.evaluate(()=>{
    const iframe=document.querySelector('.sh-video iframe');const player=window.YT.get(iframe.id);window.__livePlayer=player;
    for(const name of ['seekTo','pauseVideo','playVideo']){const original=player[name].bind(player);player[name]=(...args)=>{window.__liveCommands.push({name,args,time:player.getCurrentTime(),state:player.getPlayerState()});return original(...args);};}
   });
   await page.getByRole('button',{name:'Start practice',exact:true}).click();
   await page.getByRole('region',{name:'Shadowing practice',exact:true}).waitFor();
   // Use the second real caption, long enough to capture microphone and decode.
   await page.getByRole('button',{name:'Next sentence',exact:true}).click();
   const samples=[];
   for(const index of [1,2,2]) {
    if(index===2&&samples.length===1) await page.getByRole('button',{name:'Next sentence',exact:true}).click();
    const sentence=data.snippets[index];
    await page.getByRole('button',{name:'Listen',exact:true}).click();
    await page.waitForFunction(()=>{const c=window.__liveCommands;const seek=c.findLastIndex(x=>x.name==='seekTo');return seek>=0&&c.slice(seek+1).some(x=>x.name==='pauseVideo');},null,{timeout:25000});
    const pause=await page.evaluate(()=>window.__liveCommands.at(-1));
    assert.ok(pause.time>=sentence.start+sentence.duration-0.05,`Early stop ${pause.time}`);
    assert.ok(pause.time<sentence.start+sentence.duration+1,`Late stop ${pause.time}`);
    samples.push({start:sentence.start,end:sentence.start+sentence.duration,pauseAt:pause.time});
   }
   await page.getByRole('tab',{name:'Dictation',exact:true}).click();
   await page.getByRole('button',{name:'Listen to sentence',exact:true}).click();
   await page.waitForFunction(()=>window.__livePlayer.getPlayerState()===1,null,{timeout:20000});
   await page.getByLabel('Your dictation',{exact:true}).fill(data.snippets[0].text);
   await page.getByRole('button',{name:'Check answer',exact:true}).click();
   await page.getByText('Word match: 100%',{exact:true}).waitFor();
   await page.getByRole('tab',{name:'Shadowing',exact:true}).click();
   await page.getByRole('button',{name:'Next sentence',exact:true}).click();
   await page.getByRole('button',{name:'Record sentence',exact:true}).click();
   await page.getByRole('button',{name:/Stop recording ·/}).waitFor({timeout:18000});
   const audio=page.getByLabel('Selected sentence recording',{exact:true});
   await audio.waitFor({timeout:15000});
   await page.waitForFunction(()=>document.querySelector('audio[controls]')?.readyState>=1);
   const take=await audio.evaluate(async a=>({bytes:(await(await fetch(a.src)).blob()).size,mime:a.currentSrc.startsWith('blob:')?'session blob':'unknown'}));
   assert.ok(take.bytes>0);
   await audio.evaluate(a=>a.play());
   await page.waitForFunction(()=>document.querySelector('audio[controls]').currentTime>.1);
   await audio.evaluate(a=>a.pause());
   await page.getByRole('tab',{name:'Dictation',exact:true}).click();
   await page.getByRole('tab',{name:'Shadowing',exact:true}).click();
   await page.getByRole('button',{name:'Next sentence',exact:true}).click();
   await audio.waitFor();

   await page.locator('summary').filter({hasText:'Review your voice'}).click();
   await page.getByRole('button',{name:'Replay this part',exact:true}).click();
   await page.waitForFunction(()=>window.__livePlayer.getPlayerState()===1,null,{timeout:20000});
   // A real seek avoids waiting through the full introduction to hear the take.
   await page.evaluate(start=>window.__livePlayer.seekTo(start,true),data.snippets[1].start);
   await page.waitForFunction(()=>window.__liveAudios.some(a=>!a.paused&&a.currentTime>.1),null,{timeout:15000});
   await page.getByRole('button',{name:'Pause / resume',exact:true}).click();
   await page.waitForFunction(()=>window.__liveAudios.every(a=>a.paused));
   await page.getByRole('button',{name:'Pause / resume',exact:true}).click();
   await page.waitForFunction(()=>window.__livePlayer.getPlayerState()===1);
   await page.getByRole('button',{name:'Back to practice',exact:true}).click();
   await page.getByRole('button',{name:'Replay full video',exact:true}).click();
   await page.waitForFunction(()=>window.__livePlayer.getPlayerState()===1);
   await page.getByRole('button',{name:'Back to practice',exact:true}).click();
   await page.waitForFunction(()=>window.__liveStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended')));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);
   await page.screenshot({path:`docs/ai_log/practice-live/ready-${width}.png`});
   console.log(JSON.stringify({width,video,transcript:data.snippets.length,samples,take,dictation:'100%',replay:'part/full/pause/resume PASS',micCleanup:true}));
  }catch(error){await page.screenshot({path:`docs/ai_log/practice-live/failure-${width}.png`});console.error((await page.locator('.sh-hub').innerText()).slice(0,6000));console.error(errors);throw error;}
  finally{await page.close();}
 }
}finally{await browser.close();}
