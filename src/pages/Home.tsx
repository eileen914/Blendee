import React, { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dragStart, setDragStart] = useState<{ y: number } | null>(null);
  const [favoriteRooms, setFavoriteRooms] = useState<Set<string>>(new Set());

  // 관심 등록 토글
  const toggleFavorite = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  // 관심 등록된 방과 일반 방 분리 및 정렬
  const sortedRooms = [...myRooms].sort((a, b) => {
    const aIsFavorite = favoriteRooms.has(a.id);
    const bIsFavorite = favoriteRooms.has(b.id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

  // 사용자 통계 계산
  const getUserStats = () => {
    let uploadedColors = 0;
    let completedPhotos = 0;
    let uploadedPosts = 0;

    myRooms.forEach((room) => {
      const myAssignment = room.colorAssignments.find(
        (a) => a.userId === "currentUser"
      );
      if (myAssignment) {
        // 업로드한 컬러 수
        const uploaded = room.pixels.filter(
          (p) =>
            p.uploadedPhoto && myAssignment.colorCodes.includes(p.colorCode)
        ).length;
        uploadedColors += uploaded;
      }

      // 완성한 사진 수
      if (room.isCompleted) {
        completedPhotos++;
      }

      // 업로드한 게시물 수 (완성된 방 중 내가 참여한 것)
      if (
        room.isCompleted &&
        room.participants.some((p) => p.id === "currentUser")
      ) {
        uploadedPosts++;
      }
    });

    return {
      uploadedColors,
      completedPhotos,
      uploadedPosts,
    };
  };

  const stats = getUserStats();

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart({ y: touch.clientY });
  };

  // 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart) return;
    const touch = e.touches[0];
    const deltaY = dragStart.y - touch.clientY; // 위로 드래그하면 양수
    const deltaYDown = touch.clientY - dragStart.y; // 아래로 드래그하면 양수

    if (isMenuOpen) {
      // 메뉴가 열려있을 때는 아래로 50px 이상 드래그하면 닫기
      if (deltaYDown > 50) {
        setIsMenuOpen(false);
        setDragStart(null);
      }
    } else {
      // 메뉴가 닫혀있을 때는 위로 50px 이상 드래그하면 열기
      if (deltaY > 50) {
        setIsMenuOpen(true);
        setDragStart(null);
      }
    }
  };

  // 터치 종료
  const handleTouchEnd = () => {
    setDragStart(null);
  };

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

          {/* 메뉴 영역 */}
          <div className="w-full relative">
            {/* 진행상황 확인하기 버튼 */}
            <button
              onClick={() => setIsMenuOpen(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-3 px-6 rounded-lg font-medium shadow-sm hover:bg-white transition-colors flex items-center gap-3 cursor-grab active:cursor-grabbing"
            >
              <Menu className="w-5 h-5" />
              <span>진행상황 확인하기</span>
            </button>

            {/* 통계 카드 (버튼 위치에서 확장) */}
            {isMenuOpen && (
              <>
                {/* 배경 오버레이 (모달 밖 클릭 감지용) */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                {/* 통계 카드 */}
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl z-50 animate-slide-up"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 통계 내용 */}
                  <div className="space-y-4">
                    <div className="text-sm text-gray-700">
                      내가 업로드한 컬러 수:{" "}
                      <span className="font-semibold text-gray-900">
                        {stats.uploadedColors}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      내가 완성한 사진 수:{" "}
                      <span className="font-semibold text-gray-900">
                        {stats.completedPhotos}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      내가 업로드한 게시물 수:{" "}
                      <span className="font-semibold text-gray-900">
                        {stats.uploadedPosts}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
            sortedRooms.map((room) => {
              const remainingPieces = getRemainingPieces(room);
              const requiredColors = getRequiredColors(room);
              const timeLeft = getTimeLeft(room.deadline);
              const isFavorite = favoriteRooms.has(room.id);

              // 더미 컬러 추가 (필요한 컬러가 부족할 때)
              const dummyColors = ["#8B4513", "#F5DEB3", "#FFB6C1"]; // 갈색, 베이지, 핑크
              const displayColors = [
                ...requiredColors,
                ...dummyColors.slice(0, Math.max(0, 3 - requiredColors.length)),
              ].slice(0, 3);

              return (
                <div
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${
                    !room.isPublic ? "border-4 border-purple-400" : ""
                  }`}
                >
                  {/* 제목 영역 */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={(e) => toggleFavorite(room.id, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          isFavorite
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {room.title}
                    </h3>
                  </div>

                  {/* 이미지와 정보 */}
                  <div className="flex gap-4">
                    {/* 왼쪽: 이미지 영역 */}
                    <div className="flex flex-col">
                      <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden mb-2">
                        <img
                          src={room.targetImage}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 참여자 수 (이미지 아래) */}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{room.participants.length}명 참여중</span>
                      </div>
                    </div>

                    {/* 오른쪽: 정보 영역 */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">
                        남은 조각 수: {remainingPieces}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-700">
                          필요한 컬러:
                        </span>
                        <div className="flex gap-1.5 items-center">
                          {displayColors.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // 더 많은 컬러 보기 기능 (추후 구현)
                            }}
                            className="w-6 h-6 rounded border border-gray-300 bg-gray-100 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}</span>
                      </div>
                      {/* 설명 텍스트 */}
                      <p className="text-sm text-gray-600">
                        {room.title}을 같이 만들어봐요
                      </p>
                    </div>
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
