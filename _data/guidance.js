


import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';

  let getDataLocally = false;
  if(process.env.ELEVENTY_RUN_MODE === 'serve') {
    getDataLocally = true;
  }

  const auditData = await getData(auditsFile, getDataLocally);

  let standardsMap = new Map();
 
  for(var topic in auditData) {
    auditData[topic].attributes.forEach(a => {
      if(a.standards) {
        a.standards.forEach(s => {
          let topicsRelated = [];
          let currentStandardObject = {};
          if(standardsMap.get(s.url)) {
            currentStandardObject = standardsMap.get(s.url);
            topicsRelated = currentStandardObject.topics;
          } else {
            currentStandardObject.displayName = s.displayName;
            currentStandardObject.description = s.description;
          }
          if(topicsRelated.indexOf(topic) < 0) {
            topicsRelated.push(topic);
          }
          currentStandardObject.topics = topicsRelated;
          standardsMap.set(s.url,currentStandardObject);
        })  
      }
    })
  }

  let guidanceArr = [];

  standardsMap.forEach(standard => {
    let guidanceObj = {};
    guidanceObj.displayName = standard.displayName;
    guidanceObj.description = standard.description;
    guidanceObj.topics = [];
    standard.topics.forEach(t => {
      let topicObj = {};
      topicObj.displayName = auditData[t].displayName;
      topicObj.icon = auditData[t].icon;
      guidanceObj.topics.push(topicObj);
    })
    guidanceArr.push(guidanceObj);
  })

  return guidanceArr;
}

