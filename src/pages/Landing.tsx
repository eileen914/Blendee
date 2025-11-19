import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 로고 애니메이션을 위한 약간의 딜레이
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/new-user");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div
        className={`flex flex-col items-center transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* 로고 이미지 */}
        <div className="mb-6">
          <img
            src="/images/logo.png"
            alt="BLENDEE"
            className="w-80 h-80 object-contain"
          />
        </div>

        {/* 시작하기 버튼 (자동으로 다음 화면으로 이동하거나 클릭 가능) */}
        <button
          onClick={handleGetStarted}
          className="bg-black text-white px-8 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
