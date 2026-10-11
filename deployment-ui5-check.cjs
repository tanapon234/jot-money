// Compare public static release bytes only. Never reads browser financial data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=process.argv[2],wait=Number(process.argv[3]||0),dist=path.join(__dirname,'dist');
if(!/^https:\/\/([\w-]+\.)?jot-money-demo\.pages\.dev\/$/.test(base))throw Error('Unexpected deployment target');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const files=walk(dist),text=/\.(html|css|js|json|webmanifest|svg|txt|md)$/i;
const normalize=(bytes,file)=>text.test(file)?Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n')):bytes;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function check(){await Promise.all(files.map(async file=>{const relative=path.relative(dist,file).replaceAll('\\','/'),response=await fetch(base+relative+'?release='+Date.now(),{signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,relative+' HTTP');assert.equal(hash(normalize(Buffer.from(await response.arrayBuffer()),file)),hash(normalize(fs.readFileSync(file),file)),relative+' bytes mismatch')}));return files.length}
(async()=>{const deadline=Date.now()+wait*1000;do{try{console.log('PASS deployed release: '+await check()+' assets match '+fs.readFileSync(path.join(__dirname,'VERSION'),'utf8').trim()+' at '+base);return}catch(e){if(Date.now()>=deadline)throw e;console.log('Waiting for deployment: '+e.message.split('\n')[0].slice(0,180));await new Promise(r=>setTimeout(r,10000))}}while(true)})().catch(e=>{console.error(e.message.slice(0,500));process.exitCode=1});
