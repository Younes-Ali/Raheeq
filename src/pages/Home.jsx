import React, { useEffect, useState } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll.js';
import BottomNav from '../components/nav/BottomNav.jsx';
import Hero from '../sections/Hero.jsx';
import Stats from '../sections/Stats.jsx';
import Mission from '../sections/Mission.jsx';
import Essential from '../sections/Essential.jsx';
import Gallery from '../sections/Gallery.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Cta from '../sections/Cta.jsx';
import Footer from '../sections/Footer.jsx';
import MagneticButton from '../components/animations/MagneticButton.jsx';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  useSmoothScroll();
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();

  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-section]")];

    const updateActive = () => {
      const center = window.innerHeight / 2;

      let current = sections[0];

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= center && rect.bottom >= center) {
          current = section;
        }
      });

      setActiveSection(current.dataset.section);
    };

    updateActive();

    window.addEventListener("scroll", updateActive);
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <div>
      <MagneticButton
        className=' 
        fixed
        top-5
        right-5
        z-[1000]
        border-2 
        border-black
        '
        onClick={() => navigate("/shop")}
      >shop</MagneticButton>
      <BottomNav activeSection={activeSection} />
      <Hero />
      <Stats />
      <Mission />
      <Essential />
      <Gallery />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
