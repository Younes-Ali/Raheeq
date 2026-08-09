import React, { useEffect, useState } from 'react';

function VideoPlaceholder({ label, expectedPath, height = '100vh' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <div className="video-placeholder">
        <div style={{ fontSize: 28 }}>🎬</div>
        <div style={{ fontFamily: "'Chewy', system-ui, sans-serif", fontSize: 18 }}>{label}</div>
        <code>{expectedPath}</code>
        <div style={{ fontSize: 11, opacity: 0.75, maxWidth: 320 }}>
          حط الفيديو هنا بنفس الاسم ده جوه public/videos/ وهيشتغل تلقائيًا
        </div>
      </div>
    </div>
  );
}

/**
 * Auto-detects whether the video file actually exists (HEAD request).
 * Falls back to a clearly labeled placeholder automatically — no manual
 * code edits needed once the file is dropped into public/videos/.
 */
export default function VideoBackground({ src, label, expectedPath, height = '100vh' }) {
  const [status, setStatus] = useState('checking'); // checking | ok | missing

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setStatus(res.ok ? 'ok' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setStatus('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (status !== 'ok') {
    return <VideoPlaceholder label={label} expectedPath={expectedPath} height={height} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        onError={() => setStatus('missing')}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
