import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
