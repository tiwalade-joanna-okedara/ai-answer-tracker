// Each engine takes a prompt and returns { text, citations[] }. Keys come from environment variables.
async function post(url,headers,body){const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
  const d=await r.json();if(!r.ok)throw new Error(`${r.status} ${JSON.stringify(d).slice(0,200)}`);return d;}
module.exports={
  openai:{env:'OPENAI_API_KEY',async ask(p){const d=await post('https://api.openai.com/v1/chat/completions',{authorization:'Bearer '+process.env.OPENAI_API_KEY},{model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'user',content:p}]});return {text:d.choices[0].message.content,citations:[]};}},
  anthropic:{env:'ANTHROPIC_API_KEY',async ask(p){const d=await post('https://api.anthropic.com/v1/messages',{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},{model:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-5',max_tokens:1200,messages:[{role:'user',content:p}]});return {text:d.content.map(c=>c.text||'').join(''),citations:[]};}},
  perplexity:{env:'PERPLEXITY_API_KEY',async ask(p){const d=await post('https://api.perplexity.ai/chat/completions',{authorization:'Bearer '+process.env.PERPLEXITY_API_KEY},{model:process.env.PERPLEXITY_MODEL||'sonar',messages:[{role:'user',content:p}]});return {text:d.choices[0].message.content,citations:d.citations||[]};}}
};
