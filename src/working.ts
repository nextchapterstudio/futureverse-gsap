import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

import { createScrollTriggeredTypingAnimation, createTypingAnimation } from './index';

CustomEase.create('customEase', '0.42, 0.00, 0.08, 1.00');

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('testing deppoyment');

  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.third-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const goText = document.querySelector('.go-heading') as HTMLElement;
  const anywhereText = document.querySelector('.anywhere-heading') as HTMLElement;
  const goAnywhereCopy = document.querySelector('.go-copy') as HTMLElement;
  const createText = document.querySelector('.scramble-3') as HTMLElement;
  const anythingText = document.querySelector('.scramble-4') as HTMLElement;
  const createAnythingCopy = document.querySelector('.create-anything-max-width') as HTMLElement;
  const goTrigger = document.querySelector('.go-anywhere-text') as HTMLElement;

  goText.innerHTML = ' ';

  gsap.set(
    [
      secondImage,

      centerImage,
      clippedBox,
      swappableWrapper,
      content,
      goText,
      anywhereText,
      goAnywhereCopy,
      createText,
      anythingText,
      createAnythingCopy,
    ],
    { autoAlpha: 0 }
  );

  // const goTypingAnimation = createTypingAnimation({
  //   element: goText,
  //   text: 'GO',
  //   staggerDelay: 0.03,
  // }).pause();

  // ScrollTrigger.create({
  //   trigger: goTrigger,
  //   start: 'top 80%',
  //   markers: true,
  //   onEnter: () => {
  //     goTypingAnimation.play();
  //   },
  // });
});
