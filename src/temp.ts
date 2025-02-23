import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { beAnyoneTl, landingTimeline } from 'src';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

function meetAnybodyTemp() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    text: document.querySelector('.meet-text') as HTMLElement,
    anyBodyText: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.meet-window-container') as HTMLElement,
    meetContent: document.querySelector('.meet-content') as HTMLElement,
    meetImg: document.querySelector('.meet-img') as HTMLElement,
  };

  // Initial states
  gsap.set(
    [
      elements.text,
      elements.anyBodyText,
      elements.windowContainer,
      elements.meetContent,
      elements.meetImg,
    ],
    {
      opacity: 0,
    }
  );

  // Separate non-scrubbed blink animations with their own triggers
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: elements.section,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: true, // or only enable scrub once blinking is done
    },
  });

  gsap.set(elements.anyBodyText, { yPercent: -20 });

  ScrollTrigger.create({
    trigger: elements.section,
    start: 'top top',
    onEnter: () => {
      gsap.timeline().blinkIn(elements.text).blinkIn(elements.anyBodyText);
    },
    onLeaveBack: () => {
      // Smooth tween back to hidden state
      gsap.to([elements.text, elements.anyBodyText], {
        opacity: 0,
        yPercent: -10,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set([elements.text, elements.anyBodyText], { yPercent: 0 });
          gsap.set(elements.meetImg, { zIndex: 10 });
        },
      });
    },
  });

  // BLINK (no scrub)
  masterTimeline
    .to(elements.windowContainer, { opacity: 1, duration: 0.5 })
    .to(elements.windowContainer, { width: '100%', height: '100%', duration: 1.5 })
    .to(elements.meetImg, { opacity: 1, duration: 1 }, '-=1.8')
    .to(elements.meetContent, { opacity: 1, duration: 1 }, '-=1');

  return masterTimeline;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline()) // Add landing timeline
    .add(beAnyoneTl()) // Add beAnyone timeline
    .add(meetAnybodyTemp());
});
