// Administrative helper. Credentials are resolved by the installed Firebase CLI.
// Never log tokens, provider secrets, or complete authentication user records.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const base = path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'firebase-tools/lib/');
const {Client} = require(base+'apiv2');
const projects = {findthebabies:'studio-578944933-7a8c8'};
const domains = {findthebabies:'findthebabies.org'};
async function run(){
 const [action,key]=process.argv.slice(2); const project=projects[key];if(!project)throw Error('Unknown site');
 await require(base+'requireAuth').requireAuth({...require(base+'auth').getGlobalDefaultAccount(),project,nonInteractive:true});
 const hosting = new Client({urlPrefix:'https://firebasehosting.googleapis.com',apiVersion:'v1beta1'});
 const identity = new Client({urlPrefix:'https://identitytoolkit.googleapis.com'});
 fs.mkdirSync('operations',{recursive:true});
 if(action==='inspect'){
  const api=require(base+'gcp/rules');
  try {const releases=await api.listAllReleases(project);const rel=releases.find(r=>r.name.endsWith('/cloud.firestore'));if(rel){const content=await api.getRulesetContent(rel.rulesetName);fs.writeFileSync(`operations/${key}-previous-rules.json`,JSON.stringify(content,null,2));console.log('Rules backed up',JSON.stringify(content));}}catch(e){console.log('Rules inspection',e.message)}
  try{const u=await require(base+'gcp/auth').findUser(project,'w3develops@gmail.com');console.log('Existing owner',u.uid,u.email)}catch(e){console.log('Owner lookup',e.message)}
  try{const r=await identity.get(`/admin/v2/projects/${project}/config`,{skipLog:{resBody:true}});const safe={authorizedDomains:r.body.authorizedDomains,emailEnabled:r.body.signIn?.email?.enabled};fs.writeFileSync(`operations/${key}-auth-before.json`,JSON.stringify(safe,null,2));console.log('Auth config',JSON.stringify(safe))}catch(e){console.log('Auth inspect',e.message)}
 }
 if(action==='domains-create'){
  const root=domains[key];for(const domain of [root,`www.${root}`]){
   // AgentGarden's www already redirects at Cloudflare.
   if(key==='agentgarden'&&domain.startsWith('www.'))continue;
   const parent=`projects/${project}/sites/${project}`;
   try{const existing=await hosting.get(`/${parent}/customDomains/${domain}`); console.log('Existing',existing.body.name)}catch(e){if(e.status!==404&&!e.message.includes('404'))throw e;const r=await hosting.post(`/${parent}/customDomains`,domain===root?{}:{redirectTarget:root},{queryParams:{customDomainId:domain}});console.log('Created',r.body.name)}
  }
 }
 if(action==='domains-status'){
  const r=await hosting.get(`/projects/${project}/sites/${project}/customDomains`);fs.writeFileSync(`operations/${key}-domains.json`,JSON.stringify(r.body,null,2));console.log(JSON.stringify(r.body.customDomains?.map(d=>({domain:d.name.split('/').pop(),host:d.hostState,ownership:d.ownershipState,certificate:d.cert?.state,issues:d.issues}))));
 }
 if(action==='auth-finish'){
  const api=require(base+'gcp/auth');const current=await api.getAuthDomains(project);const next=[...new Set([...current,domains[key],`www.${domains[key]}`,`${project}.web.app`,`${project}.firebaseapp.com`])];if(next.length!==current.length)await api.updateAuthDomains(project,next);
  let u;try{u=await api.findUser(project,'w3develops@gmail.com')}catch(e){if(e.message!=='No users found')throw e;}
  if(!u){const uid='jonathan-owner-'+key;fs.writeFileSync(`operations/${key}-owner-import.json`,JSON.stringify({users:[{localId:uid,email:'w3develops@gmail.com',displayName:'Jonathan Jackson',emailVerified:false,disabled:false}]}));execFileSync('npx',['-y','firebase-tools@latest','auth:import',`operations/${key}-owner-import.json`,'--project',project,'--non-interactive'],{stdio:'inherit'});u=await api.findUser(project,'w3develops@gmail.com');}
  const provider=await identity.get(`/admin/v2/projects/${project}/defaultSupportedIdpConfigs/google.com`);
  console.log(JSON.stringify({project,user:{uid:u.uid,email:u.email,disabled:u.disabled,emailVerified:u.emailVerified},googleEnabled:provider.body.enabled,authorizedDomains:await api.getAuthDomains(project)}));
 }
}
run().catch(e=>{console.error(e.message);process.exitCode=1});
