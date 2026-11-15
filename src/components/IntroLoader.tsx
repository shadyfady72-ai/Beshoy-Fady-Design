
import { useEffect, useState } from 'react';

const name = 'BESHOY FADY';

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), 4200);
    const removeTimer = window.setTimeout(() => setVisible(false), 4900);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`cinematic-intro ${exiting ? 'cinematic-exit' : ''}`}>
      <div className="cinematic-stage">
        <div className="cinematic-ambient" />
        <div className="cinematic-grain" />

        

        <div className="cinematic-logo-wrap">
          <div className="logo-soft-glow" />

          <img
            src="/intro-logo.png"
            alt="Beshoy Fady"
            className="cinematic-logo"
          />

          
        </div>

        <div className="brand-lockup">
          <h1 className="brand-name" aria-label={name}>
            {name.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="name-letter"
                style={{ animationDelay: `${650 + index * 65}ms` }}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <div className="brand-divider" />

          <p className="brand-role">
            <span className="role-word role-first">GRAPHIC DESIGNER</span>
            <span className="role-dot">·</span>
            <span className="role-word role-second">SOCIAL MEDIA DESIGNER</span>
          </p>
        </div>
      </div>

      <style>{`
        .cinematic-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          isolation: isolate;
          background: #050507;
          opacity: 1;
          visibility: visible;
          transition: opacity 700ms ease, visibility 700ms ease;
        }

        .cinematic-exit {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .cinematic-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
        }

        .cinematic-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 35% 42% at 50% 43%,
              rgba(74, 36, 122, .16),
              transparent 75%
            ),
            radial-gradient(
              ellipse 55% 65% at 50% 50%,
              rgba(34, 19, 58, .12),
              transparent 80%
            );
        }

        .cinematic-grain {
          position: absolute;
          inset: 0;
          opacity: .10;
          pointer-events: none;
          background-image: radial-gradient(
            rgba(255,255,255,.11) .5px,
            transparent .8px
          );
          background-size: 7px 7px;
          mask-image: radial-gradient(ellipse at center, black 5%, transparent 85%);
        }

        .cinematic-logo-wrap {
          position: absolute;
          left: 50%;
          top: 42%;
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          z-index: 10;
          opacity: 0;
          animation: logoReveal 1100ms ease-out 100ms forwards;
        }

        .cinematic-logo {
          position: relative;
          z-index: 3;
          display: block;
          width: 88px;
          height: 88px;
          object-fit: contain;
          filter:
            drop-shadow(0 0 9px rgba(255,255,255,.15))
            drop-shadow(0 0 18px rgba(153,104,255,.25));
        }

        .logo-soft-glow {
          position: absolute;
          z-index: 1;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: rgba(141, 85, 245, .35);
          filter: blur(38px);
          pointer-events: none;
        }

        

        

        

        
        .orbit-one::after {
          top: 8px;
          left: 30px;
        }

        .orbit-two::after {
          right: 24px;
          bottom: 14px;
          width: 3px;
          height: 3px;
          background: #b99aff;
        }

        .brand-lockup {
          position: absolute;
          top: calc(42% + 135px);
          left: 0;
          right: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          text-align: center;
          pointer-events: none;
        }

        .brand-name {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin: 0;
          color: #f8f7fb;
          font-family: 'Montserrat', 'Inter', 'Arial', sans-serif;
          font-size: clamp(28px, 4vw, 55px);
          font-weight: 700;
          letter-spacing: .15em;
          line-height: 1.15;
          text-shadow: 0 0 25px rgba(255,255,255,.06);
        }

        .name-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(12px);
          animation: letterReveal 500ms ease-out forwards;
          will-change: opacity, transform;
        }

        .brand-divider {
          width: 72px;
          height: 1px;
          margin-top: 20px;
          opacity: 0;
          transform: scaleX(.2);
          transform-origin: center;
          background: linear-gradient(
            90deg,
            transparent,
            #b99aff,
            #fff,
            #b99aff,
            transparent
          );
          animation: lineReveal 700ms ease-out 1550ms forwards;
        }

        .brand-role {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 17px 0 0;
          color: rgba(230,225,242,.72);
          font-family: 'Inter', 'Arial', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .22em;
          line-height: 1.8;
        }

        .role-word,
        .role-dot {
          opacity: 0;
          transform: translateY(7px);
          animation: roleReveal 650ms ease-out forwards;
          will-change: opacity, transform;
        }

        .role-first {
          animation-delay: 1750ms;
        }

        .role-dot {
          color: #b99aff;
          animation-delay: 1950ms;
        }

        .role-second {
          animation-delay: 2150ms;
        }

        @keyframes logoReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes letterReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes roleReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lineReveal {
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        

        @keyframes microFloat {
          from {
            opacity: .2;
            translate: 0 0;
            scale: .8;
          }
          to {
            opacity: .9;
            translate: 0 -7px;
            scale: 1.15;
          }
        }

        @media (max-width: 600px) {
          .cinematic-logo-wrap {
            width: 94px;
            height: 94px;
          }

          .cinematic-logo {
            width: 78px;
            height: 78px;
          }

          

          

          .ring-primary {
            width: 165px;
            height: 165px;
          }

          .ring-secondary {
            width: 205px;
            height: 205px;
          }

          .brand-lockup {
            top: calc(42% + 112px);
          }

          .brand-name {
            font-size: clamp(23px, 7vw, 34px);
            letter-spacing: .10em;
          }

          .brand-divider {
            margin-top: 15px;
          }

          .brand-role {
            gap: 7px;
            font-size: 8px;
            letter-spacing: .10em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
  .cinematic-logo-wrap {
    animation: logoReveal 1100ms ease-out 100ms forwards;
  }

  .name-letter {
    animation: letterReveal 500ms ease-out forwards;
  }

  .brand-divider {
    animation: lineReveal 700ms ease-out 1550ms forwards;
  }

  .role-first {
    animation: roleReveal 650ms ease-out 1750ms forwards;
  }

  .role-dot {
    animation: roleReveal 500ms ease-out 1950ms forwards;
  }

  .role-second {
    animation: roleReveal 650ms ease-out 2150ms forwards;
  }
}
      `}</style>
    </div>
  );
}
