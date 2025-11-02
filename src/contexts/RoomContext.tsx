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
      // 이미지에서 색상 추출 (16x16 = 256개)
      const colors = await extractColorsFromImage(targetImage, 256);
      
      // 픽셀 생성
      const pixels: Pixel[] = colors.map((color, i) => ({
        id: i,
        colorCode: color,
        assignedTo: null,
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
            colorCodes: assignRandomColors(colors, 3, 5),
            deadline: new Date(Date.now() + deadline * 86400000)
          }
        ],
        isCompleted: false,
        gridSize: 256
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

