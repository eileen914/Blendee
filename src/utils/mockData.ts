import { Room, User, Pixel, ColorAssignment, FeedPost } from '../types';
export const mockUsers: User[] = [{
  id: 'user1',
  name: '김민준',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
}, {
  id: 'user2',
  name: '이서연',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2'
}, {
  id: 'user3',
  name: '박지호',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3'
}, {
  id: 'user4',
  name: '최유진',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4'
}, {
  id: 'currentUser',
  name: '나',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser'
}];
function generatePixels(count: number): Pixel[] {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788', '#FF8FA3', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'];
  return Array.from({
    length: count
  }, (_, i) => ({
    id: i,
    colorCode: colors[i % colors.length],
    assignedTo: i < 15 ? mockUsers[i % mockUsers.length].id : null,
    uploadedPhoto: i < 8 ? `https://picsum.photos/seed/${i}/400/400` : null,
    uploadedAt: i < 8 ? new Date(Date.now() - Math.random() * 86400000) : null
  }));
}
export const mockRooms: Room[] = [{
  id: 'room1',
  title: '여름 바다 추억 🌊',
  targetImage: 'https://picsum.photos/seed/beach/800/800',
  isPublic: true,
  createdBy: 'user1',
  createdAt: new Date('2024-01-15'),
  deadline: new Date(Date.now() + 2 * 86400000),
  // 2일 후
  pixels: generatePixels(49),
  participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[4]],
  colorAssignments: [{
    userId: 'currentUser',
    colorCodes: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    deadline: new Date(Date.now() + 2 * 86400000)
  }],
  isCompleted: false,
  gridSize: 49 // 기존 mock 데이터는 49로 유지
}, {
  id: 'room2',
  title: '우리들의 봄날 🌸',
  targetImage: 'https://picsum.photos/seed/spring/800/800',
  isPublic: false,
  createdBy: 'user2',
  createdAt: new Date('2024-01-10'),
  deadline: new Date(Date.now() + 5 * 86400000),
  pixels: generatePixels(49),
  participants: [mockUsers[1], mockUsers[2], mockUsers[4]],
  colorAssignments: [{
    userId: 'currentUser',
    colorCodes: ['#FFA07A', '#98D8C8'],
    deadline: new Date(Date.now() + 5 * 86400000)
  }],
  isCompleted: false,
  gridSize: 49 // 기존 mock 데이터는 49로 유지
}, {
  id: 'room3',
  title: '도시의 밤 🌃',
  targetImage: 'https://picsum.photos/seed/city/800/800',
  isPublic: true,
  createdBy: 'user3',
  createdAt: new Date('2024-01-01'),
  deadline: new Date('2024-01-20'),
  pixels: generatePixels(49).map(p => ({
    ...p,
    uploadedPhoto: `https://picsum.photos/seed/${p.id}/400/400`
  })),
  participants: [mockUsers[0], mockUsers[2], mockUsers[3], mockUsers[4]],
  colorAssignments: [],
  isCompleted: true,
  gridSize: 49 // 기존 mock 데이터는 49로 유지
}];
export const mockFeedPosts: FeedPost[] = [{
  id: 'post1',
  roomId: 'room3',
  image: 'https://picsum.photos/seed/city/800/800',
  title: '도시의 밤 🌃',
  postedBy: 'currentUser',
  postedAt: new Date('2024-01-20'),
  participants: [mockUsers[0], mockUsers[2], mockUsers[3], mockUsers[4]]
}];