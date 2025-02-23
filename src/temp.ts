import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { beAnyoneTl, landingTimeline, meetAnybody } from 'src';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline()) // Add landing timeline
    .add(beAnyoneTl()) // Add beAnyone timeline
    // .add(createAnythingV2()) // Overlap createAnything timeline by 0.5 seconds
    .add(meetAnybody());
  // .add(readyPlayerTl());

  // .add(horizontalScroll());
});
