import React from 'react';
import { Room } from '../types';
import { Users, Lock, Globe, Calendar } from 'lucide-react';
interface RoomCardProps {
  room: Room;
  onClick: () => void;
}
export function RoomCard({
  room,
  onClick
}: RoomCardProps) {
  const completedPixels = room.pixels.filter(p => p.uploadedPhoto).length;
  const progress = completedPixels / room.pixels.length * 100;
  const daysLeft = Math.ceil((room.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return <div onClick={onClick} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100">
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        <img src={room.targetImage} alt={room.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute top-3 right-3">
          {room.isPublic ? <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs">
              <Globe className="w-3 h-3 text-blue-600" />
              <span className="text-gray-700">Public</span>
            </div> : <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs">
              <Lock className="w-3 h-3 text-purple-600" />
              <span className="text-gray-700">Private</span>
            </div>}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {room.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{room.participants.length}명</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft > 0 ? `${daysLeft}일 남음` : '마감'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">진행률</span>
            <span className="font-medium text-gray-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all" style={{
            width: `${progress}%`
          }} />
          </div>
        </div>

        {room.isCompleted && <div className="mt-3 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-lg text-center">
            ✓ 완성됨
          </div>}
      </div>
    </div>;
}