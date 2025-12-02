import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockRooms } from "../utils/mockData";
import {
  Home as HomeIcon,
  Menu,
  Star,
  Clock,
  Users,
  Image as ImageIcon,
  X,
} from "lucide-react";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDragStart, setCreateDragStart] = useState<{ y: number } | null>(
    null
  );
  const [panelOffset, setPanelOffset] = useState(0);

  // 새 게시물 생성 폼 상태
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [selectedPieces, setSelectedPieces] = useState(64);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [newRoomIsPublic, setNewRoomIsPublic] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

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

  // 새 게시물 생성 드래그 핸들러
  const handleCreateTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setCreateDragStart({ y: touch.clientY });
  };

  const handleCreateTouchMove = (e: React.TouchEvent) => {
    if (!createDragStart) return;
    const touch = e.touches[0];
    const deltaY = createDragStart.y - touch.clientY; // 위로 드래그하면 양수
    const deltaYDown = touch.clientY - createDragStart.y; // 아래로 드래그하면 양수

    if (isCreateModalOpen) {
      // 패널이 열려있을 때는 아래로 100px 이상 드래그하면 닫기
      if (deltaYDown > 100) {
        setIsCreateModalOpen(false);
        setPanelOffset(0);
        setCreateDragStart(null);
      }
    } else {
      // 패널이 닫혀있을 때는 위로 50px 이상 드래그하면 열기
      if (deltaY > 50) {
        setIsCreateModalOpen(true);
        setPanelOffset(0);
        setCreateDragStart(null);
      }
    }
  };

  const handleCreateTouchEnd = () => {
    setCreateDragStart(null);
    // 패널이 열려있고 offset이 있으면 자동으로 정렬
    if (isCreateModalOpen) {
      if (panelOffset > 50) {
        // 충분히 올라왔으면 최대 높이로
        setPanelOffset(0);
      } else if (panelOffset < -50) {
        // 충분히 내려갔으면 닫기
        setIsCreateModalOpen(false);
        setPanelOffset(0);
      } else {
        // 중간이면 원래 위치로
        setPanelOffset(0);
      }
    }
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
          <button
            onClick={() => navigate("/mypage")}
            className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <HomeIcon className="w-8 h-8 text-gray-700" />
          </button>

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

      {/* 하단 고정 패널 및 + 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto relative">
          {/* 흰색 패널 */}
          <div
            className="bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ease-out"
            style={{
              transform: isCreateModalOpen
                ? `translateY(0px)`
                : "translateY(32px)", // 기본 상태: 아이콘 절반 높이(32px)만큼 올라옴
              paddingBottom: isCreateModalOpen ? "24px" : "80px",
              minHeight: isCreateModalOpen ? "auto" : "40px", // 기본 상태에서 최소 높이
            }}
          >
            {/* 새 게시물 생성 폼 (드래그로 올라오는 부분) */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isCreateModalOpen
                  ? "max-h-[80vh] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* 드래그 핸들 영역 (상단) */}
              <div
                className="h-12 flex items-center justify-center cursor-grab active:cursor-grabbing"
                onTouchStart={handleCreateTouchStart}
                onTouchMove={handleCreateTouchMove}
                onTouchEnd={handleCreateTouchEnd}
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div
                className="p-6 overflow-y-auto"
                style={{ maxHeight: "calc(80vh - 80px - 48px)" }}
              >
                {/* 닫기 버튼 */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setPanelOffset(0);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* 제목 입력 */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    placeholder="게시물 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                {/* 사진 업로드 */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    사진을 업로드하세요
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedImage(file);
                        }
                      }}
                      className="hidden"
                    />
                    <div
                      className={`w-full py-8 px-4 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                        uploadedImage
                          ? "border-purple-400 bg-purple-50"
                          : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon
                          className={`w-8 h-8 mb-2 ${
                            uploadedImage ? "text-purple-600" : "text-gray-400"
                          }`}
                        />
                        {uploadedImage ? (
                          <span className="text-sm font-medium text-purple-600">
                            {uploadedImage.name}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">
                            클릭하여 사진 선택
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* 조각 수 선택 */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    조각 수를 선택하세요
                  </p>
                  <div className="flex gap-3">
                    {[16, 64, 128].map((pieces) => (
                      <button
                        key={pieces}
                        onClick={() => setSelectedPieces(pieces)}
                        className={`flex-1 py-3 px-4 rounded-full border-2 transition-all ${
                          selectedPieces === pieces
                            ? "border-purple-400 bg-purple-50 text-purple-600 font-semibold"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {pieces}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제한 시간 설정 */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    제한 시간을 입력하세요
                  </p>
                  <button
                    onClick={() => setHasTimeLimit(!hasTimeLimit)}
                    className={`w-full py-3 px-4 rounded-lg border-2 transition-all ${
                      !hasTimeLimit
                        ? "border-purple-400 bg-purple-50 text-purple-600 font-semibold"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    설정하지 않음
                  </button>
                </div>

                {/* 참여 방식 선택 */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    참여 방식을 선택하세요
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewRoomIsPublic(true)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        newRoomIsPublic
                          ? "border-purple-400 bg-purple-50 text-purple-600 font-semibold"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Public
                    </button>
                    <button
                      onClick={() => setNewRoomIsPublic(false)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        !newRoomIsPublic
                          ? "border-purple-400 bg-purple-50 text-purple-600 font-semibold"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                {/* 생성 버튼 */}
                <button
                  onClick={() => {
                    // 게시물 생성 로직 (추후 구현)
                    console.log("게시물 생성", {
                      title: newRoomTitle,
                      pieces: selectedPieces,
                      isPublic: newRoomIsPublic,
                      imageSource,
                    });
                    setIsCreateModalOpen(false);
                    setPanelOffset(0);
                    // 폼 초기화
                    setNewRoomTitle("");
                    setSelectedPieces(64);
                    setHasTimeLimit(false);
                    setNewRoomIsPublic(true);
                    setImageSource(null);
                  }}
                  disabled={!newRoomTitle || !imageSource}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  게시물 생성하기
                </button>
              </div>
            </div>
        </div>

          {/* + 버튼 (패널 위에 겹쳐서 배치) */}
          <div
            className="absolute bottom-0 left-1/2 z-40 pointer-events-auto"
            style={{
              transform: isCreateModalOpen
                ? `translate(-50%, calc(-80vh + 100px))` // 모달이 열릴 때 패널 상단 근처로 올라감
                : "translate(-50%, 0px)", // 기본 상태: 전체가 보임
              transition: "transform 0.3s ease-out",
            }}
          >
            <button
              onClick={() => {
                if (!isCreateModalOpen) {
                  setIsCreateModalOpen(true);
                }
              }}
              onTouchStart={handleCreateTouchStart}
              onTouchMove={handleCreateTouchMove}
              onTouchEnd={handleCreateTouchEnd}
              className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-visible"
            >
              {/* 무지개 그라데이션 테두리 효과 */}
              <div className="absolute inset-0 rounded-full p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-orange-300 via-pink-300 to-blue-300"></div>
                <div className="absolute inset-0.5 rounded-full bg-white"></div>
              </div>
              {/* + 아이콘 (파스텔 톤 단색) */}
              <svg
                className="w-10 h-10 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                  stroke="#a5b4fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="#a5b4fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
