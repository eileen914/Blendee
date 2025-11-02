import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Globe, Lock, Calendar, Loader2 } from 'lucide-react';
import { useRooms } from '../contexts/RoomContext';

export function CreateRoom() {
  const navigate = useNavigate();
  const { createRoom } = useRooms();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [deadline, setDeadline] = useState(3);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCreate = async () => {
    if (!title || !imagePreview) return;
    
    setIsCreating(true);
    try {
      const room = await createRoom(title, imagePreview, isPublic, deadline);
      alert('방이 생성되었습니다!');
      navigate(`/room/${room.id}`);
    } catch (error) {
      alert('방 생성에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            새 방 만들기
          </h1>
          <p className="text-gray-600">
            함께 완성할 사진을 선택하고 방을 만들어보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              방 제목
            </label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 여름 바다 추억 🌊" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
          </div>

          {/* Target Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 사진
            </label>
            {!imagePreview ? <label className="block">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    사진을 업로드하세요
                  </p>
                  <p className="text-xs text-gray-500">
                    이 사진이 픽셀로 나뉘어 참여자들에게 배정됩니다
                  </p>
                </div>
              </label> : <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Target" className="w-full h-64 object-cover" />
                <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm hover:bg-white transition-colors">
                  변경
                </button>
              </div>}
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              공개 설정
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsPublic(true)} className={`
                  p-4 rounded-lg border-2 transition-all flex items-center gap-3
                  ${isPublic ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                `}>
                <Globe className={`w-5 h-5 ${isPublic ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Public</div>
                  <div className="text-xs text-gray-500">누구나 참여 가능</div>
                </div>
              </button>
              <button onClick={() => setIsPublic(false)} className={`
                  p-4 rounded-lg border-2 transition-all flex items-center gap-3
                  ${!isPublic ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}
                `}>
                <Lock className={`w-5 h-5 ${!isPublic ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Private</div>
                  <div className="text-xs text-gray-500">초대된 사람만</div>
                </div>
              </button>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              완성 기한
            </label>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input type="number" value={deadline} onChange={e => setDeadline(Number(e.target.value))} min="1" max="30" className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <span className="text-gray-700">일 후</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              참여자들이 사진을 업로드할 수 있는 기간입니다
            </p>
          </div>

          {/* Create Button */}
          <button 
            onClick={handleCreate} 
            disabled={!title || !imagePreview || isCreating} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                방 생성 중...
              </>
            ) : (
              '방 만들기'
            )}
          </button>
        </div>
      </div>
    </div>;
}