import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config.js';

// A single choice card with cursor-tracked 3D tilt + spotlight.
function CardItem({ c }) {
    const handleMove = (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${(px - 0.5) * 8}deg`);
        el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
    };
    const handleLeave = (e) => {
        e.currentTarget.style.setProperty('--ry', '0deg');
        e.currentTarget.style.setProperty('--rx', '0deg');
    };

    return (
        <Link className="oh-card" to={c.to} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <span className="oh-wm" aria-hidden="true">{c.emoji}</span>
            <span className="oh-spot" aria-hidden="true" />
            <div className="oh-card-body">
                <div className="oh-card-emoji" aria-hidden="true">{c.emoji}</div>
                <h2 className="oh-card-title">{c.title}</h2>
                <p className="oh-card-desc">{c.desc}</p>
                <span className="oh-card-cta">{c.cta} <span className="arw" aria-hidden="true">→</span></span>
            </div>
        </Link>
    );
}

// Open House landing: two cards let the visitor pick a section.
function Landing() {
    const cards = [
        {
            to: `${config.root}gallery`,
            emoji: '📸',
            title: 'Photo Gallery',
            desc: 'Browse the 2026 Halloween costume contest — every team, in full.',
            cta: 'View the photos',
        },
        {
            to: `${config.root}results`,
            emoji: '🧬',
            title: "Swab 'n Seq Results",
            desc: 'Anonymized sequencing run data and Swab & Seq info — loading soon.',
            cta: 'Coming soon',
        },
    ];

    const floaters = [
        { e: '🦇', cls: 'f1' }, { e: '🕷️', cls: 'f2' }, { e: '👻', cls: 'f3' },
        { e: '🎃', cls: 'f4' }, { e: '🕸️', cls: 'f5' }, { e: '🦇', cls: 'f6' },
        { e: '🍬', cls: 'f7' }, { e: '🌙', cls: 'f8' },
    ];

    return (
        <div className="oh-landing">
            <style>{`
                .oh-landing {
                    position: relative; overflow: hidden; border-radius: 22px;
                    padding: 54px 20px 64px; text-align: center;
                    background:
                        radial-gradient(1100px 380px at 50% -60px, rgba(242,153,52,0.22), rgba(242,153,52,0) 70%),
                        radial-gradient(700px 300px at 85% 120%, rgba(138,63,251,0.14), rgba(138,63,251,0) 70%),
                        linear-gradient(180deg, #fff8f1 0%, #fbf5ff 100%);
                }

                .oh-floaters { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
                .oh-floaters span {
                    position: absolute; font-size: 30px; opacity: .5;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
                    animation: oh-float 7s ease-in-out infinite;
                }
                .oh-floaters .f1 { top: 10%;  left: 7%;  font-size: 34px; animation-duration: 8s; }
                .oh-floaters .f2 { top: 22%;  left: 90%; animation-duration: 9s;  animation-delay: -2s; }
                .oh-floaters .f3 { top: 62%;  left: 5%;  font-size: 38px; animation-duration: 7.5s; animation-delay: -1s; }
                .oh-floaters .f4 { top: 74%;  left: 92%; font-size: 30px; animation-duration: 8.5s; animation-delay: -3s; }
                .oh-floaters .f5 { top: 8%;   left: 50%; font-size: 26px; opacity: .35; animation-duration: 10s; }
                .oh-floaters .f6 { top: 46%;  left: 96%; font-size: 24px; animation-duration: 6.5s; animation-delay: -2.5s; }
                .oh-floaters .f7 { top: 86%;  left: 18%; font-size: 26px; animation-duration: 7s;  animation-delay: -1.5s; }
                .oh-floaters .f8 { top: 14%;  left: 78%; font-size: 28px; opacity: .4; animation-duration: 9.5s; animation-delay: -4s; }

                .oh-inner { position: relative; z-index: 1; max-width: 980px; margin: 0 auto; }

                .oh-hero-title {
                    position: relative; display: inline-block;
                    font-size: clamp(34px, 6.5vw, 60px); font-weight: 800; margin: 4px 0 8px; line-height: 1.1;
                    background: linear-gradient(90deg, #DF4602, #f29934 45%, #8a3ffb 90%);
                    background-size: 220% auto;
                    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
                    animation: oh-shift 6s ease infinite;
                }
                .oh-pumpkin {
                    display: inline-block; transform-origin: center bottom;
                    animation: oh-bob 1.9s ease-in-out infinite;
                    color: #000; -webkit-text-fill-color: currentColor;
                }
                .oh-hero-sub { color: #6b2d8b; font-weight: 600; margin: 0 0 42px; font-size: 17px; }

                .oh-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 26px; }
                .oh-card {
                    position: relative; overflow: hidden; display: block; text-decoration: none; color: inherit; text-align: left;
                    background: rgba(255,255,255,0.86); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
                    border: 1px solid rgba(255,255,255,0.7); border-radius: 20px; padding: 30px 28px;
                    box-shadow: 0 10px 30px rgba(31,16,0,0.10);
                    transform: perspective(1000px) rotateX(var(--rx,0)) rotateY(var(--ry,0)) scale(var(--s,1));
                    transform-style: preserve-3d; will-change: transform;
                    transition: transform .14s ease, box-shadow .28s ease;
                }
                .oh-card::before {
                    content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; z-index: 3;
                    background: linear-gradient(90deg, #DF4602, #f29934, #8a3ffb);
                    transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
                }
                .oh-card:hover, .oh-card:focus-visible { --s: 1.02; outline: none; box-shadow: 0 26px 52px rgba(223,70,2,0.26); }
                .oh-card:hover::before, .oh-card:focus-visible::before { transform: scaleX(1); }

                .oh-spot {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(242,153,52,0.20), rgba(242,153,52,0) 60%);
                    opacity: 0; transition: opacity .25s ease;
                }
                .oh-card:hover .oh-spot { opacity: 1; }
                .oh-wm {
                    position: absolute; right: -12px; bottom: -22px; font-size: 118px; line-height: 1;
                    opacity: .07; transform: rotate(-12deg); z-index: 0; pointer-events: none;
                }
                .oh-card-body { position: relative; z-index: 2; }

                .oh-card-emoji {
                    width: 68px; height: 68px; border-radius: 18px; display: flex; align-items: center; justify-content: center;
                    font-size: 34px; margin-bottom: 16px;
                    background: linear-gradient(135deg, #ffe7cf, #ffe0f0);
                    box-shadow: 0 6px 16px rgba(223,70,2,0.18), inset 0 0 0 1px rgba(255,255,255,0.6);
                    transition: transform .28s ease;
                }
                .oh-card:hover .oh-card-emoji { transform: rotate(-8deg) scale(1.06); }
                .oh-card-title { font-size: 23px; font-weight: 800; margin: 0 0 8px; color: #2a2a2a; }
                .oh-card-desc { font-size: 15px; line-height: 1.55; color: #555; margin: 0 0 20px; }
                .oh-card-cta { font-weight: 800; color: #DF4602; display: inline-flex; align-items: center; gap: 8px; font-size: 15px; }
                .oh-card-cta .arw { transition: transform .25s ease; }
                .oh-card:hover .oh-card-cta .arw { transform: translateX(6px); }

                @keyframes oh-bob {
                    0%, 100% { transform: translateY(0) rotate(-7deg); }
                    50%      { transform: translateY(-10px) rotate(7deg); }
                }
                @keyframes oh-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes oh-float {
                    0%, 100% { transform: translateY(0) rotate(-6deg); }
                    50%      { transform: translateY(-22px) rotate(6deg); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .oh-pumpkin, .oh-hero-title, .oh-floaters span { animation: none; }
                    .oh-card { transition: none; transform: none; }
                    .oh-card:hover { --s: 1; }
                    .oh-card:hover .oh-card-emoji { transform: none; }
                    .oh-spot { display: none; }
                }
            `}</style>

            <div className="oh-floaters" aria-hidden="true">
                {floaters.map((f, i) => <span key={i} className={f.cls}>{f.e}</span>)}
            </div>

            <div className="oh-inner">
                <h1 className="oh-hero-title"><span className="oh-pumpkin" aria-hidden="true">🎃</span> IGO Open House</h1>
                <p className="oh-hero-sub">Welcome! Pick where you'd like to go.</p>

                <div className="oh-cards">
                    {cards.map((c) => <CardItem key={c.title} c={c} />)}
                </div>
            </div>
        </div>
    );
}

export default Landing;
