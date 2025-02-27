import { gql } from '@apollo/client';

export const LIST_CHAT_ROOM_USERS_WITH_DETAILS = gql`
  query ListChatRoomUsersWithDetails($filter: ModelChatRoomUserFilterInput) {
    listChatRoomUsers(filter: $filter) {
      items {
        id
        chatRoomId
        userId
        user {
          id
          name
          imageUri
          status
          lastOnlineAt
          phonenumber
          email
        }
      }
    }
  }
`;
export const listChatRoomUsersWithDetails = /* GraphQL */ `
  query ListChatRoomUsersWithDetails($filter: ModelChatRoomUserFilterInput) {
    listChatRoomUsers(filter: $filter) {
      items {
        id
        chatRoomId
        userId
        user {
          id
          name
          imageUri
          status
          lastOnlineAt
          phonenumber
          email
        }
      }
    }
  }
`;
