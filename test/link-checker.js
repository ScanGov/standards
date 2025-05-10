async function checkAllLinks() {
  // Get all links on the page
  const links = Array.from(document.querySelectorAll('a[href]'));
  console.log(`Found ${links.length} links to check...`);
  
  // Store results
  const results = {
    working: [],
    broken: [],
    errors: []
  };
  
  // Function to check a single link
  async function checkLink(url) {
    try {
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to avoid downloading entire page
        mode: 'cors',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      // Try GET if HEAD fails (some servers don't support HEAD)
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        return response.ok;
      } catch (error) {
        // If CORS fails, we can't check external links from browser
        if (error.name === 'TypeError' && error.message.includes('CORS')) {
          throw new Error('CORS blocked');
        }
        throw error;
      }
    }
  }
  
  // Check each link
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.href;
    
    // Skip non-HTTP(S) links
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      console.log(`Skipping non-HTTP link: ${href}`);
      continue;
    }
    
    console.log(`Checking [${i + 1}/${links.length}]: ${href}`);
    
    try {
      const isWorking = await checkLink(href);
      
      if (isWorking) {
        results.working.push({
          url: href,
          text: link.textContent.trim(),
          element: link
        });
      } else {
        results.broken.push({
          url: href,
          text: link.textContent.trim(),
          element: link
        });
      }
    } catch (error) {
      results.errors.push({
        url: href,
        text: link.textContent.trim(),
        element: link,
        error: error.message
      });
    }
  }
  
  // Report results
  console.log('\n=== Link Check Results ===');
  console.log(`✅ Working links: ${results.working.length}`);
  console.log(`❌ Broken links: ${results.broken.length}`);
  console.log(`⚠️  Errors (likely CORS): ${results.errors.length}`);
  
  if (results.broken.length > 0) {
    console.log('\n❌ Broken links:');
    results.broken.forEach((link, index) => {
      console.log(`${index + 1}. ${link.url}`);
      console.log(`   Text: "${link.text}"`);
      console.log(`   Element:`, link.element);
    });
  }
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Links with errors (often due to CORS restrictions):');
    results.errors.forEach((link, index) => {
      console.log(`${index + 1}. ${link.url}`);
      console.log(`   Text: "${link.text}"`);
      console.log(`   Error: ${link.error}`);
      console.log(`   Element:`, link.element);
    });
  }
  
  return results;
}

// Simple version that only checks links on the same domain (avoids CORS issues)
function checkInternalLinks() {
  const links = Array.from(document.querySelectorAll('a[href]'));
  const currentDomain = window.location.origin;
  
  const internalLinks = links.filter(link => {
    try {
      const url = new URL(link.href);
      return url.origin === currentDomain;
    } catch {
      return false;
    }
  });
  
  console.log(`Found ${internalLinks.length} internal links to check...`);
  
  const results = {
    working: [],
    broken: []
  };
  
  internalLinks.forEach(async (link, index) => {
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      if (response.ok) {
        results.working.push(link.href);
        console.log(`✅ [${index + 1}/${internalLinks.length}] ${link.href}`);
      } else {
        results.broken.push(link.href);
        console.log(`❌ [${index + 1}/${internalLinks.length}] ${link.href} - Status: ${response.status}`);
      }
    } catch (error) {
      results.broken.push(link.href);
      console.log(`❌ [${index + 1}/${internalLinks.length}] ${link.href} - Error: ${error.message}`);
    }
  });
  
  return results;
}
checkInternalLinks(); // Only check internal links

// checkAllLinks(); // Check all links (may encounter CORS issues with external links)
