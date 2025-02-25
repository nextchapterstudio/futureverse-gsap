import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Get all elements with the class .split-text
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  // Process each split-text element
  splitTextArray.forEach((element) => {
    // Create only character splits
    const splitChars = new SplitText(element, {
      type: 'chars',
      charsClass: 'chars',
    });

    // Set initial states for characters
    gsap.set(splitChars.chars, {
      opacity: 0.3,
      // y: 20, // Added initial y position for animation
    });

    // Create timeline for character animation only
    const charsTl = gsap.timeline();
    charsTl.to(splitChars.chars, {
      opacity: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: 'back.out(1.7)',
    });

    // Master timeline (now just consists of chars animation)
    const masterTl = gsap.timeline();
    masterTl.add(charsTl);

    // Create ScrollTrigger for this element
    ScrollTrigger.create({
      trigger: element,
      start: 'top 70%', // Trigger earlier
      end: 'bottom 20%', // End before reaching partners
      animation: masterTl,
      // markers: true,
      scrub: 1, // Slow down animation
      toggleActions: 'play none none reset',
    });
  });
});
