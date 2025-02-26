import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

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

  // Initially hide all lines

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

  // Use the new line-based splitting function
  const splitTextAnimation = createSequentialScrambleAnimation(intoText);
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
    .to(goAnywhereCopy, { opacity: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
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
    .to(createAnythingCopy, { opacity: 1, duration: 3.5, ease: 'power1.inOut' }, '>-1')
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
  // First, make sure the ScrambleText plugin is imported
  // Import at the top of your file:
  // import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
  // gsap.registerPlugin(ScrambleTextPlugin);

  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.image-box-home') as HTMLElement,
    meetContent: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetText: document.querySelector('.meet-content') as HTMLElement,
  };

  // Use line-based splitting for text elements
  const meetContentSplit = new SplitText(elements.meetContent, {
    type: 'chars',
    wordsClass: 'split-word',
  });

  // Set initial states for key elements
  gsap.set(
    [
      elements.meetHeading,
      elements.anyBodyHeading,
      elements.windowContainer,
      elements.meetText,
      // elements.meetContent,
    ],
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
    // Fade in the meetText shortly after the window expansion begins
    .to(elements.meetText, { autoAlpha: 1, duration: 1.5 }, '-=4')
    // Fade out all text elements (both headings and scrambled content)
    .to(
      [elements.meetHeading, elements.anyBodyHeading, elements.meetText],
      { autoAlpha: 0, duration: 2, ease: 'power2.inOut' },
      '-=1' // only start fading out toward the very end of the window expansion
    );

  return masterTimeline;
}

export function beAnyoneTl() {
  const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
  const vidCard = document.querySelector('.vid-card') as HTMLElement;
  const images = gsap.utils.toArray<HTMLElement>('.avatar-img');

  // Initial image state: the first image is active.
  images.forEach((img, i) => {
    gsap.set(img, {
      opacity: i === 0 ? 1 : 0.5,
      scale: i === 0 ? 1 : 0.95,
    });
  });

  // Total scrollable width and the visible width.
  const totalWidth = wrapper.scrollWidth;
  const visibleWidth = wrapper.clientWidth;

  // Continuous scrolling tween.
  const scrollTween = gsap.to(wrapper, {
    scrollLeft: totalWidth, // We'll tween this value continuously.
    duration: 30, // Adjust duration for desired speed.
    ease: 'none',
    repeat: -1,
    modifiers: {
      // Wrap the scrollLeft so that it resets smoothly when it reaches the end.
      scrollLeft: (value) => {
        return gsap.utils.wrap(0, totalWidth - visibleWidth, parseFloat(value)) + '';
      },
    },
    onUpdate: () => {
      // Get the current scroll position.
      const scrollPos = wrapper.scrollLeft;
      // Determine which images are currently active based on the scroll.
      // Assuming images are laid out exactly one viewport-width apart.
      const index = Math.floor(scrollPos / visibleWidth);
      const progress = (scrollPos % visibleWidth) / visibleWidth;

      // Update each image:
      images.forEach((img, i) => {
        if (i === index) {
          // The current image fades out as we move to the next.
          gsap.set(img, {
            opacity: 1 - 0.5 * progress,
            scale: 1 - 0.05 * progress,
          });
        } else if (i === (index + 1) % images.length) {
          // The next image fades in.
          gsap.set(img, {
            opacity: 0.5 + 0.5 * progress,
            scale: 0.95 + 0.05 * progress,
          });
        } else {
          // Other images stay in their inactive state.
          gsap.set(img, { opacity: 0.5, scale: 0.95 });
        }
      });

      // Optionally, you can also animate the vidCard if needed.
      // For example, you might tie its scale to the progress:
      gsap.set(vidCard, {
        scale: 0.98 + 0.02 * (1 - Math.abs(progress - 0.5) * 2),
      });
    },
  });

  return scrollTween;
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

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline())
    .add(beAnyoneTl())
    .add(createAnythingV2())
    .add(meetAnybody())
    .add(readyPlayerTl());
});
