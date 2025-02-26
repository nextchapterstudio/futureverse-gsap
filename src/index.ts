import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

// Set up responsive breakpoints
const breakpoints = {
  mobile: 767,
  tablet: 992,
  desktop: 1200,
};

// Create helper function for responsive scroll settings
function getScrollSettings(baseSettings, isMobile) {
  // Clone the base settings to avoid mutation
  const settings = { ...baseSettings };

  if (isMobile) {
    // Adjust end distance for mobile (smoother exit)
    settings.end = settings.end.replace(/\+=(\d+)%/, (match, percent) => {
      const mobilePercent = Math.round(parseInt(percent) * 0.8); // 80% of desktop value
      return `+=${mobilePercent}%`;
    });

    // Increase scrub value for smoother animations on mobile
    if (settings.scrub) {
      settings.scrub = typeof settings.scrub === 'boolean' ? 1 : Math.min(settings.scrub * 1.5, 5);
    }

    // Add a small delay to prevent immediate pinning when scrolling starts
    settings.anticipatePin = settings.anticipatePin || 0.2;

    // Add markers for debugging (remove in production)
    // settings.markers = true;
  }

  return settings;
}

// Helper function to apply word wrapping to prevent splitting across lines
function prepareTextForAnimation(element) {
  if (!element) return null;

  // First split into words
  const splitWords = new SplitText(element, {
    type: 'words',
    wordsClass: 'split-word',
  });

  // Add word-wrap: nowrap to each word to prevent breaking
  gsap.set(splitWords.words, {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    margin: '0 0.2em 0 0', // Add a small gap between words
  });

  return splitWords;
}

function createSequentialScrambleAnimation(element) {
  if (!element) return gsap.timeline(); // Return empty timeline if no element

  // Split text into lines
  const splitText = new SplitText(element, {
    type: 'lines',
    linesClass: 'scramble-line',
  });

  // Create a master timeline for the entire animation
  const masterTl = gsap.timeline();

  // Animate each line sequentially
  splitText.lines.forEach((line, index) => {
    // Create a timeline for this specific line
    const lineTl = gsap.timeline();

    // Animate the line with scramble text
    lineTl.to(line, {
      duration: 1.2,
      opacity: 1,
      scrambleText: {
        text: line.innerHTML,
        chars: 'upperCase',
        revealDelay: 0.5,
        speed: 0.3,
        tweenLength: false,
        delimiter: ' ',
      },
      ease: 'power1.inOut',
    });

    // Add this line's animation to the master timeline
    masterTl.add(lineTl, index > 0 ? '-=0.8' : 0);
  });

  // Just return the timeline
  return masterTl;
}

