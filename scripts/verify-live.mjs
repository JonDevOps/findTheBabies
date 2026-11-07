import {chromium} from '@playwright/test';
import {brands} from '../src/brands.js';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();
const results=[];
for(const [key,b] of Object.entries(brands)){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=`https://${b.project}.web.app`;
 const response=await page.goto(url);
 await page.getByRole('heading',{level:1}).waitFor();
 const title=await page.getByRole('heading',{level:1}).innerText();if(title.replace(/\s/g,'')!==b.title.join('').replace(/\s/g,''))throw Error('Wrong brand '+key);
 await page.screenshot({path:`screenshots/${key}-live.png`,fullPage:true});
 await page.goto(url+'/dashboard');await page.getByRole('heading',{name:'Welcome back.'}).waitFor();
 const popupPromise=page.waitForEvent('popup');await page.getByRole('button',{name:'Continue with Google'}).click();const popup=await popupPromise;
 await popup.waitForURL(u=>u.hostname==='accounts.google.com',{timeout:25000});
 // Check the real provider page without entering credentials or changing user sessions.
 const googleText=await popup.locator('body').innerText();
 const oauthReached=googleText.includes('Sign in')&&!googleText.includes('Error 400');
 await popup.close();
 await page.goto(url);await page.setViewportSize({width:390,height:844});
 await page.getByRole('heading',{level:1}).waitFor();
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+key);
 await page.screenshot({path:`screenshots/${key}-mobile.png`,fullPage:true});
 results.push({site:key,url,status:response.status(),title,privateRouteGated:true,googleSignInPageReached:oauthReached,jsErrors:errors});
 await context.close();
}
await browser.close();await writeFile('operations/live-browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
