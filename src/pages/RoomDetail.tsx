import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Users, Calendar, Share2 } from "lucide-react";
import { PixelGrid } from "../components/PixelGrid";
import { ColorAssignment } from "../components/ColorAssignment";
import { PhotoUpload } from "../components/PhotoUpload";
import { mockRooms } from "../utils/mockData";
import { Pixel, Room } from "../types";
import { useRooms } from "../contexts/RoomContext";

export function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms: userRooms, updateRoom } = useRooms();
  const allRooms = [...userRooms, ...mockRooms];
  const originalRoom = allRooms.find((r) => r.id === id);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Map<number, string>>(
    new Map()
  );

  // 로컬 상태와 원본 데이터를 합쳐서 새로운 room 객체 생성
  const room: Room | undefined = useMemo(() => {
    if (!originalRoom) return undefined;
    return {
      ...originalRoom,
      pixels: originalRoom.pixels.map((pixel) => ({
        ...pixel,
        uploadedPhoto: uploadedPhotos.get(pixel.id) || pixel.uploadedPhoto,
      })),
    };
  }, [originalRoom, uploadedPhotos]);

  if (!room) {
    return <div>Room not found</div>;
  }

  const myAssignment = room.colorAssignments.find(
    (a) => a.userId === "currentUser"
  );
  // 업로드된 컬러코드들을 unique하게 추출
  const completedColors = Array.from(
    new Set(
      room.pixels
        .filter(
          (p) =>
            p.uploadedPhoto && myAssignment?.colorCodes.includes(p.colorCode)
        )
        .map((p) => p.colorCode)
    )
  );

  const handleColorClick = (colorCode: string) => {
    // 해당 컬러코드의 아직 업로드되지 않은 첫 번째 픽셀 찾기
    const availablePixel = room.pixels.find(
      (p) => p.colorCode === colorCode && !p.uploadedPhoto
    );
    if (availablePixel) {
      setSelectedPixel(availablePixel);
      setShowUpload(true);
    }
  };

  const handlePixelClick = (pixel: Pixel) => {
    if (pixel.assignedTo === "currentUser" && !pixel.uploadedPhoto) {
      setSelectedPixel(pixel);
      setShowUpload(true);
    }
  };

  const handleUpload = async (file: File) => {
    if (!selectedPixel || !originalRoom) return;

    // 파일을 base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;

      // 같은 컬러코드를 가진 모든 픽셀에 업로드된 사진 저장
      const colorCode = selectedPixel.colorCode;
      const updatedMap = new Map(uploadedPhotos);

      room.pixels.forEach((pixel) => {
        if (pixel.colorCode === colorCode && !pixel.uploadedPhoto) {
          updatedMap.set(pixel.id, base64Image);
        }
      });

      setUploadedPhotos(updatedMap);

      // 완료 알림
      alert("사진이 업로드되었습니다!");

      // 모든 픽셀이 완성되었는지 확인
      const updatedPixels = room.pixels.map((p) => {
        const uploadedPhoto = updatedMap.get(p.id);
        return uploadedPhoto ? { ...p, uploadedPhoto } : p;
      });
      const allCompleted = updatedPixels.every((p) => p.uploadedPhoto);

      if (allCompleted) {
        alert("축하합니다! 모든 픽셀이 완성되었습니다! 🎉");
      }

      // Context에도 업데이트 (사용자가 만든 방인 경우)
      if (userRooms.find((r) => r.id === originalRoom.id)) {
        updateRoom(originalRoom.id, {
          pixels: updatedPixels,
          isCompleted: allCompleted,
        });
      }
    };
    reader.readAsDataURL(file);

    setShowUpload(false);
    setSelectedPixel(null);
  };

  const daysLeft = Math.ceil(
    (room.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const progress =
    (room.pixels.filter((p) => p.uploadedPhoto).length / room.pixels.length) *
    100;

  // 전체 완성 여부 확인
  const isCompleted = room.pixels.every((p) => p.uploadedPhoto);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {room.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.participants.length}명 참여</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{daysLeft > 0 ? `${daysLeft}일 남음` : "마감"}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">전체 진행률</span>
                <span className="font-medium text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pixel Grid */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                픽셀 그리드
              </h2>
              <p className="text-sm text-gray-600">
                파란 테두리는 내가 담당한 픽셀입니다
              </p>
            </div>
            <PixelGrid
              pixels={room.pixels}
              currentUserId="currentUser"
              onPixelClick={handlePixelClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Assignment */}
            {myAssignment && (
              <ColorAssignment
                assignment={myAssignment}
                completedColors={completedColors}
                onColorClick={handleColorClick}
              />
            )}

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">참여자</h3>
              <div className="space-y-3">
                {room.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {participant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {participant.id === "currentUser" ? "나" : "참여자"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Button */}
            {myAssignment &&
              completedColors.length < myAssignment.colorCodes.length && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  사진 업로드하기
                </button>
              )}

            {isCompleted && (
              <button
                onClick={() => {
                  alert("피드에 게시되었습니다!");
                  navigate("/feed");
                }}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                피드에 게시하기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && selectedPixel && (
        <PhotoUpload
          colorCode={selectedPixel.colorCode}
          onUpload={handleUpload}
          onCancel={() => {
            setShowUpload(false);
            setSelectedPixel(null);
          }}
        />
      )}
    </div>
  );
}
