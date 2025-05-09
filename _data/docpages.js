import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';

  let getDataLocally = false;
  if(process.env.ELEVENTY_RUN_MODE === 'serve') {
    getDataLocally = true;
  }

  const auditData = await getData(auditsFile, getDataLocally);

  let docPages = [];

  for(const topic in auditData) {
    auditData[topic].attributes.forEach(attr => {
      attr.topic = topic;
      attr.topicDisplayName = auditData[topic].displayName;
      attr.topicIcon = auditData[topic].icon;
      console.log(attr.key)
      docPages.push(attr);
    })
  }

  return docPages;
}