export const landingTimeline = () => {
  const intoText = document.querySelector('.landing-text') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Use the new line-based splitting function
  const splitTextAnimation = createSequentialScrambleAnimation(intoText);

  // Base settings
  const baseSettings = {
    trigger: '.home-landing-section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1.5,
    anticipatePin: 0.5,
  };

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  const landing = gsap.timeline({
    scrollTrigger: scrollSettings,
  });

  landing
    .to('.readyverse-logo-home', {
      opacity: 1,
      duration: 2,
    })
    .to('.readyverse-logo-home', {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: 'power2.out',
    })
    .to(intoText, {
      opacity: 1,
      duration: 2,
    });

  return landing;
};

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.third-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const scramble1 = document.querySelector('.scramble-1') as HTMLElement;
  const scramble2 = document.querySelector('.scamble-2') as HTMLElement;
  const goAnywhereCopy = document.querySelector('.go-anywhere-copy') as HTMLElement;
  const createText = document.querySelector('.scramble-3') as HTMLElement;
  const anythingText = document.querySelector('.scramble-4') as HTMLElement;
  const createAnythingCopy = document.querySelector('.create-anything-max-width') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Use line-based splitting for both text elements
  const goAnywhereTextSplit = createSequentialScrambleAnimation(goAnywhereCopy);
  const createAnythingTextSplit = createSequentialScrambleAnimation(createAnythingCopy);

  // Pre-set elements to hidden for performance
  gsap.set(
    [
      secondImage,
      centerImage,
      clippedBox,
      scramble1,
      scramble2,
      content,
      swappableWrapper,
      createText,
      anythingText,
    ],
    { autoAlpha: 0 }
  );

  gsap.set([createAnythingCopy, goAnywhereCopy], { opacity: 0 });

  gsap.set(centerImage, { zIndex: 5 });

  // Base scroll settings
  const baseSettings = {
    trigger: '.home-scroll-section',
    start: 'top top',
    end: '+=650%',
    pin: true,
    scrub: 2.5,
    anticipatePin: 0.5,
  };

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  const firstTl = gsap.timeline({
    scrollTrigger: scrollSettings,
  });

  // If mobile, adjust timing and ease functions for smoother experience
  const mobileAdjustments = isMobile
    ? {
        easeIn: 'power1.inOut',
        easeOut: 'power2.inOut',
        durationMultiplier: 0.8, // Slightly shorter durations for mobile
      }
    : {
        easeIn: 'power1.inOut',
        easeOut: 'power1.inOut',
        durationMultiplier: 1,
      };

  const adjustDuration = (base) => base * mobileAdjustments.durationMultiplier;

  firstTl
    .to(
      clippedBox,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
        ease: mobileAdjustments.easeIn,
      },
      '>'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
        ease: mobileAdjustments.easeIn,
      },
      '>'
    )
    .to(content, {
      autoAlpha: 1,
      duration: adjustDuration(2),
      ease: mobileAdjustments.easeIn,
    })
    .to(
      scramble1,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
        ease: mobileAdjustments.easeIn,
      },
      '>'
    )
    .to(
      scramble2,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
        ease: mobileAdjustments.easeIn,
      },
      '>'
    )
    .to(
      goAnywhereCopy,
      {
        opacity: 1,
        duration: adjustDuration(1.5),
        ease: mobileAdjustments.easeIn,
      },
      '>'
    )
    .to(
      secondImage,
      {
        autoAlpha: 0.15,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '-=1'
    )
    .to(clippedBox, {
      width: '100%',
      height: '100%',
      duration: adjustDuration(7),
      ease: mobileAdjustments.easeOut,
    })
    .to(
      secondImage,
      {
        autoAlpha: 0.4,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '-=6'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '-=4'
    )
    .to(
      content,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '-=3'
    )
    .to(
      firstImage,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '>-0.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 1,
        duration: adjustDuration(4),
        ease: mobileAdjustments.easeIn,
      },
      '-=2'
    )
    .to(
      createText,
      {
        autoAlpha: 1,
        duration: adjustDuration(3.5),
        ease: mobileAdjustments.easeIn,
      },
      '-=3.5'
    )
    .to(
      anythingText,
      {
        autoAlpha: 1,
        duration: adjustDuration(3.5),
        ease: mobileAdjustments.easeIn,
      },
      '-=2.5'
    )
    .to(
      createAnythingCopy,
      {
        opacity: 1,
        duration: adjustDuration(3.5),
        ease: mobileAdjustments.easeIn,
      },
      '>-1'
    )
    .to(
      centerImage,
      {
        autoAlpha: 1,
        duration: adjustDuration(4.5),
        ease: mobileAdjustments.easeIn,
      },
      '-=3.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
        ease: mobileAdjustments.easeIn,
      },
      '<'
    )
    .to(
      '.content-bottom',
      {
        opacity: 0,
        duration: adjustDuration(2.5),
        ease: mobileAdjustments.easeIn,
      },
      '-=1.5'
    );

  // Add a small pause at the end for mobile to prevent abrupt endings
  if (isMobile) {
    firstTl.to({}, { duration: 1 });
  }

  const mm = gsap.matchMedia();

  // Add the scale animation only on desktop/tablet
  mm.add('(min-width: 768px)', () => {
    // Add scale animation as the very last step
    firstTl.add(
      gsap.to(centerImage, {
        scale: 0.7,
        ease: 'power1.inOut',
        duration: 4,
      }),
      // Adding after the previous timeline is complete
      '>'
    );

    return () => {
      // Clean up if needed
    };
  });

  // Additional handling for mobile
  mm.add('(max-width: 767px)', () => {
    // Ensure there's no scale applied
    gsap.set(centerImage, { scale: 1 });

    // Add a small delay at the end to soften the transition out of the pinned section
    firstTl.add(gsap.to({}, { duration: 0.5 }), '>');

    return () => {
      // Clean up
    };
  });

  return firstTl;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.image-box-home') as HTMLElement,
    meetContent: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetText: document.querySelector('.meet-content') as HTMLElement,
  };
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Use line-based splitting for text elements
  const meetContentSplit = new SplitText(elements.meetContent, {
    type: 'chars',
    wordsClass: 'split-word',
  });

  // Set initial states for key elements
  gsap.set(
    [elements.meetHeading, elements.anyBodyHeading, elements.windowContainer, elements.meetText],
    { autoAlpha: 0 }
  );

  // Create a timeline for the scramble text animation
  const scrambleTl = gsap.timeline();

  // Modified scramble animation to use the plugin correctly
  scrambleTl.fromTo(
    meetContentSplit.chars,
    { opacity: 0 },
    {
      duration: 5,
      scrambleText: {
        text: '{original}',
        chars: 'upperCase',
        revealDelay: 0.3,
        speed: 0.4,
        tweenLength: false,
      },
      opacity: 1,
      stagger: {
        each: 0.05,
        from: 'start',
        grid: 'auto',
      },
      ease: 'power1.inOut',
    }
  );

  // Base settings
  const baseSettings = {
    trigger: elements.section,
    start: 'top top',
    end: '+=350%',
    pin: true,
    scrub: true,
  };

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({
    scrollTrigger: scrollSettings,
  });

  masterTimeline
    // Fade in the headings
    .to(elements.meetHeading, { autoAlpha: 1, duration: 2, ease: 'power2.out' })
    .to(elements.anyBodyHeading, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, '>')
    // Fade in the window container before expanding it
    .to(elements.windowContainer, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '>')
    // Expand the window container to fill the viewport
    .to(elements.windowContainer, {
      width: '100vw',
      height: '100vh',
      duration: isMobile ? 4 : 5, // Slightly faster on mobile
      ease: 'power2.inOut',
    })
    // Fade in the meetText shortly after the window expansion begins
    .to(elements.meetText, { autoAlpha: 1, duration: 1.5 }, '-=4')
    // Fade out all text elements (both headings and scrambled content)
    .to(
      [elements.meetHeading, elements.anyBodyHeading, elements.meetText],
      { autoAlpha: 0, duration: 2, ease: 'power2.inOut' },
      '-=1' // only start fading out toward the very end of the window expansion
    );

  // Add a small pause at the end for mobile to prevent abrupt endings
  if (isMobile) {
    masterTimeline.to({}, { duration: 0.5 });
  }

  return masterTimeline;
}

