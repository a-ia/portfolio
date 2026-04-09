/// SECTION 1: ASCII Animation Functionality
const textarea = document.getElementById('ascii-art');
let originalFrames = [];
let frames = [];
let currentFrameIndex = 13;
let animationInterval;
let isMobileView = false;

// Function to check if in mobile view
function checkMobileView() {
    return window.innerWidth <= 768 && window.innerWidth > 0;
}

// Function to trim first 12 characters from each line of frames for mobile view
function trimFramesForMobile(originalFrames) {
    return originalFrames.map(frame => {
        const lines = frame.split('\n');
        
        const trimmedLines = lines.map(line => 
            line.length > 12 ? line.slice(12) : line
        );
        
        return trimmedLines.join('\n');
    });
}

// Function to load ASCII frames from text files
async function loadFrames() {
    try {
        const loadedFrames = [];
        for (let i = 1; i <= 33; i++) {
            console.log(`Fetching: ./ascii/${i}.txt`);
            const response = await fetch(`./ascii/${i}.txt`);
            
            if (!response.ok) {
                console.error(`Failed to fetch frame ${i}`); 
                continue;
            }
            
            const frame = await response.text();
            loadedFrames.push(frame);
        }
        console.log(`Loaded ${loadedFrames.length} frames`);
        
        // Store original frames for restore
        originalFrames = [...loadedFrames];

        // Check if in mobile view and trim frames if necessary
        isMobileView = checkMobileView();
        frames = isMobileView ? trimFramesForMobile(loadedFrames) : loadedFrames;

        // Ascii fade-in on intial load
        setTimeout(() => {
            textarea.classList.add('visible');
        }, 100);

      return frames;
    } catch (error) {
        console.error('Error loading frames:', error);
        return [];
    }
}

// Function to start the ASCII animation
function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
        textarea.value = frames[currentFrameIndex];
    }, 100); 
}

// Function to stop the ASCII animation
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        textarea.value = frames[13]; // Reset to the default frame
    }
}

// Resize event listener to handle mobile view changes
window.addEventListener('resize', () => {
    const newMobileView = checkMobileView();
    
    if (newMobileView !== isMobileView && frames.length > 0) {
        isMobileView = newMobileView;
        
        // Re-trim or restore frames based on current view
        frames = isMobileView ? trimFramesForMobile(originalFrames) : [...originalFrames];
        
        // Update current frame display
        textarea.value = frames[currentFrameIndex];
    }
});

// SECTION 2: Navigation Menu Functionality
function toggleMenu(event) {
  event.preventDefault();

  // Get the closest menu item
  const parentMenu = event.target.closest('.menu-item');
  
  if (parentMenu) {
    const submenu = parentMenu.querySelector('.submenu');

    // Toggle the 'expanded' class for the clicked menu
    if (submenu) {
      const isExpanded = parentMenu.classList.contains('expanded');
      parentMenu.classList.toggle('expanded');

      // document-wide click listener to close the menu from whereever
      const closeMenu = (e) => {
        if (!parentMenu.contains(e.target)) {
          parentMenu.classList.remove('expanded');
          document.removeEventListener('click', closeMenu);
        }
      };

      // if menu is expanding, set up click listener
      if (!isExpanded) {
        setTimeout(() => {
          document.addEventListener('click', closeMenu);
        }, 0);
      }
    }

    // Close all other expanded menus
    document.querySelectorAll('.menu-item.expanded').forEach((item) => {
      if (item !== parentMenu) {
        item.classList.remove('expanded');
      }
    });
  }
}

// SECTION 3: Dynamic Content Loading
function loadContent(contentKey) {
    const contentDiv = document.getElementById('content');
    const normalizedKey = contentKey.toLowerCase().replace(/\s+/g, '-');
    const filePath = `page/${normalizedKey}.html`; // Note: enable direct linking for htmls
    
    // Note: history.pushState() updates browser URL without page reload
    history.pushState(null, '', `#${normalizedKey}`);
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load content from ${filePath}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
             borderNavigationDiv();
       })
        .catch(error => {
            console.error(error);
            contentDiv.innerHTML = "<div class=\"margin\"><h2>Error</h2><p>Could not load the content. Please try again later.</p></div>";
             borderNavigationDiv();
       });

  function borderNavigationDiv() {
    const navigationDiv = document.querySelector('.navigation');

    if (navigationDiv) {
        navigationDiv.classList.add('border');
    }
  }
}

// Note: handles browser navigation events (back/forward) using popstate event listener by loading content based on the URL hash
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadContent(hash.replace(/-/g, ' '));
    }
});

// SECTION 4: Page Load Initialization
window.addEventListener('load', () => {
    const contentDiv = document.getElementById('content');
    
    // Check for initial hash and load content if present
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        loadContent(initialHash.replace(/-/g, ' '));
    }

    // Initialize ASCII frames
    loadFrames().then(loadedFrames => {
        frames = loadedFrames;
        if (frames.length > 0) {
            textarea.value = frames[currentFrameIndex];
            
            // Add event listeners for animation on hover
            textarea.addEventListener('mouseenter', startAnimation);
            textarea.addEventListener('mouseleave', stopAnimation);
        }
    }).catch(error => {
        console.error('Initialization error:', error);
    });

    // Reset and display ASCII textarea inside the content div
    contentDiv.innerHTML = '';
    contentDiv.appendChild(textarea);
});


// SECTION 5: MISC
function refreshPath() {
    const currentPath = window.location.pathname;
    const hasIndexHtml = currentPath.endsWith('index.html');
    const basePath = currentPath.split('#')[0];
    
    if (hasIndexHtml) {
        window.location.href = basePath;
    } else {
        window.location.href = basePath + 'index.html';
    }
}
  /* Button, drop down for sidebar */
        const socialsBtn = document.querySelector('.socials-button');
        const chevron = document.querySelector('.chevron');
        const dropdown = document.querySelector('.social-dropdown');

        socialsBtn.addEventListener('click', () => {
            chevron.classList.toggle('open');
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!socialsBtn.contains(event.target) && !dropdown.contains(event.target)) {
                chevron.classList.remove('open');
                dropdown.classList.remove('show');
            }
        });

