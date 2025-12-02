import React, { createContext, useContext, useState, useCallback } from 'react';
import { Room, Pixel, User } from '../types';
import { mockUsers } from '../utils/mockData';
import { extractColorsFromImage, assignRandomColors } from '../utils/colorExtractor';

interface RoomContextType {
  rooms: Room[];
  createRoom: (title: string, targetImage: string, isPublic: boolean, deadline: number) => Promise<Room>;
  updateRoom: (roomId: string, room: Partial<Room>) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const createRoom = useCallback(async (
    title: string,
    targetImage: string,
    isPublic: boolean,
    deadline: number
  ): Promise<Room> => {
    try {
      // 이미지를 8x8 그리드로 분할하여 각 영역의 대표 컬러 추출 (64개)
      const gridSize = 64; // 8x8
      const colors = await extractColorsFromImage(targetImage, gridSize);
      
      // 픽셀 생성 - 각 영역의 대표 컬러코드로 픽셀 생성
      const pixels: Pixel[] = colors.map((color, i) => ({
        id: i,
        colorCode: color, // 각 영역의 대표 컬러코드
        assignedTo: null, // 초기에는 할당되지 않음
        uploadedPhoto: null,
        uploadedAt: null
      }));

      // 새 방 생성
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        title,
        targetImage,
        isPublic,
        createdBy: 'currentUser',
        createdAt: new Date(),
        deadline: new Date(Date.now() + deadline * 86400000),
        pixels,
        participants: [mockUsers[4]], // currentUser
        colorAssignments: [
          {
            userId: 'currentUser',
            colorCodes: assignRandomColors(colors, 3, 5), // 사용자에게 랜덤하게 3-5개 컬러 할당
            deadline: new Date(Date.now() + deadline * 86400000)
          }
        ],
        isCompleted: false,
        gridSize: gridSize // 64 (8x8)
      };

      setRooms(prev => [newRoom, ...prev]);
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }, []);

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, createRoom, updateRoom }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within RoomProvider');
  }
  return context;
}

