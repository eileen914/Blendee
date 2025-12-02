import React, { createContext, useContext, useState, useCallback } from 'react';
import { Room, Pixel, User } from '../types';
import { mockUsers } from '../utils/mockData';
import { extractColorsFromImage, assignRandomColors } from '../utils/colorExtractor';

interface RoomContextType {
  rooms: Room[];
  createRoom: (title: string, targetImage: string, isPublic: boolean, deadline: number, gridSize: number) => Promise<Room>;
  updateRoom: (roomId: string, room: Partial<Room>) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const createRoom = useCallback(async (
    title: string,
    targetImage: string,
    isPublic: boolean,
    deadline: number,
    gridSize: number = 64 // 기본값 64 (8x8)
  ): Promise<Room> => {
    try {
      // 이미지를 그리드로 분할하여 각 영역의 대표 컬러 추출
      const colors = await extractColorsFromImage(targetImage, gridSize);
      
      // 사용자에게 할당할 컬러코드 선택
      const assignedColorCodes = assignRandomColors(colors, 3, 5);
      
      // 픽셀 생성 - 각 영역의 대표 컬러코드로 픽셀 생성
      const pixels: Pixel[] = colors.map((color, i) => {
        // 할당된 컬러코드에 해당하는 픽셀은 currentUser에게 할당
        const isAssigned = assignedColorCodes.includes(color);
        return {
          id: i,
          colorCode: color, // 각 영역의 대표 컬러코드
          assignedTo: isAssigned ? 'currentUser' : null,
          uploadedPhoto: null,
          uploadedAt: null
        };
      });

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
            colorCodes: assignedColorCodes, // 할당된 컬러코드
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

