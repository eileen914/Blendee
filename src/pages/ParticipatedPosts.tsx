import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { mockRooms } from "../utils/mockData";

export function ParticipatedPosts() {
  const navigate = useNavigate();

  // 내가 참여한 게시물 (참여 중인 방)
  const participatedRooms = mockRooms.filter((room) =>
    room.participants.some((p) => p.id === "currentUser")
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월 참여`;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
      }}
    >
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* 홈 아이콘 */}
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={() => navigate("/mypage")}
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
                  id="homeGradientParticipated"
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
                stroke="url(#homeGradientParticipated)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="url(#homeGradientParticipated)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 흰색 카드 컨테이너 */}
        <div
          className="bg-white rounded-t-3xl shadow-xl p-6 pb-8"
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          {/* 제목 */}
          <div className="mb-4 text-center">
            <div className="px-4 py-1 bg-white border border-gray-300 rounded-full mb-1 inline-block">
              <span className="text-sm font-medium text-gray-600">
                내가 참여한 게시물
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {participatedRooms.length}개
            </div>
          </div>

          {/* 게시물 목록 */}
          <div className="space-y-4">
            {participatedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* 이미지 */}
                <div className="w-full aspect-video bg-gray-200">
                  <img
                    src={room.targetImage}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {room.title}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {formatDate(room.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        room.isPublic
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {room.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    우리집 강아지 귀여워...
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{room.participants.length}명 참여중</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
