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
        }
      }
    }
  }
`;
