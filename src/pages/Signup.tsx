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
        {/* 컬러풀한 로딩 스피너 - 꽃잎 형태 */}
        <div className="relative w-20 h-20 mb-6">
          {/* 외곽 원형들 */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-orange-400 animate-spin"></div>
          <div
            className="absolute inset-1 rounded-full border-3 border-transparent border-r-yellow-400 animate-spin"
            style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute inset-2 rounded-full border-3 border-transparent border-b-blue-400 animate-spin"
            style={{ animationDuration: "1.2s" }}
          ></div>
          <div
            className="absolute inset-3 rounded-full border-3 border-transparent border-l-gray-300 animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>
          {/* 중앙 원 */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-200 to-blue-200"></div>
        </div>
        <p className="text-gray-600 text-sm">회원가입 중...</p>
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
