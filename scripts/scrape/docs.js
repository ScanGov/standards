import puppeteer from 'puppeteer'
import * as fs from 'fs'
import { url } from 'inspector';

// get all the 2nd links from tr on standards homepage:
let standardsPages = [
  "https://docs.scangov.org/crawlable",
  "https://docs.scangov.org/text-content",
  "https://docs.scangov.org/accessibility-best-practices",
  "https://docs.scangov.org/aria",
  "https://docs.scangov.org/audio-video",
  "https://docs.scangov.org/color-contrast",
  "https://docs.scangov.org/hidden",
  "https://docs.scangov.org/language",
  "https://docs.scangov.org/names-labels",
  "https://docs.scangov.org/navigation",
  "https://docs.scangov.org/tables-lists",
  "https://docs.scangov.org/page-title",
  "https://docs.scangov.org/page-description",
  "https://docs.scangov.org/viewport-meta-tag",
  "https://docs.scangov.org/https",
  "https://docs.scangov.org/www-resolution",
  "https://docs.scangov.org/stld",
  "https://docs.scangov.org/cumulative-layout-shift",
  "https://docs.scangov.org/first-contentful-paint",
  "https://docs.scangov.org/interaction-to-next-paint",
  "https://docs.scangov.org/largest-contentful-paint",
  "https://docs.scangov.org/time-to-first-byte",
  "https://docs.scangov.org/sitemaps",
  "https://docs.scangov.org/robots-txt",
  "https://docs.scangov.org/canonicalization",
  "https://docs.scangov.org/content-security-policy",
  "https://docs.scangov.org/hsts",
  "https://docs.scangov.org/security-txt",
  "https://docs.scangov.org/x-content-type-options",
  "https://docs.scangov.org/metadata",
  "https://docs.scangov.org/open-graph"
]

const browser = await puppeteer.launch({
  headless: true
})

let index = 0;
let allPageContent = [];
while(index < standardsPages.length) {
  const page = await browser.newPage()
  let currentPageUrl = standardsPages[index];
  await page.goto(currentPageUrl);
  await page.setViewport({ width: 1080, height: 1024 })

  let pageContent = await page.evaluate((containerSelector) => {
    let pageData = {};

    const container = document.querySelector(containerSelector);
    if (!container) return [];
    
    const sections = [];
    const h2Elements = container.querySelectorAll('h2');
    
    // If no H2 elements found, return empty array
    if (h2Elements.length === 0) return [];
    
    let hasAboutHeader = false;

    // Process each H2 element
    h2Elements.forEach((h2, index) => {
      const sectionData = {
        title: h2.textContent.trim().split('href')[0].trim(),
        content: ''
      };
      if(sectionData.title.indexOf('About') > -1) {
        hasAboutHeader = true;
      }
      
      // Get all elements that follow this H2 until the next H2 or end of container
      let nextElement = h2.nextElementSibling;
      let contentHtml = '';
      
      while (nextElement && nextElement.tagName !== 'H2') {
        contentHtml += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }
      
      sectionData.content = contentHtml;
      sections.push(sectionData);
    });
    
    pageData.sections = sections;


    // if the first element is not h2
    // the first section up to the next h2 or end is the about seciton
    if(!hasAboutHeader) {
      let firstElement = container.children[0];
      if(firstElement.nodeName != 'H2') {
        const topSectionData = {
          title: 'About',
          content: ''
        };
        let nextElement = firstElement.nextElementSibling;
        let contentHtml = '';
        
        while (nextElement && nextElement.tagName !== 'H2') {
          contentHtml += nextElement.outerHTML;
          nextElement = nextElement.nextElementSibling;
        }
        
        topSectionData.content = contentHtml;
        sections.push(topSectionData);
      }
    }

    return pageData;
  }, '.post');

  let relatedLinks = await page.evaluate((containerSelector) => {
    let links = [];

    let pageData = {};
    console.log(containerSelector)
    const container = document.querySelector(containerSelector);

    if(container.querySelector('audio')) {
      let mp3Link = document.querySelector('audio source').src;
      if(mp3Link) {
        pageData.audio = mp3Link;
      }
    }


    const h2Elements = container.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
      if(h2.textContent.indexOf('Related') > -1) {
        let nextElement = h2.nextElementSibling;


        h2Elements.forEach(h2 => {
          if(h2.textContent.indexOf('Related') > -1) {
            console.log(h2.nextElementSibling.nodeName)
          }
        })
      
        while (nextElement && nextElement.tagName !== 'H2') {
          if(nextElement.nodeName == 'UL') {
            let relatedLis = nextElement.querySelectorAll('li a');
            relatedLis.forEach(li => {
              let linkObject = {};
              linkObject.url = li.href;
              linkObject.text = li.textContent;
              links.push(linkObject);
            })

          }
          nextElement = nextElement.nextElementSibling;
        }
      }
    })

    pageData.links = links;
    return pageData;
  }, '#post');

  pageContent.key = currentPageUrl.replace('https://docs.scangov.org/','');
  pageContent.relatedLinks = relatedLinks;
  allPageContent.push(pageContent);
  index++;
}
  
await browser.close()

fs.writeFileSync('./data.json',JSON.stringify(allPageContent),'utf8');
