import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--beige)',
        padding: 'clamp(32px, 5vw, 56px) clamp(20px, 5vw, 60px) 110px',
        textAlign: 'center', fontSize: 13, letterSpacing: '0.04em', color: 'rgba(22,40,28,0.55)',
      }}
    >
      Raheeq — grown slowly, harvested honestly.
    </footer>
  );
}
