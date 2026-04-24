export interface UserProfile {
  id: string;
  name: string;
  role: 'donor' | 'recipient';
  joinedAt: any;
  bio?: string;
  avatarUrl?: string;
  location?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  authorId: string;
  pixKey: string;
  targetAmount?: number;
  raisedAmount: number;
  status: 'active' | 'completed' | 'reported';
  category?: 'health' | 'education' | 'food' | 'housing' | 'lgbt' | 'emergency' | 'others';
  createdAt: any;
  updatedAt: any;
  images?: string[];
  authorName?: string;
}

export interface Donation {
  id: string;
  storyId: string;
  donorId: string;
  donorName: string;
  amount: number;
  message?: string;
  timestamp: any;
  isPublic: boolean;
}
