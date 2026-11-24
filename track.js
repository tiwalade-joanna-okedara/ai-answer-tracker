#!/usr/bin/env node
// Usage: node track.js [config.json]   Appends results to results.jsonl and rebuilds data.json for the dashboard.
const fs=require('fs'),path=require('path');const engines=require('./engines');const {analyse}=require('./analyse');
const cfg=JSON.parse(fs.readFileSync(process.argv[2]||'config.json','utf8'));
(async()=>{const run=new Date().toISOString();const rows=[];
 for(const e of cfg.engines){const eng=engines[e];if(!eng){console.warn('Unknown engine',e);continue;}
  if(!process.env[eng.env]){console.warn(`Skipping ${e}: set ${eng.env}`);continue;}
  for(const p of cfg.prompts){try{const a=await eng.ask(p);const r={run,engine:e,prompt:p,...analyse(a,cfg),excerpt:a.text.slice(0,400)};rows.push(r);
    console.log(`${r.mentioned?'✅':'❌'} ${e.padEnd(10)} ${p.slice(0,60)}${r.competitorsAhead.length?'  (ahead: '+r.competitorsAhead.join(', ')+')':''}`);}
   catch(err){console.error(`⚠️  ${e}: ${err.message}`);}}}
 fs.appendFileSync('results.jsonl',rows.map(r=>JSON.stringify(r)).join('\n')+(rows.length?'\n':''));
 const all=fs.existsSync('results.jsonl')?fs.readFileSync('results.jsonl','utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];
 fs.writeFileSync('data.json',JSON.stringify({brand:cfg.brand,sample:false,results:all},null,1));
 const hit=rows.filter(r=>r.mentioned).length;console.log(`\n${cfg.brand} named in ${hit} of ${rows.length} answers this run. Open index.html to see the trend.`);})();
