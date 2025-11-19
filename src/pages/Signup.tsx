import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    // 회원가입 로직 (추후 구현)
    // 시뮬레이션을 위한 딜레이
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home"); // 회원가입 성공 시 홈으로 이동
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center">
          {/* 컬러 스피너 (이미지 느낌 비슷하게) */}
          <svg
            className="w-28 h-28 mb-6 animate-spin"
            viewBox="0 0 100 100"
            style={{ animationDuration: "2.0s" }}
          >
            <defs>
              <filter
                id="login-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                <feOffset dx="0" dy="1" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 8개의 막대(스포크) - 45도씩 균등 배치 */}
            <g
              filter="url(#login-shadow)"
              strokeLinecap="round"
              strokeWidth="6"
            >
              {(() => {
                const centerX = 50;
                const centerY = 50;
                const innerRadius = 12; // 막대 시작 반지름
                const outerRadius = 36; // 막대 끝 반지름
                const colors = [
                  "#f97316", // 주황 (위)
                  "#facc15", // 노랑 (오른쪽 위)
                  "#4ade80", // 연초록 (오른쪽)
                  "#22c55e", // 초록 (오른쪽 아래)
                  "#38bdf8", // 파랑 (아래)
                  "#60a5fa", // 연파랑 (왼쪽 아래)
                  "#a5b4fc", // 연보라 (왼쪽)
                  "#fb7185", // 핑크 (왼쪽 위)
                ];

                return colors.map((color, index) => {
                  // 각 막대는 45도씩 간격 (0도부터 시작, 위쪽이 -90도)
                  const angle = (index * 45 - 90) * (Math.PI / 180);
                  const x1 = centerX + innerRadius * Math.cos(angle);
                  const y1 = centerY + innerRadius * Math.sin(angle);
                  const x2 = centerX + outerRadius * Math.cos(angle);
                  const y2 = centerY + outerRadius * Math.sin(angle);

                  return (
                    <line
                      key={index}
                      x1={x1.toFixed(2)}
                      y1={y1.toFixed(2)}
                      x2={x2.toFixed(2)}
                      y2={y2.toFixed(2)}
                      stroke={color}
                    />
                  );
                });
              })()}
            </g>
          </svg>

          {/* 텍스트 */}
          <p className="text-gray-500 text-lg tracking-[0.35em]">
            회원가입 중<span className="animate-pulse">...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-12">
        <img
          src="/images/logo.png"
          alt="BLENDEE"
          className="w-28 h-28 mx-auto object-contain"
        />
      </div>

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">
        {/* 이름 입력 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Email 입력 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Password 입력 */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Password 확인 입력 */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password 확인
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 확인해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}

        {/* Sign Up 버튼 */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
        >
          Sign Up
        </button>
      </form>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-black font-medium hover:underline"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