export function beAnyoneTl() {
  const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
  const vidCard = document.querySelector('.vid-card') as HTMLElement;
  const images = gsap.utils.toArray<HTMLElement>('.video-embed');
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Set initial states: first image fully visible, others partially faded
  images.forEach((img, i) => {
    gsap.set(img, {
      opacity: i === 0 ? 1 : 0.5,
      scale: i === 0 ? 1 : 0.95,
    });
  });

  // Utility to wrap indices (cycling back to 0 when exceeding images.length)
  const wrapIndex = gsap.utils.wrap(0, images.length);

  // Build an infinite looping timeline
  // On mobile, make transitions a bit slower for a smoother feel
  const loopTl = gsap.timeline({
    repeat: -1,
    defaults: {
      ease: 'power2.out',
      duration: isMobile ? 0.4 : 0.3, // Slightly slower transitions on mobile
    },
  });

  // For each image transition
  for (let i = 0; i < images.length; i++) {
    const nextIndex = wrapIndex(i + 1);
    loopTl
      // Step 1: Scale down the card
      .to(vidCard, { scale: 0.98 })
      // Step 2: Animate current image out
      .to(images[i], { opacity: 0.5, scale: 0.95 }, '<')
      // Step 3: Scroll the wrapper to the next image position
      .to(
        wrapper,
        {
          scrollLeft: images[nextIndex].offsetLeft,
          duration: isMobile ? 0.6 : 0.5, // Slower scroll on mobile
          ease: 'power2.out',
        },
        '<'
      )
      // Step 4: Animate next image in
      .to(images[nextIndex], { opacity: 1, scale: 1 }, '<')
      // Step 5: Scale card back up
      .to(vidCard, { scale: 1 }, 0.15)
      // Step 6: Pause before the next cycle
      // Longer pause on mobile for easier viewing
      .to({}, { duration: isMobile ? 1.5 : 1 });
  }

  return loopTl;
}
function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Base settings - increase the end value to allow more time for animation
  const baseSettings = {
    trigger: readyPlayerSection,
    start: 'top top',
    end: '+=300%', // Increased from 200% to 300% to provide more scroll space
    pin: true,
    scrub: isMobile ? 3 : 2, // Smoother scrub for mobile
  };

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  const tl = gsap.timeline({
    scrollTrigger: scrollSettings,
  });

  // Initial states
  gsap.set([readyText, playerText], { autoAlpha: 0 });

  // Set initial state for cartridge (hidden and positioned above viewport)
  gsap.set(cartridgeWrapper, { yPercent: -100, autoAlpha: 0 });

  // Sequence the animations properly
  tl
    // First phase - fade in the headings
    .to(readyText, {
      autoAlpha: 1,
      duration: 2,
      ease: 'power2.out',
    })
    .to(
      playerText,
      {
        autoAlpha: 1,
        duration: 2,
        ease: 'power2.out',
      },
      '-=1' // Overlap slightly with previous animation
    )
    // Add a small pause to let the text be read fully
    .to({}, { duration: 1 })

    // Second phase - bring in the cartridge after text is fully visible
    .to(cartridgeWrapper, {
      yPercent: 0,
      autoAlpha: 1,
      duration: isMobile ? 4 : 5, // Longer duration to ensure it completes
      ease: 'power2.inOut', // Changed to inOut for smoother motion
    })

    // Third phase - hold the final state for a moment
    .to({}, { duration: 2 }); // Hold the final state longer

  // For mobile, add an additional pause at the end to ensure smooth exit
  if (isMobile) {
    tl.to({}, { duration: 1.5 });
  }

  return tl;
}

