/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
      id
      content
      image
      audio
      userID
      chatroomID
      status
      replyToMessageId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
      id
      content
      image
      audio
      userID
      chatroomID
      status
      replyToMessageId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
    onDeleteMessage(filter: $filter) {
      id
      content
      image
      audio
      userID
      chatroomID
      status
      replyToMessageId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateChatRoom = /* GraphQL */ `
  subscription OnCreateChatRoom($filter: ModelSubscriptionChatRoomFilterInput) {
    onCreateChatRoom(filter: $filter) {
      id
      newMessages
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        createdAt
        updatedAt
        __typename
      }
      Messages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      chatRoomLastMessageId
      __typename
    }
  }
`;
export const onUpdateChatRoom = /* GraphQL */ `
  subscription OnUpdateChatRoom($filter: ModelSubscriptionChatRoomFilterInput) {
    onUpdateChatRoom(filter: $filter) {
      id
      newMessages
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        createdAt
        updatedAt
        __typename
      }
      Messages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      chatRoomLastMessageId
      __typename
    }
  }
`;
export const onDeleteChatRoom = /* GraphQL */ `
  subscription OnDeleteChatRoom($filter: ModelSubscriptionChatRoomFilterInput) {
    onDeleteChatRoom(filter: $filter) {
      id
      newMessages
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        createdAt
        updatedAt
        __typename
      }
      Messages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      chatRoomLastMessageId
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      name
      imageUri
      status
      Messages {
        nextToken
        __typename
      }
      chatrooms {
        nextToken
        __typename
      }
      lastOnlineAt
      phonenumber
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      imageUri
      status
      Messages {
        nextToken
        __typename
      }
      chatrooms {
        nextToken
        __typename
      }
      lastOnlineAt
      phonenumber
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      imageUri
      status
      Messages {
        nextToken
        __typename
      }
      chatrooms {
        nextToken
        __typename
      }
      lastOnlineAt
      phonenumber
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateChatRoomUser = /* GraphQL */ `
  subscription OnCreateChatRoomUser(
    $filter: ModelSubscriptionChatRoomUserFilterInput
  ) {
    onCreateChatRoomUser(filter: $filter) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        newMessages
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        status
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateChatRoomUser = /* GraphQL */ `
  subscription OnUpdateChatRoomUser(
    $filter: ModelSubscriptionChatRoomUserFilterInput
  ) {
    onUpdateChatRoomUser(filter: $filter) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        newMessages
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        status
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteChatRoomUser = /* GraphQL */ `
  subscription OnDeleteChatRoomUser(
    $filter: ModelSubscriptionChatRoomUserFilterInput
  ) {
    onDeleteChatRoomUser(filter: $filter) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        newMessages
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        status
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
