import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { mockRooms } from "../utils/mockData";

export function MyPage() {
  const navigate = useNavigate();
  const userName = "오오옹오";

  // 내가 참여한 게시물 (참여 중인 방)
  const participatedRooms = mockRooms.filter((room) =>
    room.participants.some((p) => p.id === "currentUser")
  );

  // 내가 만든 게시물 (내가 생성한 방)
  const myCreatedRooms = mockRooms.filter(
    (room) => room.createdBy === "currentUser"
  );

  // 미리보기 이미지 (최대 3개)
  const getPreviewImages = (rooms: typeof mockRooms) => {
    return rooms.slice(0, 3).map((room) => room.targetImage);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
      }}
    >
      <div className="max-w-md mx-auto px-4 py-4">
        {/* 홈 아이콘 */}
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={() => navigate("/home")}
            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="homeGradientMyPage"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="50%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#fce7f3" />
                </linearGradient>
              </defs>
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="url(#homeGradientMyPage)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="url(#homeGradientMyPage)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 흰색 카드 컨테이너 */}
        <div className="bg-white rounded-t-3xl shadow-xl p-6 mb-6">
          {/* 제목 */}
          <div className="text-center mb-6">
            <div className="px-4 py-1 bg-white border border-gray-300 rounded-full inline-block">
              <span className="text-sm font-medium text-gray-600">
                내 프로필
              </span>
            </div>
          </div>

          {/* 프로필 섹션 */}
          <div className="flex flex-col items-center mb-8">
            {/* 프로필 사진 */}
            <div className="relative mb-4">
              <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center shadow-lg overflow-hidden relative">
                {/* 프로필 일러스트 */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full"
                  style={{ transform: "translateY(10px)" }}
                >
                  {/* 머리 */}
                  <circle cx="100" cy="80" r="35" fill="#d1d5db" />
                  {/* 눈 */}
                  <path
                    d="M 85 75 Q 90 70 95 75"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 105 75 Q 110 70 115 75"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* 몸 */}
                  <path
                    d="M 70 115 Q 70 105 80 105 L 120 105 Q 130 105 130 115 L 130 200 L 70 200 Z"
                    fill="#d1d5db"
                  />
                </svg>
              </div>
            </div>

            {/* 사용자명 */}
            <div className="px-6 py-2 bg-gray-100 rounded-full mb-3">
              <h2 className="text-base font-medium text-gray-700">
                {userName} 님
              </h2>
            </div>

            {/* 연동된 SNS 계정 확인 */}
            <button className="text-sm text-gray-400 hover:text-gray-600">
              연동된 SNS 계정 확인
            </button>
          </div>

          {/* 내가 참여한 게시물 섹션 */}
          <div className="mb-6">
            <div className="px-4 py-1 bg-white border border-gray-300 rounded-full mb-4 inline-block">
              <span className="text-sm font-medium text-gray-600">
                내가 참여한 게시물
              </span>
            </div>
            <div className="relative">
              <div
                onClick={() => navigate("/mypage/participated")}
                className="bg-gray-50 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-3 gap-3">
                  {getPreviewImages(participatedRooms).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-200"
                    >
                      <img
                        src={image}
                        alt={`참여한 게시물 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {participatedRooms.length < 3 &&
                    Array.from({
                      length: 3 - participatedRooms.length,
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square rounded-xl bg-gray-200"
                      />
                    ))}
                </div>
                {/* 화살표 */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-gray-400" />
                </div>
              </div>
              {/* + 버튼 */}
              <button
                onClick={() => navigate("/mypage/participated")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-10"
              >
                <Plus className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* 내 게시물 섹션 */}
          <div className="mb-4">
            <div className="px-4 py-1 bg-white border border-gray-300 rounded-full mb-4 inline-block">
              <span className="text-sm font-medium text-gray-600">
                내 게시물
              </span>
            </div>
            <div className="relative">
              <div
                onClick={() => navigate("/mypage/my-posts")}
                className="bg-gray-50 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-3 gap-3">
                  {getPreviewImages(myCreatedRooms).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-200"
                    >
                      <img
                        src={image}
                        alt={`내 게시물 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {myCreatedRooms.length < 3 &&
                    Array.from({ length: 3 - myCreatedRooms.length }).map(
                      (_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square rounded-xl bg-gray-200"
                        />
                      )
                    )}
                </div>
                {/* 화살표 */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-gray-400" />
                </div>
              </div>
              {/* + 버튼 */}
              <button
                onClick={() => navigate("/mypage/my-posts")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-10"
              >
                <Plus className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
