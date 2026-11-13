import React from 'react';

// Placeholder shown while the Swab 'n Seq Results section is hidden.
function ComingSoon() {
    return (
        <div className="oh-soon">
            <style>{`
                .oh-soon { max-width: 720px; margin: 0 auto; padding: 72px 20px; text-align: center; }
                .oh-soon-emoji { font-size: 64px; display: inline-block; animation: oh-soon-pulse 2.2s ease-in-out infinite; }
                .oh-soon-title {
                    font-size: clamp(28px, 5vw, 42px); font-weight: 800; margin: 18px 0 6px;
                    background: linear-gradient(90deg, #DF4602, #f29934 60%, #8a3ffb);
                    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
                }
                .oh-soon-badge {
                    display: inline-block; margin: 10px 0 18px; padding: 7px 18px; border-radius: 999px;
                    font-weight: 700; letter-spacing: .04em; text-transform: uppercase; font-size: 13px;
                    color: #fff; background: linear-gradient(135deg, #DF4602, #f29934);
                    box-shadow: 0 6px 16px rgba(223,70,2,0.28);
                }
                .oh-soon-text { color: #555; font-size: 16px; line-height: 1.6; }
                @keyframes oh-soon-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
                @media (prefers-reduced-motion: reduce) { .oh-soon-emoji { animation: none; } }
            `}</style>
            <span className="oh-soon-emoji" aria-hidden="true">🧬</span>
            <h1 className="oh-soon-title">Swab 'n Seq Results</h1>
            <div className="oh-soon-badge">Coming Soon</div>
            <p className="oh-soon-text">Sequencing results are loading soon — check back shortly.<br/>In the meantime, enjoy the Photo Gallery!</p>
        </div>
    );
}

export default ComingSoon;
