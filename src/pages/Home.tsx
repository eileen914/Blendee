import React from "react";
import { useNavigate } from "react-router-dom";
import { mockRooms } from "../utils/mockData";
import { Home as HomeIcon, Menu, Star, Clock, Users } from "lucide-react";
import { useRooms } from "../contexts/RoomContext";

export function Home() {
  const navigate = useNavigate();
  const { rooms: userRooms } = useRooms();
  const allRooms = [...userRooms, ...mockRooms];
  const myRooms = allRooms.filter((room) =>
    room.participants.some((p) => p.id === "currentUser")
  );

  // 날짜 계산
  const daysSinceStart = 27;

  // 남은 시간 계산 헬퍼 함수
  const getTimeLeft = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return "마감";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // 남은 조각 수 계산
  const getRemainingPieces = (room: (typeof myRooms)[number]) => {
    return room.pixels.filter((p) => !p.uploadedPhoto).length;
  };

  // 필요한 컬러 추출 (현재 사용자가 담당한 컬러 중 아직 업로드 안 된 것)
  const getRequiredColors = (room: (typeof myRooms)[number]) => {
    const myAssignment = room.colorAssignments.find(
      (a) => a.userId === "currentUser"
    );
    if (!myAssignment) return [];

    const uploadedColors = new Set(
      room.pixels
        .filter(
          (p) =>
            p.uploadedPhoto && myAssignment.colorCodes.includes(p.colorCode)
        )
        .map((p) => p.colorCode)
    );

    return myAssignment.colorCodes.filter(
      (color) => !uploadedColors.has(color)
    );
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            BLEND<span className="lowercase">ee</span>
          </h1>
          <span className="text-sm text-gray-700 font-medium">
            {daysSinceStart} 일째
          </span>
        </div>

        {/* 중앙 헤더 영역 */}
        <div className="flex flex-col items-center mb-6">
          {/* 집 아이콘 */}
          <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm">
            <HomeIcon className="w-8 h-8 text-gray-700" />
          </div>

          {/* Be Our BLENDee! 텍스트 */}
          <div
            className="text-center mb-4"
            style={{ transform: "rotate(-2deg)" }}
          >
            <p
              className="text-3xl font-bold text-white mb-1"
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
              className="text-4xl font-bold text-white"
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

          {/* 메뉴 아이콘 */}
          <div className="mb-4">
            <Menu className="w-6 h-6 text-gray-700" />
          </div>

          {/* 진행상황 확인하기 버튼 */}
          <button
            onClick={() => {
              // 진행상황 확인 기능 (추후 구현)
              console.log("진행상황 확인");
            }}
            className="w-full max-w-xs bg-white/90 backdrop-blur-sm text-gray-900 py-3 px-6 rounded-lg font-medium shadow-sm hover:bg-white transition-colors"
          >
            진행상황 확인하기
          </button>
        </div>

        {/* 참여 중인 방 카드들 (모달 형태) */}
        <div className="space-y-4">
          {myRooms.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
              <div className="text-gray-400 mb-2 text-4xl">📸</div>
              <p className="text-gray-600 mb-4">아직 참여 중인 방이 없어요</p>
              <button
                onClick={() => navigate("/create-room")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                첫 방 만들기 →
              </button>
            </div>
          ) : (
            myRooms.map((room) => {
              const remainingPieces = getRemainingPieces(room);
              const requiredColors = getRequiredColors(room);
              const timeLeft = getTimeLeft(room.deadline);

              return (
                <div
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                >
                  {/* 제목 영역 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {room.title}
                    </h3>
                  </div>

                  {/* 이미지와 정보 */}
                  <div className="flex gap-4 mb-3">
                    {/* 이미지 */}
                    <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img
                        src={room.targetImage}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 정보 */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">
                        남은 조각 수: {remainingPieces}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-700">
                          필요한 컬러:
                        </span>
                        <div className="flex gap-1">
                          {requiredColors.slice(0, 3).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {requiredColors.length > 3 && (
                            <span className="text-xs text-gray-500">+</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  {/* 설명 텍스트 */}
                  <p className="text-sm text-gray-600 mb-3">
                    {room.title}을 같이 만들어봐요
                  </p>

                  {/* 참여자 수 */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{room.participants.length}명 참여중</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
