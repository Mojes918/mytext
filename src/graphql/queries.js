/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRandomChatQueue = /* GraphQL */ `
  query GetRandomChatQueue($id: ID!) {
    getRandomChatQueue(id: $id) {
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
export const listRandomChatQueues = /* GraphQL */ `
  query ListRandomChatQueues(
    $filter: ModelRandomChatQueueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRandomChatQueues(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const randomChatQueuesByUserID = /* GraphQL */ `
  query RandomChatQueuesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomChatQueueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomChatQueuesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const randomChatQueuesByChatRoomId = /* GraphQL */ `
  query RandomChatQueuesByChatRoomId(
    $chatRoomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomChatQueueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomChatQueuesByChatRoomId(
      chatRoomId: $chatRoomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
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
export const listMessages = /* GraphQL */ `
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
export const messagesByUserID = /* GraphQL */ `
  query MessagesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const messagesByChatroomID = /* GraphQL */ `
  query MessagesByChatroomID(
    $chatroomID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByChatroomID(
      chatroomID: $chatroomID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const getRandomMessage = /* GraphQL */ `
  query GetRandomMessage($id: ID!) {
    getRandomMessage(id: $id) {
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
export const listRandomMessages = /* GraphQL */ `
  query ListRandomMessages(
    $filter: ModelRandomMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRandomMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const randomMessagesByUserID = /* GraphQL */ `
  query RandomMessagesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomMessagesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const randomMessagesByRandomChatRoomID = /* GraphQL */ `
  query RandomMessagesByRandomChatRoomID(
    $randomChatRoomID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomMessagesByRandomChatRoomID(
      randomChatRoomID: $randomChatRoomID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getChatRoom = /* GraphQL */ `
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
export const listChatRooms = /* GraphQL */ `
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
export const getUnreadMessages = /* GraphQL */ `
  query GetUnreadMessages($id: ID!) {
    getUnreadMessages(id: $id) {
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
export const listUnreadMessages = /* GraphQL */ `
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
export const unreadMessagesByChatRoomId = /* GraphQL */ `
  query UnreadMessagesByChatRoomId(
    $chatRoomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUnreadMessagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    unreadMessagesByChatRoomId(
      chatRoomId: $chatRoomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const unreadMessagesByUserId = /* GraphQL */ `
  query UnreadMessagesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUnreadMessagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    unreadMessagesByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
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
        pushToken
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
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        content
        discription
        media
        type
        shares
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const postsByUserID = /* GraphQL */ `
  query PostsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        content
        discription
        media
        type
        shares
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLike = /* GraphQL */ `
  query GetLike($id: ID!) {
    getLike(id: $id) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLikes = /* GraphQL */ `
  query ListLikes(
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const likesByPostID = /* GraphQL */ `
  query LikesByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    likesByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const likesByUserID = /* GraphQL */ `
  query LikesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    likesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLove = /* GraphQL */ `
  query GetLove($id: ID!) {
    getLove(id: $id) {
      id
      postID
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLoves = /* GraphQL */ `
  query ListLoves(
    $filter: ModelLoveFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoves(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const lovesByPostID = /* GraphQL */ `
  query LovesByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoveFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lovesByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const lovesByUserID = /* GraphQL */ `
  query LovesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLoveFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lovesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        userID
        content
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByPostID = /* GraphQL */ `
  query CommentsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        content
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByUserID = /* GraphQL */ `
  query CommentsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        userID
        content
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFollow = /* GraphQL */ `
  query GetFollow($id: ID!) {
    getFollow(id: $id) {
      id
      followerID
      followingID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listFollows = /* GraphQL */ `
  query ListFollows(
    $filter: ModelFollowFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFollows(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        followerID
        followingID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const followsByFollowerID = /* GraphQL */ `
  query FollowsByFollowerID(
    $followerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFollowFilterInput
    $limit: Int
    $nextToken: String
  ) {
    followsByFollowerID(
      followerID: $followerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        followerID
        followingID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const followsByFollowingID = /* GraphQL */ `
  query FollowsByFollowingID(
    $followingID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFollowFilterInput
    $limit: Int
    $nextToken: String
  ) {
    followsByFollowingID(
      followingID: $followingID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        followerID
        followingID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChatRoomUser = /* GraphQL */ `
  query GetChatRoomUser($id: ID!) {
    getChatRoomUser(id: $id) {
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
export const listChatRoomUsers = /* GraphQL */ `
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
export const chatRoomUsersByChatRoomId = /* GraphQL */ `
  query ChatRoomUsersByChatRoomId(
    $chatRoomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatRoomUsersByChatRoomId(
      chatRoomId: $chatRoomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const chatRoomUsersByUserId = /* GraphQL */ `
  query ChatRoomUsersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatRoomUsersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const getRandomChatRoomUser = /* GraphQL */ `
  query GetRandomChatRoomUser($id: ID!) {
    getRandomChatRoomUser(id: $id) {
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
export const listRandomChatRoomUsers = /* GraphQL */ `
  query ListRandomChatRoomUsers(
    $filter: ModelRandomChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRandomChatRoomUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const randomChatRoomUsersByChatRoomId = /* GraphQL */ `
  query RandomChatRoomUsersByChatRoomId(
    $chatRoomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomChatRoomUsersByChatRoomId(
      chatRoomId: $chatRoomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const randomChatRoomUsersByUserId = /* GraphQL */ `
  query RandomChatRoomUsersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRandomChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    randomChatRoomUsersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
