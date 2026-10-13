import assert from 'node:assert/strict';
import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

// Start Vite first. Usage: node scripts/test-map-ai-ui.mjs [base-url]
// Optional overrides: MAP_AI_UI_BASE_URL, PLAYWRIGHT_MODULE, PLAYWRIGHT_EXECUTABLE_PATH.
// This suite verifies UI only; it mocks the runtime and never connects to Gemini.
const modulePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(isAbsolute(modulePath) ? pathToFileURL(modulePath).href : modulePath);
const baseUrl = process.argv[2] || process.env.MAP_AI_UI_BASE_URL || 'http://127.0.0.1:5173';

const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.setDefaultTimeout(15000);
const errors = [];
await page.route('**/*', route => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
page.on('pageerror', error => { errors.push(error.message); console.log('PAGE ERROR', error.message); });
await page.route('**/hooks/use-live-api.ts*', route => route.fulfill({ contentType: 'application/javascript', body: `
import React from '/node_modules/.vite/deps/react.js';
const { useSyncExternalStore } = React;
import { useSettings } from '/src/features/playground/components/map-ai/lib/state.ts';
const listeners = new Set();
let state = { connected:false, connecting:false, ending:false, connectionError:null, pendingPrompt:'', isSending:false, isRestoringContext:false, isAwaitingResponse:false, isPlaying:false, recording:false, inputVolume:0, volume:0 };
window.uiMock = { calls:[], patch(update) { state={...state,...update}; listeners.forEach(fn=>fn()); } };
const action = name => async (...args) => { window.uiMock.calls.push({name,args}); return {status:'ok'}; };
export function useLiveApi({activeView}) {
  const snapshot=useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn)},()=>state);
  return {...snapshot,activeView,client:{status:'disconnected'},startConversation:action('start'),resumeConversation:action('resume'),sendMessage:action('send'),stopConversation:action('stop'),endConversation:action('end'),resetConversation:action('reset'),sendControlInstruction:action('control'),changeLevel:async level=>{useSettings.getState().setProficiencyLevel(level);return action('level')(level)},setMicrophoneEnabled:action('mic'),setSpeakerMuted:action('speaker'),retry:async()=>{window.uiMock.calls.push({name:'retry'});window.uiMock.patch({pendingPrompt:'',connectionError:null});return {status:'ok'}}};
}
` }));

async function state(code, arg) { return page.evaluate(async ({code,arg}) => { const stores = await import('/src/features/playground/components/map-ai/lib/state.ts'); return new Function('stores','arg',code)(stores,arg); }, {code,arg}); }
async function selectWord(word) {
  await page.locator('[data-turn-id="stream"] .prose').scrollIntoViewIfNeeded();
  const position = await page.locator('[data-turn-id="stream"] .prose').evaluate((element, word) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const start = node.textContent.indexOf(word);
      if (start < 0) continue;
      const range = document.createRange(); range.setStart(node,start);range.setEnd(node,start+word.length);
      const rect = range.getBoundingClientRect();
      return {x:rect.left + rect.width/2, y:rect.top + rect.height/2};
    }
    throw Error('Missing word '+word);
  }, word);
  await page.mouse.dblclick(position.x, position.y);
  await page.locator('.in-place-dictionary-popup').waitFor();
}
try {
  await page.goto(new URL('/playground', baseUrl).href);
  await page.waitForLoadState('networkidle');
  console.log('Loaded UI');
  assert.equal(await page.locator('.control-tray').count(),0);
  assert.equal(await page.getByTitle('Luyện tập bài đọc & bài học di sản').isDisabled(),true);
  await page.keyboard.press('2');
  await page.locator('.control-tray').waitFor();
  await page.waitForTimeout(700);
  await state(`stores.useLogStore.getState().addTurn({id:'stream',role:'agent',text:'Our cultural heritage is profound.',isFinal:false});`);
  await page.getByRole('button',{name:'Tiếp tục đàm thoại',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.uiMock.calls.at(-1).name),'resume');
  const draft=page.getByRole('textbox',{name:'Text prompt'});
  await draft.fill('Retry draft');
  await page.evaluate(()=>window.uiMock.patch({pendingPrompt:'Retry draft',connectionError:'Mock failure'}));
  await page.getByRole('button',{name:'Thử lại',exact:true}).click();
  assert.equal(await draft.inputValue(),'');
  await draft.fill('New draft');
  await page.evaluate(()=>window.uiMock.patch({pendingPrompt:'Old draft',connectionError:'Mock failure'}));
  await page.getByRole('button',{name:'Thử lại',exact:true}).click();
  assert.equal(await draft.inputValue(),'New draft');
  await draft.fill('');
  await selectWord('heritage');
  const original=await page.locator('[data-turn-id="stream"] .prose').textContent();
  await state(`stores.useLogStore.getState().updateLastTurn({text:'Our cultural heritage is profound. Streaming new content.'});`);
  assert.equal(await page.locator('[data-turn-id="stream"] .prose').textContent(),original);
  assert.equal(await page.locator('.in-place-dictionary-popup').count(),1);
  await page.waitForTimeout(400);
  await page.getByTitle('Nghe phát âm chuẩn').dispatchEvent('mouseup');
  assert.equal(await page.locator('.in-place-dictionary-popup h3').textContent(),'heritage');
  await page.getByTitle('Đóng popup tra từ').click();
  await page.waitForFunction(()=>document.querySelector('[data-turn-id="stream"] .prose').textContent.includes('Streaming new content.'));
  assert.equal(await page.locator('.in-place-dictionary-popup').count(),0);
  await selectWord('profound');
  await page.setViewportSize({width:1590,height:990});
  await page.locator('.in-place-dictionary-popup').waitFor({state:'hidden'});
  assert.equal(await page.locator('.in-place-dictionary-popup').count(),0);
  await selectWord('heritage');
  await page.evaluate(()=>document.activeElement?.blur());
  await page.keyboard.press('3');
  await page.waitForTimeout(700);
  assert.equal(await page.locator('.in-place-dictionary-popup').count(),0);
  assert.equal(await page.locator('.control-tray').count(),0);
  assert.equal(await page.getByTitle('Luyện tập bài đọc & bài học di sản').isDisabled(),true);
  await page.keyboard.press('2');
  await page.waitForTimeout(700);
  await state(`for(let i=0;i<35;i++) stores.useLogStore.getState().addTurn({id:'long-'+i,role:'agent',text:'Cultural heritage paragraph '+i+' '.repeat(2)+'This is a longer passage for testing scroll stability. '.repeat(6),isFinal:true});`);
  await page.locator('.transcription-view').evaluate(el=>{el.scrollTop=0;el.dispatchEvent(new Event('scroll',{bubbles:true}));});
  await state(`stores.useLogStore.getState().addTurn({id:'new',role:'agent',text:'New incoming message',isFinal:true});`);
  assert.equal(await page.locator('.transcription-view').evaluate(el=>el.scrollTop),0);
  await page.getByRole('button',{name:'Tin nhắn mới ↓'}).click();
  await page.waitForTimeout(100);
  assert.ok(await page.locator('.transcription-view').evaluate(el=>el.scrollHeight-el.scrollTop-el.clientHeight<48));
  assert.deepEqual(errors,[]);
  console.log('PASS: inactive gates, resume Play, retry draft matching, selection freeze/release, portal controls, resize/screen invalidation, scroll stability/new messages.');
  for (const viewport of [{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('2');
    await page.locator('.control-tray').waitFor();
    await page.waitForTimeout(700);
    assert.equal(await page.getByRole('textbox',{name:'Text prompt'}).count(),0);
    await page.getByTitle('Toggle text input').click();
    const mobileDraft=page.getByRole('textbox',{name:'Text prompt'});
    await mobileDraft.fill('Mobile retry');
    await page.evaluate(()=>window.uiMock.patch({pendingPrompt:'Mobile retry',connectionError:'Mock failure'}));
    await page.getByRole('button',{name:'Thử lại',exact:true}).click();
    assert.equal(await mobileDraft.inputValue(),'');
    await page.evaluate(()=>document.activeElement?.blur());
    await state(`stores.useLogStore.getState().addTurn({id:'stream',role:'agent',text:'Our cultural heritage is profound.',isFinal:false});`);
    await selectWord('heritage');
    const popup=await page.locator('.in-place-dictionary-popup').boundingBox();
    assert.ok(popup && popup.x>=0 && popup.x+popup.width<=viewport.width);
    await state(`stores.useLogStore.getState().updateLastTurn({text:'Our cultural heritage is profound. Mobile streaming.'});`);
    assert.equal(await page.locator('[data-turn-id="stream"] .prose').textContent(),'Our cultural heritage is profound.');
    await page.getByTitle('Đóng popup tra từ').click();
    await page.waitForFunction(()=>document.querySelector('[data-turn-id="stream"] .prose').textContent.includes('Mobile streaming.'));
    await page.keyboard.press('3');
    await page.waitForTimeout(700);
    assert.equal(await page.locator('.control-tray').count(),0);
    assert.equal(await page.locator('nav[aria-label="Floating Cultural AI Audio Controls"]').count(),1);
    console.log('PASS: mobile '+viewport.width+'x'+viewport.height+' composer, retry, selection, popup fit, immersive gating.');
  }
  assert.deepEqual(errors,[]);
} finally { await browser.close(); }
