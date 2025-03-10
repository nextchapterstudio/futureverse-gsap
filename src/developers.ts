import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin);
window.Webflow ||= [];
window.Webflow.push(() => {
  const elements = gsap.utils.toArray<HTMLElement>('.developers-info-card');

  elements.forEach((element) => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
        // markers: true,
      },
      opacity: 1,
    });
  });

  gsap.set('.text-container', { yPercent: -30 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=150%',
        scrub: 1.5, // Increase scrub for smoother movement
        pin: true,
      },
    })
    .to('.clipped-path', {
      duration: 3, // duration is less relevant when scrubbed; it's the animation's total length
      ease: 'customEase',
      clipPath:
        ' polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 100% 100%, 100% 0%) ',
    })
    .to(
      '.text-container',
      {
        yPercent: -75,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
      },
      '-=1.5'
    ); // Start text animation sooner
});
