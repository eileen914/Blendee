import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function WelcomeAnimation() {
  const navigate = useNavigate();
  const [waveProgress, setWaveProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    // 물결이 위로 올라오는 애니메이션 (약 1.8초)
    const startTime = Date.now();
    const duration = 1800;

    const waveAnimation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-out 함수 적용
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setWaveProgress(easedProgress * 100);

      if (progress < 1) {
        requestAnimationFrame(waveAnimation);
      } else {
        // 물결이 완전히 올라온 후 텍스트 표시
        setTimeout(() => {
          setShowText(true);
        }, 400);
      }
    };

    requestAnimationFrame(waveAnimation);

    // 물결 움직임 애니메이션
    const waveMoveInterval = setInterval(() => {
      setWaveOffset((prev) => (prev + 0.5) % 100);
    }, 50);

    // 전체 애니메이션 후 홈으로 이동 (약 4.5초 후)
    const timer = setTimeout(() => {
      navigate("/home");
    }, 4500);

    return () => {
      clearInterval(waveMoveInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 물결 애니메이션 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: `${waveProgress}%`,
          background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
          transition: "height 0.1s linear",
        }}
      >
        {/* 물결 경계선 SVG - 움직이는 효과 */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            transform: "translateY(-100%)",
            height: "120px",
          }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M0,60 Q300,${
              20 + Math.sin(waveOffset * 0.1) * 10
            } 600,60 T1200,60 L1200,120 L0,120 Z`}
            fill="url(#waveGradient)"
            style={{
              transition: "d 0.1s ease-out",
            }}
          />
        </svg>
      </div>

      {/* 텍스트 */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center" style={{ transform: "rotate(-2deg)" }}>
            <p
              className="text-4xl md:text-5xl font-bold text-white mb-2 animate-fade-in"
              style={{
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.5),
                  0 2px 2px rgba(0,0,0,0.1),
                  0 4px 4px rgba(0,0,0,0.05),
                  0 0 20px rgba(255,255,255,0.3)
                `,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                letterSpacing: "0.05em",
              }}
            >
              Be Our
            </p>
            <p
              className="text-5xl md:text-6xl font-bold text-white animate-fade-in-delay"
              style={{
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.5),
                  0 2px 2px rgba(0,0,0,0.1),
                  0 4px 4px rgba(0,0,0,0.05),
                  0 0 20px rgba(255,255,255,0.3)
                `,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                letterSpacing: "0.05em",
              }}
            >
              BLEND<span className="lowercase">ee</span>!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
