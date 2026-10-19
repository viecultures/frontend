import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined});
const page=await browser.newPage();
const failures=[];page.on('pageerror',e=>failures.push(e.message));
await page.route('**/api/v1/ytb-transcript**',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({success:true,data:{videoId:'UtF6Jej8yb4',title:'Asynchronous seek regression',snippets:[{text:'Sentence twenty timing fixture.',start:54.846,duration:3.254},{text:'Sentence twenty one timing fixture.',start:58.183,duration:0.959}]}})}));
await page.addInitScript(()=>{
 window.YT={Player:class{
  time=0;state=2;rate=1;volume=100;muted=false;delay=300;seeks=[];pauses=[];
  constructor(element,options){this.events=options.events;window.__seekPlayer=this;queueMicrotask(()=>this.events.onReady({target:this}));}
  getCurrentTime(){return this.time;}getDuration(){return 240;}getPlayerState(){return this.state;}getPlaybackRate(){return this.rate;}getVolume(){return this.volume;}isMuted(){return this.muted;}
  seekTo(time){this.seeks.push(time);clearTimeout(this.pending);this.pending=setTimeout(()=>{this.time=time;},this.delay);}
  playVideo(){this.state=1;this.events.onStateChange({target:this,data:1});}
  pauseVideo(){this.pauses.push(this.time);this.state=2;this.events.onStateChange({target:this,data:2});}
  setPlaybackRate(rate){this.rate=rate;}setVolume(volume){this.volume=volume;}mute(){this.muted=true;}unMute(){this.muted=false;}destroy(){clearTimeout(this.pending);}
 }};
});
try{
 await page.goto((process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5187')+'/playground');
 await page.getByRole('textbox',{name:/^(Link video YouTube|YouTube video URL)$/}).fill('UtF6Jej8yb4');
 await page.getByRole('button',{name:/^(Lấy transcript từ BE|Open video)$/}).click();
 await page.getByRole('button',{name:'Edit transcript',exact:true}).or(page.getByRole('heading',{name:'Biên tập trước khi luyện'})).first().waitFor();
 if(await page.getByRole('button',{name:'Edit transcript',exact:true}).isVisible()) await page.getByRole('button',{name:'Edit transcript',exact:true}).click();
 await page.evaluate(()=>{window.__seekPlayer.time=59.125;window.__seekPlayer.state=2;});
 await page.getByRole('button',{name:'Nghe câu',exact:true}).nth(1).click();
 await page.waitForTimeout(450);
 const result=await page.evaluate(()=>({state:window.__seekPlayer.state,time:window.__seekPlayer.time,pauses:window.__seekPlayer.pauses}));
 console.log('Stale-time seek result:',JSON.stringify(result));
 assert.equal(result.state,1,'Sentence 21 must still play after seek; a cached time near its end must not pause it.');
 await page.evaluate(()=>{window.__seekPlayer.time=59.130;});
 await page.waitForTimeout(120);
 assert.equal(await page.evaluate(()=>window.__seekPlayer.state),1,'Do not auto-pause before the actual sentence end 59.142.');
 await page.evaluate(()=>{window.__seekPlayer.time=59.145;});
 await page.waitForFunction(()=>window.__seekPlayer.state===2);
 // Replaying the same short sentence must re-confirm seek every time.
 for(let attempt=0;attempt<2;attempt++){
  await page.getByRole('button',{name:'Nghe câu',exact:true}).nth(1).click();
  await page.waitForTimeout(450);
  assert.equal(await page.evaluate(()=>window.__seekPlayer.state),1);
  await page.evaluate(()=>{window.__seekPlayer.time=59.15;});
  await page.waitForFunction(()=>window.__seekPlayer.state===2);
 }
 // Switching sentences before a seek completes discards the previous boundary.
 await page.getByRole('button',{name:'Nghe câu',exact:true}).nth(0).click();
 await page.getByRole('button',{name:'Nghe câu',exact:true}).nth(1).click();
 await page.waitForTimeout(450);
 assert.equal(await page.evaluate(()=>window.__seekPlayer.time),58.183);
 assert.equal(await page.evaluate(()=>window.__seekPlayer.state),1);
 // A buffering clock beyond the end must not queue a pause before audio resumes.
 const pauseCount=await page.evaluate(()=>window.__seekPlayer.pauses.length);
 await page.evaluate(()=>{window.__seekPlayer.time=59.2;window.__seekPlayer.state=3;});
 await page.waitForTimeout(120);
 assert.equal(await page.evaluate(()=>window.__seekPlayer.pauses.length),pauseCount);
 await page.evaluate(()=>{window.__seekPlayer.time=58.8;window.__seekPlayer.state=1;});
 await page.waitForTimeout(80);
 await page.evaluate(()=>{window.__seekPlayer.time=59.15;});
 await page.waitForFunction(()=>window.__seekPlayer.state===2);
 assert.deepEqual(failures,[]);
 console.log('PASS: stale seek time, exact end, replay, rapid sentence change and buffering.');
}catch(error){console.error('UI:',await page.locator('body').innerText());console.error('Page errors:',failures);throw error;}finally{await browser.close();}
