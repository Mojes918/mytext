
import { gql } from "@apollo/client";

export const GET_MESSAGE = gql`
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      content
      image
      audio
      userID
      chatroomID
      status
      replyToMessageId
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const CREATE_MESSAGE=gql`mutation CreateMessage(
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
    scheduledTime
    isScheduled
    deleted
    createdAt
    updatedAt
    __typename
  }
}
`;

export const LIST_MESSAGES = gql`
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        scheduledTime
        isScheduled
        deleted
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ON_UPDATE_MESSAGE = gql`
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
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const GET_CHATROOM = gql`
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        scheduledTime
        isScheduled
        deleted
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
      UnreadMessages {
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

export const LIST_CHATROOMS = gql`
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const GET_UNREAD_MESSAGES = gql`
  query GetUnreadMessages($id: ID!) {
    getUnreadMessages(id: $id) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;

export const LIST_UNREAD_MESSAGES = gql`
  query ListUnreadMessages(
    $filter: ModelUnreadMessagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnreadMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatRoomId
        userId
        newMessages
        createdAt
        updatedAt
        chatRoomUnreadMessagesId
        userUnreadMessagesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      imageUri
      backgroundImageUri
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
      posts {
        nextToken
        __typename
      }
      followers {
        nextToken
        __typename
      }
      following {
        nextToken
        __typename
      }
      UnreadMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const LIST_USERS = gql`
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        imageUri
        backgroundImageUri
        status
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const LIST_CHATROOM_USERS = gql`
  query ListChatRoomUsers(
    $filter: ModelChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRoomUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatRoomId
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const GET_CHATROOM_USER = gql`
  query GetChatRoomUser($id: ID!) {
    getChatRoomUser(id: $id) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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


// Mutation for updating a user
export const UPDATE_USER = gql`
 mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      imageUri
      backgroundImageUri
      status
      pushToken
      Messages {
        nextToken
        __typename
      }
      RandomMessages {
        nextToken
        __typename
      }
      randomChatrooms {
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
      posts {
        nextToken
        __typename
      }
      followers {
        nextToken
        __typename
      }
      following {
        nextToken
        __typename
      }
      UnreadMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
// Mutation for deleting a user
export const DELETE_USER = gql`
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      imageUri
      backgroundImageUri
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
      posts {
        nextToken
        __typename
      }
      followers {
        nextToken
        __typename
      }
      following {
        nextToken
        __typename
      }
      UnreadMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

// Mutation for creating unread messages
export const CREATE_UNREAD_MESSAGES = gql`
  mutation CreateUnreadMessages(
    $input: CreateUnreadMessagesInput!
    $condition: ModelUnreadMessagesConditionInput
  ) {
    createUnreadMessages(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;

// Mutation for updating unread messages
export const UPDATE_UNREAD_MESSAGES = gql`
  mutation UpdateUnreadMessages(
    $input: UpdateUnreadMessagesInput!
    $condition: ModelUnreadMessagesConditionInput
  ) {
    updateUnreadMessages(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;

// Mutation for deleting unread messages
export const DELETE_UNREAD_MESSAGES = gql`
  mutation DeleteUnreadMessages(
    $input: DeleteUnreadMessagesInput!
    $condition: ModelUnreadMessagesConditionInput
  ) {
    deleteUnreadMessages(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;


// Mutation for updating a message
export const UPDATE_MESSAGE = gql`
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
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;

// Mutation for deleting a message
export const DELETE_MESSAGE = gql`
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
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;

// Mutation for creating a chat room
export const CREATE_CHATROOM = gql`
  mutation CreateChatRoom(
    $input: CreateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    createChatRoom(input: $input, condition: $condition) {
      id
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        scheduledTime
        isScheduled
        deleted
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
      UnreadMessages {
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

// Mutation for updating a chat room
export const UPDATE_CHATROOM = gql`
  mutation UpdateChatRoom(
    $input: UpdateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    updateChatRoom(input: $input, condition: $condition) {
      id
      LastMessage {
        id
        content
        image
        audio
        userID
        chatroomID
        status
        replyToMessageId
        scheduledTime
        isScheduled
        deleted
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
      UnreadMessages {
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

// Mutation for creating a chat room user
export const CREATE_CHAT_ROOM_USER = gql`
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
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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

// Mutation for updating a chat room user
export const UPDATE_CHAT_ROOM_USER = gql`
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
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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

// Mutation for deleting a chat room user
export const DELETE_CHAT_ROOM_USER = gql`
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
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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


// Subscription for creating a message
export const ON_CREATE_MESSAGE = gql`
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
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;

// Subscription for creating unread messages
export const ON_CREATE_UNREAD_MESSAGES = gql`
  subscription OnCreateUnreadMessages(
    $filter: ModelSubscriptionUnreadMessagesFilterInput
  ) {
    onCreateUnreadMessages(filter: $filter) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;

// Subscription for updating unread messages
export const ON_UPDATE_UNREAD_MESSAGES = gql`
  subscription OnUpdateUnreadMessages(
    $filter: ModelSubscriptionUnreadMessagesFilterInput
  ) {
    onUpdateUnreadMessages(filter: $filter) {
      id
      chatRoomId
      userId
      newMessages
      chatRoom {
        id
        createdAt
        updatedAt
        chatRoomLastMessageId
        __typename
      }
      user {
        id
        name
        imageUri
        backgroundImageUri
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
      chatRoomUnreadMessagesId
      userUnreadMessagesId
      __typename
    }
  }
`;
