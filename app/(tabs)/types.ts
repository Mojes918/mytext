interface ChatRoomUser {
  chatRoomId: string;
  userId: string;
}

interface ListChatRoomUsersResponse {
  listChatRoomUsers: {
    items: ChatRoomUser[];
    nextToken: string | null;
  };
}

export interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
  imagepath: string | null;
}

export interface Message {
  content: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  newMessages: number;
  lastMessage: Message | null;
  users: User[];
}