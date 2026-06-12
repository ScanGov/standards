import { getData } from '../scripts/getdata.js';

export default async function () {
  const auditsFile = 'https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json';
  const auditData = await getData(auditsFile);

  const items = [
    { title: 'Standards', url: '/', icon: 'fa-solid fa-certificate' },
    { title: 'Guidance', url: '/guidance/', icon: 'fa-solid fa-scroll' },
  ];

  for (const topic in auditData) {
    items.push({
      title: auditData[topic].displayName,
      url: `/${topic}/`,
      icon: `fa-solid fa-${auditData[topic].icon}`,
    });
  }

  return items;
}
