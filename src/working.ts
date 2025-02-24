import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const cartridgeVideo = document.querySelector('.cartridge-vid') as HTMLElement;

  // Single timeline with scroll trigger but no pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: readyPlayerSection,
      start: 'top top',
      end: '+=200%', // This now represents actual scroll distance
      scrub: 1,
      markers: true, // Helpful for debugging, remove in production
      onUpdate: (self) => {
        // Optional: could use this to trigger the video expansion
        // when reaching a certain scroll progress
        if (self.progress > 0.8) {
          // Could trigger final state here
        }
      },
    },
  });

  // Initial states
  gsap.set(cartridgeVideo, {
    scale: 0,
    opacity: 0,
  });
  gsap.set(cartridgeWrapper, {
    transformOrigin: '50% 50% -150',
    perspective: 1200,
    backfaceVisibility: 'visible',
    transformStyle: 'preserve-3d',
    yPercent: -700,
  });
  gsap.set([readyText, playerText], { yPercent: 200 });

  tl
    // Cartridge movement
    .to(
      cartridgeWrapper,
      {
        yPercent: 0,
        duration: 10,
        ease: 'none',
      },
      0
    )
    .to(
      cartridgeWrapper,
      {
        rotateY: '+=30',
        ease: 'power2.inOut',
        duration: 3,
        yoyo: true,
        repeat: 1,
      },
      '<+=1'
    )
    .to(
      readyText,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      '>'
    );
  // .to(
  //   playerText,
  //   {
  //     opacity: 1,
  //     duration: 2,
  //     ease: 'power2.out',
  //   },
  //   5
  // )

  // // Video growth can now scale beyond viewport
  // .to(
  //   cartridgeVideo,
  //   {
  //     scale: 0.3,
  //     opacity: 1,
  //     duration: 2,
  //     ease: 'power2.in',
  //   },
  //   6
  // )
  // .to(
  //   cartridgeVideo,
  //   {
  //     scale: 1.5, // Can go bigger than viewport
  //     duration: 4,
  //     ease: 'power2.inOut',
  //   },
  //   8
  // )

  // // Fade out other elements
  // .to(
  //   [readyText, playerText, cartridgeWrapper],
  //   {
  //     opacity: 0,
  //     duration: 2,
  //     ease: 'power2.in',
  //   },
  //   9
  // );

  return tl;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  readyPlayerTl();
});
