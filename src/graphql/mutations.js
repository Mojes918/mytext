/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
export const createChatRoom = /* GraphQL */ `
  mutation CreateChatRoom(
    $input: CreateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    createChatRoom(input: $input, condition: $condition) {
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
export const updateChatRoom = /* GraphQL */ `
  mutation UpdateChatRoom(
    $input: UpdateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    updateChatRoom(input: $input, condition: $condition) {
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
export const deleteChatRoom = /* GraphQL */ `
  mutation DeleteChatRoom(
    $input: DeleteChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    deleteChatRoom(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createChatRoomUser = /* GraphQL */ `
  mutation CreateChatRoomUser(
    $input: CreateChatRoomUserInput!
    $condition: ModelChatRoomUserConditionInput
  ) {
    createChatRoomUser(input: $input, condition: $condition) {
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
export const updateChatRoomUser = /* GraphQL */ `
  mutation UpdateChatRoomUser(
    $input: UpdateChatRoomUserInput!
    $condition: ModelChatRoomUserConditionInput
  ) {
    updateChatRoomUser(input: $input, condition: $condition) {
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
export const deleteChatRoomUser = /* GraphQL */ `
  mutation DeleteChatRoomUser(
    $input: DeleteChatRoomUserInput!
    $condition: ModelChatRoomUserConditionInput
  ) {
    deleteChatRoomUser(input: $input, condition: $condition) {
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
