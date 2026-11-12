import React, { useState, useEffect, useRef, useCallback } from 'react';

// Local inline-SVG fallback (no external network dependency for broken images).
const FALLBACK_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
        '<rect width="100%" height="100%" fill="#f0f0f0"/>' +
        '<text x="50%" y="50%" fill="#999" font-family="sans-serif" font-size="16" ' +
        'text-anchor="middle" dominant-baseline="middle">Image not available</text></svg>'
    );

// One tile. Owns its own cursor-tilt + spotlight so a mousemove never re-renders
// the whole grid — it writes CSS custom properties straight to the node.
function PhotoCard({ photo, index, onOpen }) {
    const cardRef = useRef(null);

    const handleMove = (e) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;   // 0..1
        el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);   // rotateY
        el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);   // rotateX
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
    };

    const handleLeave = () => {
        const el = cardRef.current;
        if (!el) return;
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
    };

    return (
        <button
            ref={cardRef}
            type="button"
            className="pg-card"
            style={{ transitionDelay: `${Math.min(index, 12) * 45}ms` }}
            data-reveal
            onClick={() => onOpen(photo)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            aria-label={`Open photo: ${photo.team || 'gallery item'}`}
        >
            <figure className="pg-fig">
                <div className="pg-thumb">
                    {photo.isVideo ? (
                        <video
                            className="pg-img loaded"
                            src={photo.url}
                            muted
                            preload="metadata"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <img
                            className="pg-img"
                            src={photo.url}
                            alt={photo.team || 'IGO costume contest entry'}
                            loading="lazy"
                            decoding="async"
                            onLoad={(e) => e.currentTarget.classList.add('loaded')}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                        />
                    )}
                    <span className="pg-spot" aria-hidden="true" />
                </div>
                {photo.team && <figcaption className="pg-cap">{photo.team}</figcaption>}
            </figure>
        </button>
    );
}

