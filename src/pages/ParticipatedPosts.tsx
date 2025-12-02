import React from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, Clock, Users } from "lucide-react";
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
    return `${year}년 ${month}월`;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 상단 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/mypage")}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <HomeIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            내가 참여한 게시물
          </h1>
          <span className="ml-auto text-sm text-gray-600">
            {participatedRooms.length}개
          </span>
        </div>

        {/* 게시물 목록 */}
        <div className="space-y-4">
          {participatedRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* 이미지 */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={room.targetImage}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(room.createdAt)} 참여
                  </p>
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
                    {room.title}에 참여하고 있어요
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.participants.length}명 참여중</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
