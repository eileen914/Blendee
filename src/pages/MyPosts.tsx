import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, Users } from "lucide-react";
import { mockRooms } from "../utils/mockData";

export function MyPosts() {
  const navigate = useNavigate();

  // 내가 만든 게시물 (내가 생성한 방)
  const myCreatedRooms = mockRooms.filter(
    (room) => room.createdBy === "currentUser"
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const isDeadlineApproaching = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hoursLeft = diff / (1000 * 60 * 60);
    return hoursLeft < 24 && hoursLeft > 0;
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
            onClick={() => navigate("/mypage")}
            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <HomeIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 흰색 카드 컨테이너 */}
        <div className="bg-white rounded-t-3xl shadow-xl p-6 mb-6">
          {/* 제목 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">내 게시물</h1>
            <span className="text-sm text-gray-600">
              {myCreatedRooms.length}개
            </span>
          </div>

          {/* 게시물 목록 */}
          <div className="space-y-4">
            {myCreatedRooms.map((room) => {
              const deadlineApproaching = isDeadlineApproaching(room.deadline);
              return (
                <div
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className="bg-gray-50 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                        {formatDate(room.createdAt)} 게시
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
                          <span>
                            {room.participants.length}명 참여중
                            {deadlineApproaching && (
                              <span className="text-orange-600 font-medium ml-1">
                                마감 임박
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
