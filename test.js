const assert=require('assert');const {analyse}=require('./analyse');
const cfg={brand:'acme',aliases:['acme hq'],competitors:['HubSpot','Zoho']};
const r=analyse({text:'Try HubSpot first. Acme HQ is also good. Zoho is cheap.',citations:['https://acme.com/x','https://a.com']},cfg);
assert.strictEqual(r.mentioned,true);assert.deepStrictEqual(r.competitorsAhead,['HubSpot']);assert.strictEqual(r.citedUrls.length,1);
assert.strictEqual(analyse({text:'Use Zoho.'},cfg).mentioned,false);console.log('All tests passed');
