import * as fs from 'fs';

// client side script to grab topics
/*let allTopicLinks = [];
document.querySelectorAll('tbody tr').forEach(row => {
  let obj = {};
  obj.link = row.querySelector('td:nth-child(2) a').href;
  obj.links = [];
  row.querySelectorAll('td:nth-child(1) a').forEach(t => {
    obj.links.push(t.href);
  })
  allTopicLinks.push(obj);
})*/

let allTopicsByGuidance = [{"link":"21st-century-idea","links":["accessibility","content","performance","search-engine-optimization","security"]},{"link":"28-cfr-part-35","links":["accessibility","content"]},{"link":"cybersecurity-performance-goals","links":["security"]},{"link":"federal-website-standards","links":["accessibility","content","search-engine-optimization","social-media"]},{"link":"google-search-central","links":["content","search-engine-optimization"]},{"link":"gsa-site-scanning","links":["ai","accessibility","content","performance","search-engine-optimization","security","social-media"]},{"link":"memorandum-m-23-22","links":["accessibility","content","performance","search-engine-optimization","security"]},{"link":"open-graph","links":["content","search-engine-optimization","social-media"]},{"link":"owasp-top-10","links":["security"]},{"link":"rfc9116","links":["security"]},{"link":"security-txt","links":["security"]},{"link":"sitemaps-org","links":["ai","content","search-engine-optimization"]},{"link":"wcag","links":["accessibility","content","search-engine-optimization"]},{"link":"robots-txt-org","links":["ai","search-engine-optimization"]},{"link":"cisa-web-security","links":["security"]},{"link":"web-vitals-core-web-vitals","links":["content","performance","search-engine-optimization"]}];

let govguidance = JSON.parse(fs.readFileSync('../../_data/govguidance.json'));

govguidance.forEach(g => {
  allTopicsByGuidance.forEach(t => {
    if(t.link === g.key) {
      g.topics = t.links;
    }
  })
})

// fs.writeFileSync('./govguidance.json',JSON.stringify(govguidance),'utf8');

// let allGuidanceByTopic = [];

let topics = ["accessibility","content","performance","search-engine-optimization","security","social-media","ai"];

// let topicMap = new Map();
// topics.forEach(t => {
//   topicMap.set(t,[]);
// })

// allTopicsByGuidance.forEach(g => {
//   g.links.forEach(l => {
//     let topicArray = topicMap.get(l)
//     topicArray.push(g.link);
//     topicMap.set(l,topicArray);
//   })
// })

// console.log(topicMap)

let allGuidanceByTopic = {
  'accessibility': [
    '21st-century-idea',
    '28-cfr-part-35',
    'federal-website-standards',
    'gsa-site-scanning',
    'memorandum-m-23-22',
    'wcag'
  ],
  'content': [
    '21st-century-idea',
    '28-cfr-part-35',
    'federal-website-standards',
    'google-search-central',
    'gsa-site-scanning',
    'memorandum-m-23-22',
    'open-graph',
    'sitemaps-org',
    'wcag',
    'web-vitals-core-web-vitals'
  ],
  'performance': [
    '21st-century-idea',
    'gsa-site-scanning',
    'memorandum-m-23-22',
    'web-vitals-core-web-vitals'
  ],
  'search-engine-optimization': [
    '21st-century-idea',
    'federal-website-standards',
    'google-search-central',
    'gsa-site-scanning',
    'memorandum-m-23-22',
    'open-graph',
    'sitemaps-org',
    'wcag',
    'robots-txt-org',
    'web-vitals-core-web-vitals'
  ],
  'security': [
    '21st-century-idea',
    'cybersecurity-performance-goals',
    'gsa-site-scanning',
    'memorandum-m-23-22',
    'owasp-top-10',
    'rfc9116',
    'security-txt',
    'cisa-web-security'
  ],
  'social-media': [ 'federal-website-standards', 'gsa-site-scanning', 'open-graph' ],
  'ai': [ 'gsa-site-scanning', 'sitemaps-org', 'robots-txt-org' ]
}