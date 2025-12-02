import { useNavigate, useParams } from "react-router-dom";
import { Home as HomeIcon, Star, Clock, Users, Plus, Download, Share2 } from "lucide-react";
import { mockRooms } from "../utils/mockData";
import { useRooms } from "../contexts/RoomContext";

export function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms: userRooms } = useRooms();
  const allRooms = [...userRooms, ...mockRooms];
  const room = allRooms.find((r) => r.id === id);

  if (!room) {
    return <div>Room not found</div>;
  }

  // 남은 조각 수 계산
  const remainingPixels = room.pixels.filter((p) => !p.uploadedPhoto).length;

  // 남은 시간 계산
  const timeLeft = room.deadline.getTime() - Date.now();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  // 해시태그 (더미 데이터)
  const hashtags = ["#강아지", "#푸들", "#말티즈", "#귀여워", "#개"];

  // 설명 텍스트
  const description = `큐티한 우리집 강아지를 같이 만들어봐요\n우리집 강아지는 무지 귀여워요 함께해요`;

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
            onClick={() => navigate("/home")}
            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <HomeIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 흰색 카드 컨테이너 */}
        <div className="bg-white rounded-t-3xl shadow-xl">
          {/* 상단 헤더 */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-gray-400" />
              <h1 className="text-xl font-bold text-gray-900 flex-1">
                {room.title}
              </h1>
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

            {/* 이미지 */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4">
              <img
                src={room.targetImage}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 남은 조각 수와 시간 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-700">
                남은 조각 수: {remainingPixels}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>
                  {hoursLeft}h {minutesLeft}m
                </span>
              </div>
            </div>

            {/* 참여 완료 버튼 */}
            <div className="bg-purple-100 rounded-2xl p-4 mb-4 text-center">
              <div className="text-sm font-medium text-gray-700 mb-3">
                참여 완료!
              </div>
              <button className="bg-white border border-orange-300 rounded-full px-6 py-2">
                <span className="text-sm text-gray-700">
                  한번 더 참여하시겠어요?
                </span>
              </button>
            </div>

            {/* 설명 텍스트 */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* 해시태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-blue-600 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 참여자 정보 */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-700">
                {room.participants.length}명 참여중
              </span>
              <div className="flex -space-x-2">
                {room.participants.slice(0, 3).map((participant) => (
                  <img
                    key={participant.id}
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 하단 버튼들 */}
            <div className="flex gap-3 pb-6">
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-300 transition-colors">
                사진 저장하기
              </button>
              <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                게시물 공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