// Add a function to handle window resize events
function setupResizeHandler() {
  let resizeTimeout;
  let prevWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    // Clear previous timeout to prevent multiple refreshes
    clearTimeout(resizeTimeout);

    // Set a timeout to avoid excessive refreshes during resize
    resizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;

      // Check if we've crossed a breakpoint
      const wasMobile = prevWidth <= breakpoints.mobile;
      const isMobile = currentWidth <= breakpoints.mobile;

      if ((wasMobile && !isMobile) || (!wasMobile && isMobile)) {
        // Refresh ScrollTrigger to update all pinned sections
        ScrollTrigger.refresh();
      }

      prevWidth = currentWidth;
    }, 250); // 250ms debounce
  });
}

// Main initialization
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded with Mobile Optimizations!');

  // Set up resize handler
  setupResizeHandler();

  // // Add mobile-specific CSS adjustments
  // if (window.innerWidth <= breakpoints.mobile) {
  //   // Add any mobile-specific CSS here if needed
  //   document.body.classList.add('is-mobile');
  // }

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline())
    .add(beAnyoneTl())
    .add(createAnythingV2())
    .add(meetAnybody())
    .add(readyPlayerTl());

  // Add a small delay before refreshing ScrollTrigger to ensure everything is properly set up
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});
