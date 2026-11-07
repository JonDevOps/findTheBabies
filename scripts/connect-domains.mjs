import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {brands} from '../src/brands.js';
const cf=args=>JSON.parse(execFileSync('cf',args,{encoding:'utf8',maxBuffer:8e6}));
const norm=x=>x.replace(/^"|"$/g,'');
for(const [key,b] of Object.entries(brands)){
 const before=cf(['dns','records','list','--zone',b.domain]);
 await writeFile(`operations/${key}-dns-before.json`,JSON.stringify(before,null,2));
 const state=JSON.parse(await readFile(`operations/${key}-domains.json`,'utf8'));
 const required=state.customDomains.flatMap(d=>[...(d.requiredDnsUpdates?.desired||[]),...(d.cert?.verification?.dns?.desired||[])]).flatMap(s=>s.records||[]).filter(r=>r.requiredAction==='ADD');
 for(const r of required){
   if(![b.domain,`www.${b.domain}`,`_acme-challenge.${b.domain}`,`_acme-challenge.www.${b.domain}`].includes(r.domainName))throw Error('Unexpected DNS target');
   if(!['A','CNAME','TXT'].includes(r.type))throw Error('Unexpected DNS type');
   const current=cf(['dns','records','list','--zone',b.domain,'--name',r.domainName]);
   if(current.some(x=>x.type===r.type&&norm(x.content)===norm(r.rdata))){console.log('Already set',r.domainName,r.type);continue;}
   const body={type:r.type,name:r.domainName,content:r.rdata,ttl:300,...(r.type!=='TXT'?{proxied:false}:{})};
   const clash=current.filter(x=>['A','AAAA','CNAME'].includes(x.type));
   if(r.type==='A'&&key==='agentgarden'&&clash.length===1&&clash[0].type==='A'&&clash[0].content==='35.219.200.1'){
     cf(['dns','records','edit',clash[0].id,'--zone',b.domain,'--body',JSON.stringify(body)]);
   }else{if(r.type!=='TXT'&&clash.length)throw Error(`Unexpected existing web record for ${r.domainName}`);cf(['dns','records','create','--zone',b.domain,'--body',JSON.stringify(body)]);}
   console.log('Connected',r.domainName,r.type);
 }
 const after=cf(['dns','records','list','--zone',b.domain]);
 const mail=xs=>xs.filter(x=>x.type==='MX'||x.name.includes('_domainkey')||x.name.startsWith('_dmarc.')||/spf1|zoho-verification/.test(x.content)).map(x=>({id:x.id,type:x.type,name:x.name,content:x.content,priority:x.priority})).sort((a,b)=>a.id.localeCompare(b.id));
 if(JSON.stringify(mail(before))!==JSON.stringify(mail(after)))throw Error('Mail DNS changed unexpectedly');
 await writeFile(`operations/${key}-dns-after.json`,JSON.stringify(after,null,2));
 console.log(b.domain,'email DNS unchanged');
}
