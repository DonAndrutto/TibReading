import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { deck } from '../src/deck.js';
import { parseSyllable } from '../src/syllable.js';
const server = await serve({ TibReading: new URL('../dist',import.meta.url).pathname },4187);
const browser = await chromium.launch();
const errors=[];
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  page.setDefaultTimeout(10000);
  page.on('pageerror',e=>errors.push(e.message));
  await routeFonts(page,'http://127.0.0.1:4187');
  const base='http://127.0.0.1:4187/TibReading/';
  await page.goto(base+'#/vowels/'+encodeURIComponent('ི'));
  await page.locator('.stage-glyph').waitFor();
  assert.match(await page.locator('.stage-glyph').innerText(),/ཀི/);
  await page.reload(); await page.locator('.stage-glyph').waitFor();
  assert.match(await page.locator('.stage-glyph').innerText(),/ཀི/);
  await page.evaluate(()=>location.hash='#/read/3'); await page.locator('.card-ti').waitFor();
  assert.match(await page.locator('.card-ti').innerText(),/ལོ/);
  await page.goBack(); await page.locator('.stage-glyph').waitFor();
  await page.goForward(); await page.locator('.card-ti').waitFor();
  await page.goto(base); await page.locator('.card-ti').waitFor();
  assert.match(page.url(),/#\/read\/3/);
  await page.evaluate(()=>location.hash='#/practice');
  console.log('routes checked');
  await page.getByLabel('Session length').selectOption('5');
  await page.getByLabel('Exercise',{exact:true}).selectOption('recognise');
  await page.getByRole('button',{name:'Start session',exact:true}).click();
  console.log('session started');
  for(let i=0;i<5;i++) {
    const tib=(await page.locator('.exercise-glyph').innerText()).replace(/་$/,'');
    const card=deck.find(c=>c.t===tib); assert.ok(card);
    await page.locator('.answer-option').filter({hasText:new RegExp('^'+card.r.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')}).click();
    await page.getByText('Correct.',{exact:true}).waitFor();
    await page.getByRole('button',{name:i===4?'See summary':'Next card',exact:true}).click();
  }
  await page.getByText('Session complete',{exact:true}).waitFor();
  assert.match(await page.locator('.course-panel').innerText(),/5 correct of 5/);
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('tibreading.progress')));
  assert.equal(Object.values(progress.items).filter(c=>c.reviews>0).length,5);
  // Exercise each remaining input path with a fresh queue, using real controls.
  for (const format of ['produce','type','order','root']) {
    await page.getByRole('button',{name:'Back to practice',exact:true}).click();
    await page.getByLabel('Exercise',{exact:true}).selectOption(format);
    await page.getByRole('button',{name:'Start session',exact:true}).click();
    if (format === 'produce') {
      const roman=await page.locator('.exercise-roman').innerText();
      const correct=await page.locator('.answer-option').evaluateAll((nodes,readings)=>nodes.find(n=>readings[n.textContent.trim()]===readings.target)?.textContent.trim(),Object.fromEntries([...deck.map(c=>[c.t,c.r]),['target',roman]]));
      assert.ok(correct); await page.locator('.answer-option').filter({hasText:correct}).click();
    } else if (format === 'type') {
      const tib=(await page.locator('.exercise-glyph').innerText()).replace(/་$/,'');
      const card=deck.find(c=>c.t===tib);
      await page.getByLabel('Reading or Wylie',{exact:true}).fill('  '+(card.wylie||card.r).toUpperCase()+'  ');
      await page.getByRole('button',{name:'Check answer',exact:true}).click();
    } else if (format === 'order') {
      const wylie=await page.locator('.exercise-roman').innerText();
      const card=deck.find(c=>c.wylie===wylie), parts=parseSyllable(card.t).parts;
      for(const [slot,value] of Object.entries(parts)) if(value) {
        const labels={prefix:'Prefix',super:'Superscript',root:'Root',sub:'Subscript',vowel:'Vowel',suffix:'Suffix',post:'Second suffix'};
        await page.locator('.exercise button').filter({hasText:new RegExp('· '+labels[slot]+'$')}).click();
      }
      await page.getByRole('button',{name:'Check order',exact:true}).click();
    } else {
      const tib=(await page.locator('.exercise-glyph').innerText()).replace(/་$/,'');
      await page.locator('.answer-option').filter({hasText:parseSyllable(tib).root}).click();
    }
    await page.getByText('Correct.',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Finish session',exact:true}).click();
  }
  await page.evaluate(()=>location.hash='#/builder');
  await page.getByRole('button',{name:'Challenge',exact:true}).click();
  const target=parseSyllable('བསྒྲུབས');
  for(const [slot,value] of Object.entries(target.parts)) await page.locator('#slot-'+slot).selectOption(value);
  assert.match(await page.locator('.builder-preview').innerText(),/བསྒྲུབས/);
  await page.getByRole('button',{name:'Check challenge',exact:true}).click();
  await page.getByText('Correct — you built the target.',{exact:true}).waitFor();
  await page.locator('#slot-prefix').selectOption('ག');
  assert.match(await page.locator('.validation-message').innerText(),/prefix cannot/);
  await page.evaluate(()=>location.hash='#/read/0');
  await page.getByRole('button',{name:'Knew it',exact:true}).click();
  assert.match(await page.locator('.reading-drills [role=status]').innerText(),/Saved/);
  await page.evaluate(()=>location.hash='#/settings');
  await page.getByRole('button',{name:'Reset progress',exact:true}).click();
  await page.getByRole('button',{name:'Keep progress',exact:true}).click();
  assert.ok(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('tibreading.progress')).items).some(c=>c.reviews)));
  const backup=await page.evaluate(()=>localStorage.getItem('tibreading.progress'));
  const downloadEvent=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export progress JSON',exact:true}).click();
  const download=await downloadEvent;assert.equal(download.suggestedFilename(),'tibreading-progress.json');
  await page.getByRole('button',{name:'Reset progress',exact:true}).click();
  await page.getByRole('button',{name:'Yes, erase progress',exact:true}).click();
  assert.equal(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('tibreading.progress')).items).length),0);
  await page.locator('input[type=file]').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await page.getByRole('button',{name:'Replace with imported progress',exact:true}).click();
  await page.getByText('Progress imported.',{exact:true}).waitFor();
  assert.ok(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('tibreading.progress')).items).some(c=>c.reviews)));
  await page.evaluate(()=>location.hash='#/trace');
  const canvas=page.locator('canvas');await canvas.focus();
  const before=await canvas.evaluate(c=>c.toDataURL());
  await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');
  assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),before);
  await page.evaluate(()=>location.hash='#/proverbs');
  await page.locator('.pr-syl').first().click();
  await page.getByRole('dialog').waitFor();
  assert.match(await page.getByRole('dialog').innerText(),/water/);
  await page.getByRole('button',{name:/Open syllable in Builder/}).click();
  await page.locator('.builder-preview').waitFor();
  assert.match(await page.locator('.builder-preview').innerText(),/ཆུ/);
  await page.evaluate(()=>location.hash='#/intro');
  await page.getByRole('button',{name:/tap to read the root text/i}).click();
  await page.locator('.lookup-token').first().click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.deepEqual(errors,[]);
  console.log('check:course — routing, history, session persistence, Builder validation/challenge, reading self-grade and reset cancellation passed');
} finally { await browser.close(); server.close(); }
