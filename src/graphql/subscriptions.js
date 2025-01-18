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
      scheduledTime
      isScheduled
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
      scheduledTime
      isScheduled
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
      scheduledTime
      isScheduled
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
        scheduledTime
        isScheduled
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
        scheduledTime
        isScheduled
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
        scheduledTime
        isScheduled
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
      id
      userID
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
      id
      userID
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
      id
      userID
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
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike($filter: ModelSubscriptionLikeFilterInput) {
    onCreateLike(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike($filter: ModelSubscriptionLikeFilterInput) {
    onUpdateLike(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike($filter: ModelSubscriptionLikeFilterInput) {
    onDeleteLike(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateLove = /* GraphQL */ `
  subscription OnCreateLove($filter: ModelSubscriptionLoveFilterInput) {
    onCreateLove(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateLove = /* GraphQL */ `
  subscription OnUpdateLove($filter: ModelSubscriptionLoveFilterInput) {
    onUpdateLove(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteLove = /* GraphQL */ `
  subscription OnDeleteLove($filter: ModelSubscriptionLoveFilterInput) {
    onDeleteLove(filter: $filter) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
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
export const onCreateFollow = /* GraphQL */ `
  subscription OnCreateFollow($filter: ModelSubscriptionFollowFilterInput) {
    onCreateFollow(filter: $filter) {
      id
      followerID
      followingID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFollow = /* GraphQL */ `
  subscription OnUpdateFollow($filter: ModelSubscriptionFollowFilterInput) {
    onUpdateFollow(filter: $filter) {
      id
      followerID
      followingID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFollow = /* GraphQL */ `
  subscription OnDeleteFollow($filter: ModelSubscriptionFollowFilterInput) {
    onDeleteFollow(filter: $filter) {
      id
      followerID
      followingID
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
