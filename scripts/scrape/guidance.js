import puppeteer from 'puppeteer'
import * as fs from 'fs'

let guidanceLinks = [
  {
    link: 'https://docs.scangov.org/21st-century-idea',
    text: '21st Century Integrated Digital Experience Act'
  },
  {
    link: 'https://docs.scangov.org/robots-txt-org',
    text: 'The Web Robots Pages'
  },
  {
    link: 'https://docs.scangov.org/wcag',
    text: 'Web Content Accessibility Guidelines'
  },
  {
    link: 'https://docs.scangov.org/federal-website-standards',
    text: 'Federal website standards'
  },
  {
    link: 'https://docs.scangov.org/google-search-central',
    text: 'Google Search Central'
  },
  {
    link: 'https://docs.scangov.org/web-vitals-core-web-vitals',
    text: 'Web Vitals / Core Web Vitals'
  },
  {
    link: 'https://docs.scangov.org/sitemaps-org',
    text: 'sitemaps.org'
  },
  {
    link: 'https://docs.scangov.org/cisa-web-security',
    text: 'CISA Website Security'
  },
  {
    link: 'https://docs.scangov.org/cybersecurity-performance-goals',
    text: 'CISA Cybersecurity Performance Goals'
  },
  { link: 'https://docs.scangov.org/rfc9116', text: 'RFC 9116' },
  {
    link: 'https://docs.scangov.org/security-txt',
    text: 'security.txt'
  },
  {
    link: 'https://docs.scangov.org/owasp-top-10',
    text: 'OWASP Top 10'
  },
  { link: 'https://docs.scangov.org/open-graph', text: 'Open Graph' }
]

const browser = await puppeteer.launch({
  headless: true
})

let index = 0;
let allPageContent = [];
while(index < guidanceLinks.length) {
  const page = await browser.newPage()
  let currentPageUrl = guidanceLinks[index].link;
  await page.goto(currentPageUrl);
  await page.setViewport({ width: 1080, height: 1024 })

  let pageContent = await page.evaluate((containerSelector) => {
    let pageData = {};

    const container = document.querySelector(containerSelector);
    if (!container) return [];

    pageData.title = container.querySelector('h1').textContent.trim();
    pageData.description = container.querySelector('.lead').textContent.trim();

    const h2Elements = container.querySelectorAll('h2');
        
    const sections = [];
    // Process each H2 element
    h2Elements.forEach((h2, index) => {
      let elementHeader = h2.textContent.trim().split('href')[0].trim();

      if(elementHeader !== 'Listen' && elementHeader !== 'Related' && elementHeader !== 'Topics') {
        const sectionData = {
          title: h2.textContent.trim().split('href')[0].trim(),
          content: ''
        };
        
        // Get all elements that follow this H2 until the next H2 or end of container
        let nextElement = h2.nextElementSibling;
        let contentHtml = '';
        
        while (nextElement && nextElement.tagName !== 'H2') {
          contentHtml += nextElement.outerHTML.trim();
          nextElement = nextElement.nextElementSibling;
        }
        
        sectionData.content = contentHtml;
        sections.push(sectionData);
      }
    })

    pageData.sections = sections;

    let linkList = [];

    let nextEl = container.querySelector('.post').nextElementSibling;
    if(nextEl.nodeName == 'UL') {
      nextEl.querySelectorAll('a').forEach(link => {
        let linkObj = {};
        linkObj.link = link.href;
        linkObj.text = link.textContent;
        linkList.push(linkObj);
      })
    }
    pageData.links = linkList;

    if(container.querySelector('audio')) {
      let mp3Link = document.querySelector('audio source').src;
      if(mp3Link) {
        pageData.audio = mp3Link;
      }
    }    

    return pageData;
  }, 'main');

  pageContent.key = currentPageUrl.replace('https://docs.scangov.org/','');
  allPageContent.push(pageContent);
  index++;
}
  
await browser.close()

fs.writeFileSync('./guidance.json',JSON.stringify(allPageContent),'utf8');


// get audio

// skip related & topics
