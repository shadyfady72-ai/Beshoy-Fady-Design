
import { useEffect, useRef, useState } from 'react';

const sparks = [
  { x: '12%', y: '22%', delay: '0s', color: '#c4a2ff' },
  { x: '82%', y: '13%', delay: '.3s', color: '#ffffff' },
  { x: '94%', y: '65%', delay: '.7s', color: '#b7a2ff' },
  { x: '18%', y: '87%', delay: '.5s', color: '#ffffff' },
  { x: '68%', y: '94%', delay: '1s', color: '#a980ff' },
  { x: '3%', y: '58%', delay: '.8s', color: '#ffffff' },
];

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const arcOneRef = useRef<HTMLDivElement>(null);
  const arcTwoRef = useRef<HTMLDivElement>(null);

  const ringOneRef = useRef<HTMLDivElement>(null);
  const ringTwoRef = useRef<HTMLDivElement>(null);

  const impactRightRef = useRef<HTMLDivElement>(null);
  const impactLeftRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animations: Animation[] = [];

    const play = (
      element: HTMLElement | null,
      frames: Keyframe[],
      options: KeyframeAnimationOptions
    ) => {
      if (!element) return;

      const animation = element.animate(frames, options);
      animations.push(animation);
    };

    const stage = stageRef.current;
    const runner = runnerRef.current;

    if (!stage || !runner) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const duration = reducedMotion ? 1200 : 7200;
    const exitAt = reducedMotion ? 1800 : 8400;
    const removeAt = reducedMotion ? 2400 : 9100;

    const distance = Math.max(
      0,
      stage.clientWidth / 2 - 66
    );

    if (reducedMotion) {
      play(
        runner,
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(0)' },
        ],
        {
          duration,
          fill: 'forwards',
        }
      );
    } else {
      // اللوجو يجري يمين وشمال ويرجع للمنتصف
      play(
        runner,
        [
          {
            transform: `translateX(-${distance}px)`,
            offset: 0,
          },
          {
            transform: `translateX(${distance}px)`,
            offset: 0.30,
          },
          {
            transform: `translateX(${distance - 32}px)`,
            offset: 0.33,
          },
          {
            transform: `translateX(${distance}px)`,
            offset: 0.36,
          },
          {
            transform: `translateX(-${distance}px)`,
            offset: 0.64,
          },
          {
            transform: `translateX(-${distance - 32}px)`,
            offset: 0.67,
          },
          {
            transform: `translateX(-${distance}px)`,
            offset: 0.70,
          },
          {
            transform: 'translateX(0)',
            offset: 0.80,
          },
          {
            transform: 'translateX(0)',
            offset: 1,
          },
        ],
        {
          duration,
          easing: 'linear',
          fill: 'forwards',
        }
      );

      // حركة خفيفة للوجو أثناء الجري
      play(
        bodyRef.current,
        [
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: 'translateY(-8px) rotate(5deg)' },
          { transform: 'translateY(2px) rotate(-5deg)' },
          { transform: 'translateY(0) rotate(0deg)' },
        ],
        {
          duration: 360,
          iterations: 15,
          easing: 'ease-in-out',
        }
      );

      // مدارات رفيعة حول اللوجو
      play(
        arcOneRef.current,
        [
          {
            transform:
              'translate(-50%, -50%) rotate(0deg)',
          },
          {
            transform:
              'translate(-50%, -50%) rotate(360deg)',
          },
        ],
        {
          duration: 2400,
          iterations: Infinity,
          easing: 'linear',
        }
      );

      play(
        arcTwoRef.current,
        [
          {
            transform:
              'translate(-50%, -50%) rotate(360deg)',
          },
          {
            transform:
              'translate(-50%, -50%) rotate(0deg)',
          },
        ],
        {
          duration: 3700,
          iterations: Infinity,
          easing: 'linear',
        }
      );

      // الاصطدام اليمين
      play(
        impactRightRef.current,
        [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.2)', offset: 0 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.2)', offset: .29 },
          { opacity: 1, transform: 'translate(-50%, -50%) scale(.75)', offset: .31 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.9)', offset: .39 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.9)', offset: 1 },
        ],
        {
          duration,
          fill: 'forwards',
        }
      );

      // الاصطدام الشمال
      play(
        impactLeftRef.current,
        [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.2)', offset: 0 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.2)', offset: .63 },
          { opacity: 1, transform: 'translate(-50%, -50%) scale(.75)', offset: .65 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.9)', offset: .73 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.9)', offset: 1 },
        ],
        {
          duration,
          fill: 'forwards',
        }
      );
    }

    // الحلقة النهائية تظهر عند وصول اللوجو
    const revealFrames: Keyframe[] = reducedMotion
      ? [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.85)', offset: 0 },
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', offset: 1 },
        ]
      : [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.7)', offset: 0 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.7)', offset: .75 },
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1.12)', offset: .83 },
          { opacity: 0.75, transform: 'translate(-50%, -50%) scale(1)', offset: 1 },
        ];

    play(ringOneRef.current, revealFrames, {
      duration,
      fill: 'forwards',
      easing: 'ease-out',
    });

    play(
      ringTwoRef.current,
      reducedMotion
        ? [
            { opacity: 0, transform: 'translate(-50%, -50%) scale(.8)' },
            { opacity: .35, transform: 'translate(-50%, -50%) scale(1)' },
          ]
        : [
            { opacity: 0, transform: 'translate(-50%, -50%) scale(.8)', offset: 0 },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(.8)', offset: .76 },
            { opacity: .55, transform: 'translate(-50%, -50%) scale(1.2)', offset: .86 },
            { opacity: .25, transform: 'translate(-50%, -50%) scale(1)', offset: 1 },
          ],
      {
        duration,
        fill: 'forwards',
        easing: 'ease-out',
      }
    );

    // فلاش ناعم عند الوصول للمنتصف
    if (!reducedMotion) {
      play(
        flashRef.current,
        [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.4)', offset: 0 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.4)', offset: .77 },
          { opacity: .85, transform: 'translate(-50%, -50%) scale(1)', offset: .80 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(2.2)', offset: .90 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(2.2)', offset: 1 },
        ],
        {
          duration,
          fill: 'forwards',
        }
      );
    }

    // ظهور الاسم بشكل سينمائي
    play(
      nameRef.current,
      reducedMotion
        ? [
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [
            { opacity: 0, transform: 'translateY(22px)', offset: 0 },
            { opacity: 0, transform: 'translateY(22px)', offset: .79 },
            { opacity: 1, transform: 'translateY(0)', offset: .94 },
            { opacity: 1, transform: 'translateY(0)', offset: 1 },
          ],
      {
        duration,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );

    // ظهور التخصص
    play(
      roleRef.current,
      reducedMotion
        ? [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [
            { opacity: 0, transform: 'translateY(12px)', offset: 0 },
            { opacity: 0, transform: 'translateY(12px)', offset: .85 },
            { opacity: .85, transform: 'translateY(0)', offset: 1 },
          ],
      {
        duration,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );

    // خط رفيع تحت الاسم
    play(
      lineRef.current,
      reducedMotion
        ? [
            { opacity: 0, transform: 'scaleX(0)' },
            { opacity: 1, transform: 'scaleX(1)' },
          ]
        : [
            { opacity: 0, transform: 'scaleX(0)', offset: 0 },
            { opacity: 0, transform: 'scaleX(0)', offset: .85 },
            { opacity: 1, transform: 'scaleX(1)', offset: 1 },
          ],
      {
        duration,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );

    const exitTimer = window.setTimeout(
      () => setExiting(true),
      exitAt
    );

    const removeTimer = window.setTimeout(
      () => setVisible(false),
      removeAt
    );

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);

      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`cinematic-intro ${exiting ? 'cinematic-exit' : ''}`}>
      <div className="cinematic-stage" ref={stageRef}>
        <div className="cinematic-ambient" />
        <div className="cinematic-grain" />

        {/* حلقات ظهور الهوية */}
        <div className="final-ring ring-primary" ref={ringOneRef} />
        <div className="final-ring ring-secondary" ref={ringTwoRef} />

        {/* فلاش الوصول */}
        <div className="arrival-flash" ref={flashRef} />

        {/* تأثيرات الاصطدام */}
        <div className="impact impact-right" ref={impactRightRef}>
          <div className="impact-circle" />
          <div className="impact-center" />
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="impact-ray"
              style={{ transform: `rotate(${i * 45}deg)` }}
            />
          ))}
        </div>

        <div className="impact impact-left" ref={impactLeftRef}>
          <div className="impact-circle" />
          <div className="impact-center" />
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="impact-ray"
              style={{ transform: `rotate(${i * 45}deg)` }}
            />
          ))}
        </div>

        {/* اللوجو والمدارات الضوئية */}
        <div className="cinematic-runner" ref={runnerRef}>
          <div className="orbit-arc orbit-one" ref={arcOneRef} />
          <div className="orbit-arc orbit-two" ref={arcTwoRef} />

          <div className="logo-body" ref={bodyRef}>
            <div className="logo-soft-glow" />

            <img
              src="/intro-logo.png"
              alt="Beshoy Fady"
              className="cinematic-logo"
            />

            <div className="micro-sparks">
              {sparks.map((spark, i) => (
                <span
                  key={i}
                  style={{
                    left: spark.x,
                    top: spark.y,
                    background: spark.color,
                    animationDelay: spark.delay,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* الهوية النهائية */}
        <div className="brand-lockup">
          <h1 ref={nameRef} className="brand-name">
            BESHOY FADY
          </h1>

          <div ref={lineRef} className="brand-divider" />

          <p ref={roleRef} className="brand-role">
            GRAPHIC DESIGNER <span>·</span> UI/UX DESIGNER
          </p>
        </div>
      </div>

      <style>{`
        .cinematic-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #050507;
          overflow: hidden;
          opacity: 1;
          transition: opacity 700ms ease, visibility 700ms ease;
          isolation: isolate;
        }

        .cinematic-exit {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .cinematic-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          isolation: isolate;
        }

        /* خلفية سينمائية بدون أي مستطيلات */
        .cinematic-ambient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse 35% 42% at 50% 48%,
              rgba(74, 36, 122, .12),
              transparent 75%
            ),
            radial-gradient(
              ellipse 55% 65% at 50% 50%,
              rgba(34, 19, 58, .12),
              transparent 80%
            );
          pointer-events: none;
        }

        .cinematic-grain {
          position: absolute;
          inset: 0;
          opacity: .13;
          pointer-events: none;
          background-image:
            radial-gradient(
              rgba(255,255,255,.11) .5px,
              transparent .8px
            );
          background-size: 7px 7px;
          mask-image: radial-gradient(
            ellipse at center,
            black 5%,
            transparent 85%
          );
        }

        /* اللوجو */
        .cinematic-runner {
          position: absolute;
          left: 50%;
          top: 45%;
          width: 110px;
          height: 110px;
          margin-left: -55px;
          margin-top: -55px;
          z-index: 10;
          will-change: transform;
        }

        .logo-body {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center bottom;
          will-change: transform;
        }

        .cinematic-logo {
          position: relative;
          z-index: 3;
          width: 88px;
          height: 88px;
          display: block;
          object-fit: contain;
          filter:
            drop-shadow(0 0 9px rgba(255,255,255,.15))
            drop-shadow(0 0 18px rgba(153,104,255,.25));
        }

        .logo-soft-glow {
          position: absolute;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: rgba(141, 85, 245, .35);
          filter: blur(38px);
          z-index: 1;
        }

        /* مدارات طاقة رفيعة ومنحنية */
        .orbit-arc {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
        }

        .orbit-one {
          width: 148px;
          height: 148px;
          border: 1px solid transparent;
          border-top-color: rgba(196,160,255,.8);
          border-right-color: rgba(196,160,255,.17);
          filter: drop-shadow(0 0 5px rgba(166,115,255,.35));
        }

        .orbit-two {
          width: 174px;
          height: 174px;
          border: 1px solid transparent;
          border-bottom-color: rgba(255,255,255,.35);
          border-left-color: rgba(168,126,255,.14);
        }

        .orbit-one::after,
        .orbit-two::after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow:
            0 0 9px #ffffff,
            0 0 16px rgba(171,120,255,.85);
        }

        .orbit-one::after {
          top: 8px;
          left: 30px;
        }

        .orbit-two::after {
          bottom: 14px;
          right: 24px;
          width: 3px;
          height: 3px;
          background: #b99aff;
        }

        /* نقاط ضوئية صغيرة */
        .micro-sparks {
          position: absolute;
          inset: -38px;
          z-index: 4;
          pointer-events: none;
        }

        .micro-sparks span {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          animation: microFloat 1.6s ease-in-out infinite alternate;
        }

        @keyframes microFloat {
          from {
            opacity: .15;
            translate: 0 0;
            scale: .7;
          }
          to {
            opacity: .9;
            translate: 0 -9px;
            scale: 1.2;
          }
        }

        /* حلقات النهاية */
        .final-ring {
          position: absolute;
          left: 50%;
          top: 45%;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }

        .ring-primary {
          width: 190px;
          height: 190px;
          border: 1px solid rgba(190,156,255,.48);
          box-shadow:
            0 0 30px rgba(139,84,255,.07),
            inset 0 0 25px rgba(139,84,255,.04);
        }

        .ring-secondary {
          width: 240px;
          height: 240px;
          border: 1px solid rgba(255,255,255,.15);
        }

        /* الفلاش النهائي */
        .arrival-flash {
          position: absolute;
          left: 50%;
          top: 45%;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255,255,255,.55) 0%,
            rgba(180,138,255,.35) 18%,
            rgba(126,72,220,.12) 42%,
            transparent 72%
          );
          filter: blur(12px);
          opacity: 0;
          pointer-events: none;
          z-index: 4;
        }

        /* اصطدامات زجاجية مضيئة */
        .impact {
          position: absolute;
          top: 45%;
          width: 120px;
          height: 120px;
          opacity: 0;
          z-index: 5;
          pointer-events: none;
        }

        .impact-right {
          left: calc(100% - 66px);
        }

        .impact-left {
          left: 66px;
        }

        .impact-circle {
          position: absolute;
          inset: 18px;
          border-radius: 50%;
          border: 1px solid rgba(211,184,255,.85);
          box-shadow:
            0 0 18px rgba(162,110,255,.45),
            inset 0 0 12px rgba(162,110,255,.2);
        }

        .impact-center {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 15px #ffffff,
            0 0 35px #ad83ff;
        }

        .impact-ray {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1px;
          height: 53px;
          transform-origin: center top;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,.9),
            rgba(180,140,255,.3),
            transparent
          );
        }

        /* الهوية */
        .brand-lockup {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(45% + 135px);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 20px;
          pointer-events: none;
        }

        .brand-name {
          margin: 0;
          color: #f8f7fb;
          font-family:
            'Montserrat',
            'Inter',
            'Arial',
            sans-serif;
          font-size: clamp(28px, 4vw, 55px);
          font-weight: 700;
          letter-spacing: .15em;
          line-height: 1.15;
          opacity: 0;
          text-shadow: 0 0 25px rgba(255,255,255,.06);
        }

        .brand-divider {
          margin-top: 20px;
          width: 72px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #b99aff,
            #ffffff,
            #b99aff,
            transparent
          );
          opacity: 0;
          transform-origin: center;
        }

        .brand-role {
          margin: 17px 0 0;
          color: rgba(230,225,242,.62);
          font-family: 'Inter', 'Arial', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .28em;
          line-height: 1.8;
          opacity: 0;
        }

        .brand-role span {
          color: #b99aff;
          margin: 0 9px;
        }

        @media (max-width: 600px) {
          .cinematic-runner {
            width: 94px;
            height: 94px;
            margin-left: -47px;
            margin-top: -47px;
          }

          .cinematic-logo {
            width: 78px;
            height: 78px;
          }

          .orbit-one {
            width: 130px;
            height: 130px;
          }

          .orbit-two {
            width: 155px;
            height: 155px;
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
            top: calc(45% + 112px);
          }

          .brand-name {
            font-size: clamp(23px, 7vw, 34px);
            letter-spacing: .10em;
          }

          .brand-role {
            font-size: 8px;
            letter-spacing: .12em;
          }

          .brand-divider {
            margin-top: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .micro-sparks span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
