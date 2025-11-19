import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 로그인 로직 (추후 구현)
    // 시뮬레이션을 위한 딜레이
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home"); // 로그인 성공 시 홈으로 이동
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        {/* 컬러풀한 로딩 스피너 - 꽃잎 형태 */}
        <div className="relative w-20 h-20 mb-6">
          {/* 외곽 원형들 */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-orange-400 animate-spin"></div>
          <div className="absolute inset-1 rounded-full border-3 border-transparent border-r-yellow-400 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-2 rounded-full border-3 border-transparent border-b-blue-400 animate-spin" style={{ animationDuration: '1.2s' }}></div>
          <div className="absolute inset-3 rounded-full border-3 border-transparent border-l-gray-300 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          {/* 중앙 원 */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-200 to-blue-200"></div>
        </div>
        <p className="text-gray-600 text-sm">로그인 중...</p>
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
          className="w-24 h-24 mx-auto object-contain"
        />
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        {/* Email 입력 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="-"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Password 입력 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="-"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Sign In 버튼 */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
      </form>

      {/* 비밀번호 찾기 링크 */}
      <button
        onClick={() => {
          // 비밀번호 찾기 페이지로 이동 (추후 구현)
          console.log("비밀번호 찾기");
        }}
        className="mt-6 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        비밀번호를 잊으셨나요?
      </button>
    </div>
  );
}

