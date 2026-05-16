import * as fs from 'fs';
import { getData } from '../scripts/getdata.js';

export default async function () {
  let auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';

  const auditData = await getData(auditsFile, true);
  return auditData;
}

