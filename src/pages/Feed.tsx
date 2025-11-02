import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { mockFeedPosts, mockRooms } from '../utils/mockData';
export function Feed() {
  const navigate = useNavigate();
  const completedRooms = mockRooms.filter(r => r.isCompleted);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 피드</h1>
          <p className="text-gray-600">완성된 협업 사진들을 확인하세요</p>
        </div>

        {/* Feed Posts */}
        {mockFeedPosts.length === 0 && completedRooms.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-gray-400 mb-2 text-4xl">📸</div>
            <p className="text-gray-600 mb-4">아직 완성된 사진이 없어요</p>
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">
              방 둘러보기 →
            </button>
          </div> : <div className="space-y-6">
            {/* Completed Rooms */}
            {completedRooms.map(room => <div key={room.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3">
                  <img src={room.participants[0].avatar} alt={room.participants[0].name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {room.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {room.participants.length}명이 함께 완성
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative">
                  <img src={room.targetImage} alt={room.title} className="w-full aspect-square object-cover" />
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-6 h-6" />
                      <span className="text-sm font-medium">좋아요</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm font-medium">댓글</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors ml-auto">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 5).map(participant => <img key={participant.id} src={participant.avatar} alt={participant.name} className="w-6 h-6 rounded-full border-2 border-white" />)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {room.participants.map(p => p.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>)}

            {/* Existing Feed Posts */}
            {mockFeedPosts.map(post => <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <img src={post.participants[0].avatar} alt={post.participants[0].name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.participants.length}명이 함께 완성
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img src={post.image} alt={post.title} className="w-full aspect-square object-cover" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-6 h-6" />
                      <span className="text-sm font-medium">좋아요</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm font-medium">댓글</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors ml-auto">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {post.participants.slice(0, 5).map(participant => <img key={participant.id} src={participant.avatar} alt={participant.name} className="w-6 h-6 rounded-full border-2 border-white" />)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {post.participants.map(p => p.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}