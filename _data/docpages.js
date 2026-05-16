import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';

  const auditData = await getData(auditsFile);

  let docPages = [];

  for(const topic in auditData) {
    auditData[topic].attributes.forEach(attr => {
      attr.topic = topic;
      attr.topicDisplayName = auditData[topic].displayName;
      attr.topicIcon = auditData[topic].icon;
      docPages.push(attr);
    })
  }

  return docPages;
}

