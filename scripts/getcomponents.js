import * as fs from 'fs'

let scangovCSS = 'https://raw.githubusercontent.com/ScanGov/components/refs/heads/main/scangov.css';
try {
  const response = await fetch(scangovCSS);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const cssText = await response.text();
  fs.writeFileSync('./public/css/scangov.css',cssText,'utf8');
} catch (error) {
  throw new Error(`Fetch error: ${error.message}`);
}