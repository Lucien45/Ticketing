export type UserRole = 'admin' | 'agent' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedToId: string | null;
  createdBy?: User;
  assignedTo?: User | null;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  ticketId: string;
  authorId: string;
  author?: User;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
