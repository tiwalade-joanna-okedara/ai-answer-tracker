const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function mentions(text,names){const t=text.toLowerCase();return names.filter(n=>new RegExp('\\b'+esc(n.toLowerCase())+'\\b').test(t));}
function position(text,names){const t=text.toLowerCase();let best=-1;for(const n of names){const i=t.indexOf(n.toLowerCase());if(i>=0&&(best<0||i<best))best=i;}return best;}
function analyse(answer,cfg){
  const brandNames=[cfg.brand,...(cfg.aliases||[])];
  const brandHit=mentions(answer.text,brandNames).length>0;
  const comp=(cfg.competitors||[]).filter(c=>mentions(answer.text,[c]).length);
  const bp=position(answer.text,brandNames);
  const ahead=comp.filter(c=>{const p=position(answer.text,[c]);return bp<0||p<bp;});
  const cited=(answer.citations||[]).filter(u=>brandNames.some(n=>u.toLowerCase().includes(n.toLowerCase().replace(/\s/g,''))));
  return {mentioned:brandHit,competitorsMentioned:comp,competitorsAhead:ahead,citedUrls:cited,citationCount:(answer.citations||[]).length};
}
module.exports={analyse,mentions};
