import React from "react";
import { useNavigate } from "react-router-dom";
import { RoomCard } from "../components/RoomCard";
import { mockRooms } from "../utils/mockData";
import { Plus, Grid3x3, User } from "lucide-react";
import { useRooms } from "../contexts/RoomContext";

export function Home() {
  const navigate = useNavigate();
  const { rooms: userRooms } = useRooms();
  const allRooms = [...userRooms, ...mockRooms]; // 사용자가 만든 방 + 기존 mock 데이터
  const myRooms = allRooms.filter((room) =>
    room.participants.some((p) => p.id === "currentUser")
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Blendee</h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/feed")}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <Grid3x3 className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                <User className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
          <p className="text-gray-600">함께 만들어가는 사진 모자이크</p>
        </div>

        {/* Create Room Button */}
        <button
          onClick={() => navigate("/create-room")}
          className="w-full mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg font-semibold">새 방 만들기</span>
        </button>

        {/* My Rooms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            참여 중인 방 ({myRooms.length})
          </h2>
          {myRooms.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-gray-400 mb-2">📸</div>
              <p className="text-gray-600 mb-4">아직 참여 중인 방이 없어요</p>
              <button
                onClick={() => navigate("/create-room")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                첫 방 만들기 →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/room/${room.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Public Rooms */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            공개 방 둘러보기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRooms
              .filter((room) => room.isPublic)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/room/${room.id}`)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
