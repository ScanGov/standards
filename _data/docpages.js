import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';

  let getDataLocally = false;
  if(process.env.ELEVENTY_RUN_MODE === 'serve') {
    getDataLocally = true;
  }

  const auditData = await getData(auditsFile, getDataLocally);

  let docpagesData = JSON.parse(fs.readFileSync('./scripts/scrape/data-cleaned.json'));

  let docPages = [];

  for(const topic in auditData) {
    auditData[topic].attributes.forEach(attr => {
      docpagesData.forEach(docpage => {
        if(docpage.key === attr.key) {
          attr.pageInfo = docpage;
          attr.topic = topic;
          attr.topicDisplayName = auditData[topic].displayName;
          attr.topicIcon = auditData[topic].icon;        
          docPages.push(attr);
        }
      })
    })
  }

  return docPages;
}

