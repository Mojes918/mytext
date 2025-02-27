/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRandomChatQueue = /* GraphQL */ `
  mutation CreateRandomChatQueue(
    $input: CreateRandomChatQueueInput!
    $condition: ModelRandomChatQueueConditionInput
  ) {
    createRandomChatQueue(input: $input, condition: $condition) {
      id
      userID
      status
      tempName
      tempImageUri
      chatRoomId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateRandomChatQueue = /* GraphQL */ `
  mutation UpdateRandomChatQueue(
    $input: UpdateRandomChatQueueInput!
    $condition: ModelRandomChatQueueConditionInput
  ) {
    updateRandomChatQueue(input: $input, condition: $condition) {
      id
      userID
      status
      tempName
      tempImageUri
      chatRoomId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteRandomChatQueue = /* GraphQL */ `
  mutation DeleteRandomChatQueue(
    $input: DeleteRandomChatQueueInput!
    $condition: ModelRandomChatQueueConditionInput
  ) {
    deleteRandomChatQueue(input: $input, condition: $condition) {
      id
      userID
      status
      tempName
      tempImageUri
      chatRoomId
      createdAt
      updatedAt
      __typename
    }
  }
`;
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
      scheduledTime
      isScheduled
      deleted
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
      scheduledTime
      isScheduled
      deleted
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
      scheduledTime
      isScheduled
      deleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createRandomMessage = /* GraphQL */ `
  mutation CreateRandomMessage(
    $input: CreateRandomMessageInput!
    $condition: ModelRandomMessageConditionInput
  ) {
    createRandomMessage(input: $input, condition: $condition) {
      id
      content
      userID
      randomChatRoomID
      status
      replyToMessageId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateRandomMessage = /* GraphQL */ `
  mutation UpdateRandomMessage(
    $input: UpdateRandomMessageInput!
    $condition: ModelRandomMessageConditionInput
  ) {
    updateRandomMessage(input: $input, condition: $condition) {
      id
      content
      userID
      randomChatRoomID
      status
      replyToMessageId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteRandomMessage = /* GraphQL */ `
  mutation DeleteRandomMessage(
    $input: DeleteRandomMessageInput!
    $condition: ModelRandomMessageConditionInput
  ) {
    deleteRandomMessage(input: $input, condition: $condition) {
      id
      content
      userID
      randomChatRoomID
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
      type
      Messages {
        nextToken
        __typename
      }
      RandomMessages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      RandomChatRoomUsers {
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
export const updateChatRoom = /* GraphQL */ `
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
      type
      Messages {
        nextToken
        __typename
      }
      RandomMessages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      RandomChatRoomUsers {
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
export const deleteChatRoom = /* GraphQL */ `
  mutation DeleteChatRoom(
    $input: DeleteChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    deleteChatRoom(input: $input, condition: $condition) {
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
      type
      Messages {
        nextToken
        __typename
      }
      RandomMessages {
        nextToken
        __typename
      }
      ChatRoomUsers {
        nextToken
        __typename
      }
      RandomChatRoomUsers {
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
export const createUnreadMessages = /* GraphQL */ `
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
        type
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
        pushToken
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
export const updateUnreadMessages = /* GraphQL */ `
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
        type
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
        pushToken
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
export const deleteUnreadMessages = /* GraphQL */ `
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
        type
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
        pushToken
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
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
export const deleteUser = /* GraphQL */ `
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
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      content
      discription
      media
      type
      likes {
        nextToken
        __typename
      }
      loves {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      shares
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      content
      discription
      media
      type
      likes {
        nextToken
        __typename
      }
      loves {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      shares
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
        lastOnlineAt
        phonenumber
        email
        createdAt
        updatedAt
        __typename
      }
      content
      discription
      media
      type
      likes {
        nextToken
        __typename
      }
      loves {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      shares
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLove = /* GraphQL */ `
  mutation CreateLove(
    $input: CreateLoveInput!
    $condition: ModelLoveConditionInput
  ) {
    createLove(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLove = /* GraphQL */ `
  mutation UpdateLove(
    $input: UpdateLoveInput!
    $condition: ModelLoveConditionInput
  ) {
    updateLove(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLove = /* GraphQL */ `
  mutation DeleteLove(
    $input: DeleteLoveInput!
    $condition: ModelLoveConditionInput
  ) {
    deleteLove(input: $input, condition: $condition) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      postID
      userID
      content
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      postID
      userID
      content
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      postID
      userID
      content
      user {
        id
        name
        imageUri
        backgroundImageUri
        status
        pushToken
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
export const createFollow = /* GraphQL */ `
  mutation CreateFollow(
    $input: CreateFollowInput!
    $condition: ModelFollowConditionInput
  ) {
    createFollow(input: $input, condition: $condition) {
      id
      followerID
      followingID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFollow = /* GraphQL */ `
  mutation UpdateFollow(
    $input: UpdateFollowInput!
    $condition: ModelFollowConditionInput
  ) {
    updateFollow(input: $input, condition: $condition) {
      id
      followerID
      followingID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFollow = /* GraphQL */ `
  mutation DeleteFollow(
    $input: DeleteFollowInput!
    $condition: ModelFollowConditionInput
  ) {
    deleteFollow(input: $input, condition: $condition) {
      id
      followerID
      followingID
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
        type
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
        pushToken
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
        type
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
        pushToken
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
        type
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
        pushToken
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
export const createRandomChatRoomUser = /* GraphQL */ `
  mutation CreateRandomChatRoomUser(
    $input: CreateRandomChatRoomUserInput!
    $condition: ModelRandomChatRoomUserConditionInput
  ) {
    createRandomChatRoomUser(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        type
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
        pushToken
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
export const updateRandomChatRoomUser = /* GraphQL */ `
  mutation UpdateRandomChatRoomUser(
    $input: UpdateRandomChatRoomUserInput!
    $condition: ModelRandomChatRoomUserConditionInput
  ) {
    updateRandomChatRoomUser(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        type
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
        pushToken
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
export const deleteRandomChatRoomUser = /* GraphQL */ `
  mutation DeleteRandomChatRoomUser(
    $input: DeleteRandomChatRoomUserInput!
    $condition: ModelRandomChatRoomUserConditionInput
  ) {
    deleteRandomChatRoomUser(input: $input, condition: $condition) {
      id
      chatRoomId
      userId
      chatRoom {
        id
        type
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
        pushToken
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
