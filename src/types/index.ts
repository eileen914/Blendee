export interface User {
  id: string;
  name: string;
  avatar: string;
}
export interface Pixel {
  id: number;
  colorCode: string;
  assignedTo: string | null;
  uploadedPhoto: string | null;
  uploadedAt: Date | null;
}
export interface ColorAssignment {
  userId: string;
  colorCodes: string[];
  deadline: Date;
}
export interface Room {
  id: string;
  title: string;
  targetImage: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  deadline: Date;
  pixels: Pixel[];
  participants: User[];
  colorAssignments: ColorAssignment[];
  isCompleted: boolean;
  gridSize: number; // 예: 50 (7x7 또는 5x10 등)
}
export interface FeedPost {
  id: string;
  roomId: string;
  image: string;
  title: string;
  postedBy: string;
  postedAt: Date;
  participants: User[];
}