import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const splitTextOne = document.querySelector('.split-text-1');
  const splitTextTwo = document.querySelector('.split-text-2');

  const split = new SplitText(splitTextOne, {
    type: 'lines',
    linesClass: 'lines',
  });

  const splitChars = new SplitText(splitTextTwo, {
    type: 'chars',
    charsClass: 'chars',
  });

  // Set initial states
  gsap.set(split.lines, { opacity: 0.3 });
  gsap.set(splitChars.chars, {
    opacity: 0.3,
  });

  const linesTl = gsap.timeline();
  linesTl.to(split.lines, {
    opacity: 1,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power2.out',
  });

  const charsTl = gsap.timeline();
  charsTl.to(splitChars.chars, {
    opacity: 1,
    y: 0,
    duration: 0.4, // Faster duration
    stagger: 0.02, // Tighter stagger
    ease: 'back.out(1.7)', // More energetic ease
  });

  const masterTl = gsap.timeline();
  masterTl.add(linesTl).add(charsTl, '<0.3'); // Start chars sooner

  ScrollTrigger.create({
    trigger: splitTextOne,
    start: 'top 70%', // Trigger earlier
    end: 'bottom 20%', // End before reaching partners
    animation: masterTl,
    // markers: true,
    scrub: 1, // Slow down animation
    toggleActions: 'play none none reset',
  });
});
