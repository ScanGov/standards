


import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let guidanceFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/guidance.json';

  let getDataLocally = false;
  if(process.env.ELEVENTY_RUN_MODE === 'serve') {
    getDataLocally = true;
  }

  const guidanceData = await getData(guidanceFile, getDataLocally);
  return guidanceData;
}

