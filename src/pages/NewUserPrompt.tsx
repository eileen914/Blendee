import React from "react";
import { useNavigate } from "react-router-dom";

export function NewUserPrompt() {
  const navigate = useNavigate();

  const handleYes = () => {
    // 회원가입 페이지로 이동 (추후 구현)
    navigate("/signup");
  };

  const handleNo = () => {
    // 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-12">
        <img
          src="/images/logo.png"
          alt="BLENDEE"
          className="w-48 h-48 mx-auto object-contain"
        />
      </div>

      {/* 질문 */}
      <p className="text-lg text-gray-900 mb-12 text-center font-medium">
        블랜디는 처음이신가요?
      </p>

      {/* 버튼들 */}
      <div className="w-full max-w-xs flex gap-4">
        {/* 예 버튼 (회원가입) */}
        <button
          onClick={handleYes}
          className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium text-base transition-colors hover:bg-gray-50"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">예</span>
            <span className="text-xs text-gray-600">회원가입</span>
          </div>
        </button>

        {/* 아니오 버튼 (로그인) */}
        <button
          onClick={handleNo}
          className="flex-1 py-3 px-4 rounded-lg bg-black text-white font-medium text-base transition-opacity hover:opacity-90"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">아니오</span>
            <span className="text-xs text-gray-300">로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
}