function PhotoGallery() {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);

    const gridRef = useRef(null);
    const modalRef = useRef(null);
    const lastFocusedRef = useRef(null);
    const touchRef = useRef(null);

    useEffect(() => {
        // 2026 Halloween Costume Contest entries, named by team.
        // `team` is the caption shown under each photo (from the "Name of Team"
        // column, or the "Tell Us About Your Costume" column where the team
        // field is just a person's name).
        const photoList = [
            { filename: '2026_Costume_Contest/EXPAND.jpg', team: 'Superheroes' },
            { filename: '2026_Costume_Contest/Glickman Lab.jpg', team: "We're being silly" },
            { filename: "2026_Costume_Contest/Dremus lab.jpeg", team: 'The sights and sounds of the Safari: Dirk and Sahil, the experienced explorers, met up with Charanya the globetrotter to explore the concrete jungle. During their adventure they stumble across Lucia the tiger, Eleanor the elephant and Liza the frog.' },
            { filename: '2026_Costume_Contest/Siglecs in the city and the Niec niche.jpeg', team: 'Siglecs in the City and the Niec Niche' },
            { filename: '2026_Costume_Contest/Olivia Barr.jpeg', team: 'Greg from over the garden wall (teapot)' },
            { filename: '2026_Costume_Contest/If you give a cat a mouse.jpeg', team: 'If You Give a Cat a Mouse' },
            { filename: '2026_Costume_Contest/Powell Lab.jpg', team: 'Queen Joker' },
            { filename: '2026_Costume_Contest/Noble Gases.jpeg', team: '"Noble" Gases' },
            { filename: '2026_Costume_Contest/The High-throughput Cooks- IGO Breaking Bad.jpeg', team: 'The High-throughput Cooks — IGO Breaking Bad' },
            { filename: '2026_Costume_Contest/Project hail mary.jpeg', team: 'Project Hail Mary' },
            { filename: '2026_Costume_Contest/Boire Lab Mice.jpeg', team: 'Boire Lab Mice' },
            { filename: '2026_Costume_Contest/Far far away in Macklowe.jpeg', team: 'Far Far Away in Macklowe — Shrek and Friends' },
            { filename: '2026_Costume_Contest/Sheu Crew.jpeg', team: 'Sheu Crew' },
            { filename: '2026_Costume_Contest/mRNA and the Seven Antigens.jpeg', team: 'mRNA and the Seven Antigens' },
            { filename: '2026_Costume_Contest/The Core Wash.jpg', team: 'The Core Wash' },
            { filename: '2026_Costume_Contest/Barbara Mello.jpeg', team: "Barbara Mello — Slash from Guns N' Roses" },
            { filename: '2026_Costume_Contest/Widman Lab.jpeg', team: 'Widman Lab — Disco Bugs' },
            { filename: '2026_Costume_Contest/Disney Schiet.jpeg', team: 'Disney Schiet — Disney Villains' },
            { filename: '2026_Costume_Contest/The Saucy Squad.jpg', team: 'The Saucy Squad' },
            { filename: '2026_Costume_Contest/Mind the Gaps in Your Data.jpeg', team: 'Mind the Gap(s) in Your Data' }
        ];

        // process.env.PUBLIC_URL resolves to '' in dev (served at /gallery) and
        // '/swabnseq' in the production build, so the path works in both.
        const base = process.env.PUBLIC_URL || '';
        const loadedPhotos = photoList.map((photo, index) => {
            const fileExtension = photo.filename.split('.').pop().toLowerCase();
            const isVideo = photo.isVideo || ['mp4', 'webm', 'mov'].includes(fileExtension);
            return {
                id: index + 1,
                url: `${base}/gallery/${photo.filename}`,
                isVideo: isVideo,
                team: photo.team || ''
            };
        });

        setPhotos(loadedPhotos);
        setLoading(false);
    }, []);

    // Staggered scroll-reveal: add `.in` once a card scrolls into view.
    useEffect(() => {
        if (photos.length === 0 || !gridRef.current) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cards = gridRef.current.querySelectorAll('[data-reveal]');
        if (reduce || !('IntersectionObserver' in window)) {
            cards.forEach((c) => c.classList.add('in'));
            return;
        }
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        cards.forEach((c) => io.observe(c));
        return () => io.disconnect();
    }, [photos]);

    const openModal = (photo) => {
        lastFocusedRef.current = document.activeElement;
        setSelectedPhoto(photo);
    };

    const closeModal = useCallback(() => {
        setSelectedPhoto(null);
        if (lastFocusedRef.current && lastFocusedRef.current.focus) {
            lastFocusedRef.current.focus();
        }
    }, []);

    const goToOffset = useCallback((offset) => {
        setSelectedPhoto((current) => {
            if (!current) return current;
            const idx = photos.findIndex((p) => p.id === current.id);
            const next = (idx + offset + photos.length) % photos.length;
            return photos[next];
        });
    }, [photos]);

    // Keyboard controls + focus the dialog on open.
    useEffect(() => {
        if (!selectedPhoto) return;
        if (modalRef.current) modalRef.current.focus();
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToOffset(-1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); goToOffset(1); }
            else if (e.key === 'Escape') { closeModal(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedPhoto, goToOffset, closeModal]);

    // Preload the neighbouring full-size images so prev/next feels instant.
    useEffect(() => {
        if (!selectedPhoto) return;
        const idx = photos.findIndex((p) => p.id === selectedPhoto.id);
        [idx - 1, idx + 1].forEach((n) => {
            const p = photos[(n + photos.length) % photos.length];
            if (p && !p.isVideo) { const im = new Image(); im.src = p.url; }
        });
    }, [selectedPhoto, photos]);

    // Touch: horizontal swipe = prev/next, vertical swipe down = close.
    const onTouchStart = (e) => {
        const t = e.changedTouches[0];
        touchRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e) => {
        if (!touchRef.current) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - touchRef.current.x;
        const dy = t.clientY - touchRef.current.y;
        touchRef.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            goToOffset(dx < 0 ? 1 : -1);
        } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
            closeModal();
        }
    };

    const styles = (
        <style>{`
            .pg-wrap {
                max-width: 1200px; margin: 0 auto; padding: 18px 16px 36px; border-radius: 18px;
                background:
                    radial-gradient(900px 300px at 50% -40px, rgba(242,153,52,0.18), rgba(242,153,52,0) 70%),
                    linear-gradient(180deg, #fff8f2 0%, #faf6ff 100%);
            }
            .pg-title {
                background: linear-gradient(90deg, #DF4602, #f29934 60%, #8a3ffb);
                -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
            }
            .pg-subtitle {
                text-align: center; margin: 6px auto 8px; display: inline-block;
                color: #fff; font-weight: 700; letter-spacing: .02em;
                padding: 7px 18px; border-radius: 999px;
                background: linear-gradient(135deg, #DF4602, #f29934);
                box-shadow: 0 6px 16px rgba(223,70,2,0.28);
            }
            .pg-subtitle-row { text-align: center; margin-bottom: 26px; }

            /* Masonry: true aspect ratios, no cropping. */
            .pg-grid { column-count: 1; column-gap: 20px; padding: 20px 0; }
            @media (min-width: 560px)  { .pg-grid { column-count: 2; } }
            @media (min-width: 900px)  { .pg-grid { column-count: 3; } }

            .pg-card {
                -webkit-column-break-inside: avoid; break-inside: avoid;
                display: inline-block; width: 100%; margin: 0 0 20px;
                padding: 0; border: none; text-align: left; background: #fff;
                border-radius: 14px; overflow: hidden; cursor: pointer; font: inherit;
                box-shadow: 0 4px 14px rgba(0,0,0,0.10);
                transform: perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0));
                transform-style: preserve-3d; will-change: transform;
                transition: box-shadow .3s ease, transform .12s ease, opacity .6s ease;
                opacity: 0; translate: 0 26px;  /* reveal start */
            }
            .pg-card.in { opacity: 1; translate: 0 0; transition: opacity .6s ease, translate .6s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease, transform .12s ease; }
            .pg-card { border-top: 3px solid transparent; }
            .pg-card:hover { box-shadow: 0 20px 42px rgba(223,70,2,0.30); border-top-color: #f29934; }
            .pg-card:focus-visible { outline: none; box-shadow: 0 0 0 3px #f29934, 0 20px 42px rgba(223,70,2,0.30); }

            .pg-fig { margin: 0; }
            .pg-thumb { position: relative; width: 100%; overflow: hidden; background: #ececec; }
            .pg-img {
                width: 100%; height: auto; display: block;
                opacity: 0; transition: opacity .5s ease, transform .5s ease;
            }
            .pg-img.loaded { opacity: 1; }
            .pg-card:hover .pg-img { transform: scale(1.06); }

            /* Cursor-tracked spotlight glow. */
            .pg-spot {
                position: absolute; inset: 0; pointer-events: none;
                background: radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.28), rgba(255,255,255,0) 60%);
                opacity: 0; transition: opacity .25s ease; mix-blend-mode: soft-light;
            }
            .pg-card:hover .pg-spot { opacity: 1; }

            .pg-cap {
                padding: 12px 14px; font-size: 14px; font-weight: 700; text-align: center;
                color: #fff; background: linear-gradient(135deg, #DF4602, #f29934);
            }

            /* Lightbox */
            .pg-backdrop {
                position: fixed; inset: 0; z-index: 1000;
                background: rgba(10,10,14,0.82);
                -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
                display: flex; align-items: center; justify-content: center;
                padding: 20px; cursor: pointer; animation: pg-fade .22s ease;
            }
            .pg-dialog {
                position: relative; max-width: 92%; max-height: 92%;
                display: flex; flex-direction: column; align-items: center;
                cursor: default; outline: none; animation: pg-zoom .28s cubic-bezier(.2,.7,.2,1);
                touch-action: pan-y;
            }
            .pg-media { max-width: 100%; max-height: 72vh; object-fit: contain; border-radius: 10px; background: #000; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
            .pg-media.pg-kb { animation: pg-kenburns 14s ease-out forwards; }
            .pg-modal-cap {
                color: #fff; margin-top: 14px; font-size: 15px; font-weight: 600; line-height: 1.45;
                text-align: center; max-width: min(640px, 86vw);
                max-height: 18vh; overflow-y: auto;
                padding: 8px 16px; border-radius: 10px; background: rgba(0,0,0,0.55);
            }
            .pg-count { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 8px; letter-spacing: .06em; }
            /* Nav + close are pinned to the viewport (children of the backdrop),
               so they never depend on the image width. */
            .pg-nav, .pg-close {
                position: fixed; z-index: 1002; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.35);
                color: #fff; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
                -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); transition: background .2s ease, transform .2s ease;
            }
            .pg-nav { top: 50%; transform: translateY(-50%); width: 52px; height: 52px; font-size: 32px; line-height: 1; }
            .pg-nav:hover, .pg-nav:focus-visible { background: rgba(0,0,0,0.75); transform: translateY(-50%) scale(1.1); outline: none; }
            .pg-close:hover, .pg-close:focus-visible { background: rgba(0,0,0,0.75); transform: scale(1.1); outline: none; }
            .pg-prev { left: 20px; }
            .pg-next { right: 20px; }
            .pg-close { top: 20px; right: 20px; width: 42px; height: 42px; font-size: 24px; }

            @keyframes pg-fade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes pg-zoom { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }
            @keyframes pg-kenburns { from { transform: scale(1); } to { transform: scale(1.04); } }

            @media (max-width: 640px) {
                .pg-nav { width: 44px; height: 44px; font-size: 26px; }
                .pg-prev { left: 10px; } .pg-next { right: 10px; } .pg-close { top: 12px; right: 12px; }
            }
            /* Tilt + spotlight are hover-pointer only (skip touch). */
            @media (hover: none) {
                .pg-card { transform: none; }
                .pg-spot { display: none; }
            }
            @media (prefers-reduced-motion: reduce) {
                .pg-card, .pg-img, .pg-spot { transition: none; transform: none; opacity: 1; translate: none; }
                .pg-card:hover .pg-img { transform: none; }
                .pg-backdrop, .pg-dialog, .pg-media.pg-kb { animation: none; }
            }
        `}</style>
    );

    if (loading) {
        return (
            <div>
                {styles}
                <h1 className={'text-align-center'}>Photo Gallery</h1>
                <div className={'padding-top-20'}><p style={{ textAlign: 'center' }}>Loading photos...</p></div>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div>
                <h1 className={'text-align-center'}>Photo Gallery</h1>
                <div className={'padding-top-20'}><p style={{ textAlign: 'center' }}>No photos available</p></div>
            </div>
        );
    }

    const currentIndex = selectedPhoto ? photos.findIndex((p) => p.id === selectedPhoto.id) : -1;

    return (
        <div className="pg-wrap">
            {styles}
            <h1 className={'text-align-center pg-title'}>Photo Gallery</h1>
            <div className={'padding-top-20 pg-subtitle-row'}>
                <span className="pg-subtitle">🎃 IGO 2026 Halloween Costume Contest 🎃</span>
            </div>

            <div className="pg-grid" ref={gridRef}>
                {photos.map((photo, index) => (
                    <PhotoCard key={photo.id} photo={photo} index={index} onOpen={openModal} />
                ))}
            </div>

            {selectedPhoto && (
                <div className="pg-backdrop" onClick={closeModal}>
                    <button type="button" className="pg-nav pg-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); goToOffset(-1); }}>‹</button>
                    <button type="button" className="pg-nav pg-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); goToOffset(1); }}>›</button>
                    <button type="button" className="pg-close" aria-label="Close" onClick={(e) => { e.stopPropagation(); closeModal(); }}>×</button>
                    <div
                        className="pg-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedPhoto.team || 'Photo viewer'}
                        tabIndex={-1}
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        {selectedPhoto.isVideo ? (
                            <video className="pg-media" src={selectedPhoto.url} controls autoPlay onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                            <img
                                key={selectedPhoto.id}
                                className="pg-media pg-kb"
                                src={selectedPhoto.url}
                                alt={selectedPhoto.team || 'IGO costume contest entry'}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                            />
                        )}

                        {selectedPhoto.team && <div className="pg-modal-cap">{selectedPhoto.team}</div>}
                        <div className="pg-count">{currentIndex + 1} / {photos.length}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoGallery;
