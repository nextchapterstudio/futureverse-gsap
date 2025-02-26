import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

// Consistent helper function to apply line-based splitting for all text animations
function prepareTextForAnimation(element: HTMLElement) {
  if (!element) return null;

  // First split into lines
  const splitLines = new SplitText(element, {
    type: 'lines',
    linesClass: 'split-line',
  });

  // Then split each line into chars for animation
  const splitChars = new SplitText(splitLines.lines, {
    type: 'chars',
    charsClass: 'char',
  });

  // Set initial styles for the lines to maintain layout
  gsap.set(splitLines.lines, {
    overflow: 'hidden',
    position: 'relative',
    display: 'block',
  });

  return {
    lines: splitLines.lines,
    chars: splitChars.chars,
  };
}

// Add CSS for line-based text animation
function addLineBasedStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .split-line {
      display: block;
      overflow: hidden;
      position: relative;
      width: 100%; /* Ensure lines take full width */
      height: auto; /* Let height adjust automatically */
      line-height: 1.2; /* Consistent line height */
    }
    
    .char {
      display: inline-block;
      position: relative; /* Needed for proper GSAP animations */
      transform-origin: center bottom; /* Better animation origin */
    }

    /* Fix for parent containers to maintain proper layout */
    .intro-text, .go-anywhere-copy, .create-anything-copy, .meet-content {
      overflow: hidden; /* Ensure no characters spill outside */
      line-height: 1.2; /* Control overall line height */
    }
  `;
  document.head.appendChild(style);
}

export const landingTimeline = () => {
  const intoText = document.querySelector('.intro-text') as HTMLElement;

  // Use the new line-based splitting function
  const splitText = prepareTextForAnimation(intoText);

  // Set initial state for characters
  gsap.set(splitText.chars, { opacity: 0, visibility: 'visible' });

  // Create the scramble timeline in a paused state
  const scrambleTl = gsap.timeline();
  scrambleTl.to(splitText.chars, {
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
  });

  const landing = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-landing-section',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1.5,
      anticipatePin: 0.5,
    },
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
    .add(scrambleTl, '<');

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
  const createAnythingCopy = document.querySelector('.create-anything-copy') as HTMLElement;

  // Use line-based splitting for both text elements
  const goAnywhereTextSplit = prepareTextForAnimation(goAnywhereCopy);
  const createAnythingTextSplit = prepareTextForAnimation(createAnythingCopy);

  // Set initial states
  gsap.set(goAnywhereTextSplit.chars, { opacity: 0 });
  gsap.set(createAnythingTextSplit.chars, { opacity: 0 });

  const scrambleTl = gsap.timeline({ paused: true });
  scrambleTl.fromTo(
    goAnywhereTextSplit.chars,
    { opacity: 0 },
    {
      duration: 2.5,
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

  const scrambleTlTwo = gsap.timeline({ paused: true });
  scrambleTlTwo.fromTo(
    createAnythingTextSplit.chars,
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

  gsap.set(centerImage, { zIndex: 5 });

  const firstTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-scroll-section',
      start: 'top top',
      end: '+=650%',
      pin: true,
      scrub: 2.5,
      anticipatePin: 0.5,
    },
  });

  firstTl
    .to(clippedBox, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(swappableWrapper, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(content, { autoAlpha: 1, duration: 2, ease: 'power1.inOut' })
    .to(scramble1, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(scramble2, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .add(scrambleTl.play(), '<')
    .to(
      secondImage,
      {
        autoAlpha: 0.15,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=1'
    )
    .to(clippedBox, {
      width: '100%',
      height: '100%',
      duration: 7,
      ease: 'power2.inOut',
    })
    .to(
      secondImage,
      {
        autoAlpha: 0.4,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=6'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=4'
    )
    .to(
      content,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=3'
    )
    .to(
      firstImage,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '>-0.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 1,
        duration: 4,
        ease: 'power1.inOut',
      },
      '-=2'
    )
    .to(
      createText,
      {
        autoAlpha: 1,
        duration: 3.5,
        ease: 'power1.inOut',
      },
      '-=3.5'
    )
    .to(
      anythingText,
      {
        autoAlpha: 1,
        duration: 3.5,
        ease: 'power1.inOut',
      },
      '-=2.5'
    )
    .add(scrambleTlTwo.play(), '-=2')
    .to(
      centerImage,
      {
        autoAlpha: 1,
        duration: 4.5,
        ease: 'power1.inOut',
      },
      '-=3.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '<'
    )
    .to(
      '.content-bottom',
      {
        opacity: 0,
        duration: 2.5,
        ease: 'power1.inOut',
      },
      '-=1.5'
    )
    .to(
      centerImage,
      {
        scale: 0.7,
        ease: 'power1.inOut',
        duration: 4,
      },
      '-=2'
    );

  return firstTl;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.image-box-home') as HTMLElement,
    meetContent: document.querySelector('.meet-content') as HTMLElement,
    meetImg: document.querySelector('.meet-img') as HTMLElement,
  };

  // Use line-based splitting for text elements
  const meetContentSplit = prepareTextForAnimation(elements.meetContent);

  // Set initial states for key elements
  gsap.set(meetContentSplit.chars, { opacity: 0 });
  gsap.set(
    [elements.meetHeading, elements.anyBodyHeading, elements.windowContainer, elements.meetImg],
    { autoAlpha: 0 }
  );

  // Create a timeline for the scramble text animation
  const scrambleTl = gsap.timeline();
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

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: elements.section,
      start: 'top top',
      end: '+=350%',
      pin: true,
      scrub: true,
    },
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
      duration: 5,
      ease: 'power2.inOut',
    })
    // Start the scrambled text effect shortly after the window expansion begins
    .add(scrambleTl, '-=2')
    // Fade out all text elements (both headings and scrambled content)
    .to(
      [elements.meetHeading, elements.anyBodyHeading, elements.meetContent],
      { autoAlpha: 0, duration: 2, ease: 'power2.inOut' },
      '-=3' // start fading out just before the window expansion tween ends
    );

  return masterTimeline;
}

export function beAnyoneTl() {
  const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
  const vidCard = document.querySelector('.vid-card') as HTMLElement;
  const images = gsap.utils.toArray<HTMLElement>('.avatar-img');
  let currentIndex = 0;
  let isScrolling = false;
  let scrollTimeout: NodeJS.Timeout;

  // Setup initial states
  images.forEach((img, i) => {
    gsap.set(img, {
      opacity: i === 0 ? 1 : 0.5,
      scale: i === 0 ? 1 : 0.95,
    });
  });

  // Smooth scroll function with synchronized card animation
  function smoothScrollTo(element: HTMLElement) {
    isScrolling = true;

    // Timeline for synchronized animations
    const tl = gsap.timeline({
      onComplete: () => {
        isScrolling = false;
      },
    });

    // Scale down card slightly
    tl.to(
      vidCard,
      {
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.out',
      },
      0
    );

    // Scroll to new position
    tl.to(
      wrapper,
      {
        scrollLeft: element.offsetLeft,
        duration: 0.5,
        ease: 'power2.out',
      },
      0
    );

    // Scale card back up
    tl.to(
      vidCard,
      {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      0.3
    );
  }

  // Handle scroll events with debounce and synchronized animations
  wrapper.addEventListener('scroll', () => {
    if (isScrolling) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const { scrollLeft } = wrapper;
      const imageWidth = wrapper.clientWidth;
      const newIndex = Math.round(scrollLeft / imageWidth);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
        // Create timeline for synchronized animations
        const tl = gsap.timeline();

        // Scale down card
        tl.to(
          vidCard,
          {
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Animate out current image
        tl.to(
          images[currentIndex],
          {
            opacity: 0.5,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Animate in new image
        tl.to(
          images[newIndex],
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Scale card back up
        tl.to(
          vidCard,
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.15
        );

        currentIndex = newIndex;
      }
    }, 50);
  });

  // Add touch event handling
  let touchStart: number;
  let touchStartTime: number;

  wrapper.addEventListener(
    'touchstart',
    (e) => {
      touchStart = e.touches[0].clientX;
      touchStartTime = Date.now();

      // Scale down card slightly on touch start
      gsap.to(vidCard, {
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    { passive: true }
  );

  wrapper.addEventListener(
    'touchend',
    (e) => {
      const touchEnd = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      const diff = touchStart - touchEnd;

      // Calculate velocity of swipe
      const velocity = Math.abs(diff / touchDuration);

      // Scale card back up
      gsap.to(vidCard, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Adjust sensitivity based on velocity and distance
      if (Math.abs(diff) > 30 || velocity > 0.5) {
        const nextIndex =
          diff > 0 ? Math.min(currentIndex + 1, images.length - 1) : Math.max(currentIndex - 1, 0);

        smoothScrollTo(images[nextIndex]);
      }
    },
    { passive: true }
  );

  // Optional: Add mouse drag scrolling
  let isMouseDown = false;
  let startX: number;
  let scrollLeft: number;

  wrapper.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = 'grabbing';

    // Scale down card on mouse down
    gsap.to(vidCard, {
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    if (isMouseDown) {
      // Scale card back up
      gsap.to(vidCard, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    isMouseDown = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mouseup', () => {
    isMouseDown = false;
    wrapper.style.cursor = 'grab';

    // Scale card back up
    gsap.to(vidCard, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // Set initial cursor style
  wrapper.style.cursor = 'grab';

  return gsap.timeline();
}

function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;

  // Increase scroll distance and adjust scrub for a slower, smoother effect
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: readyPlayerSection,
      start: 'top top',
      end: '+=200%', // Increased scroll distance
      pin: true,
      scrub: 2, // Increased scrub value for smoother animation
    },
  });

  // Initial states
  gsap.set([readyText, playerText], { autoAlpha: 0 });

  tl.to(readyText, {
    autoAlpha: 1,
    duration: 2, // Longer fade-in duration
    ease: 'power2.out',
  })
    .to(
      playerText,
      {
        autoAlpha: 1,
        duration: 2, // Longer fade-in duration
        ease: 'power2.out',
      },
      '-=1' // Overlap fade-in slightly for a smoother transition
    )
    .from(cartridgeWrapper, { yPercent: -100, autoAlpha: 0, duration: 3, ease: 'none' }, 0);

  return tl;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded with Line-Based Splitting!');

  // Add necessary styles for line-based animation
  addLineBasedStyles();

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline())
    .add(beAnyoneTl())
    .add(createAnythingV2())
    .add(meetAnybody())
    .add(readyPlayerTl());
});
