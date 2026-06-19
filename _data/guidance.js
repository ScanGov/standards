


import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let guidanceFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/guidance.json';

  const guidanceData = await getData(guidanceFile, true);
  return guidanceData;
}

