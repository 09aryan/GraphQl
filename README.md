### Overview

This is a **GraphQL-based social media backend** built with Node.js, Express, Apollo Server, and MongoDB. It provides core social media functionalities, including user authentication, following/unfollowing users, creating posts, adding comments, and managing notifications.

---

### Features

1. **User Authentication**
   - Register and login users with hashed passwords.
   - Authentication via JSON Web Tokens (JWT).

2. **User Profiles**
   - Create, update, and retrieve user profiles with bio and avatar fields.
   - Follow and unfollow users.

3. **Posts**
   - Create, edit, delete, and fetch posts.
   - Retrieve posts from followed users as a "feed".

4. **Comments**
   - Add comments to posts.
   - Store comments as notifications linked to posts.

5. **Notifications**
   - Notify users about new comments and followers.
   - Mark notifications as read.

---

### Project Structure

```
├── models/
│   ├── User.js           # User schema and methods
│   ├── Post.js           # Post schema
│   ├── Notification.js   # Notification schema
│
├── resolvers/
│   ├── userResolvers.js          # User-related GraphQL resolvers
│   ├── postResolvers.js          # Post-related GraphQL resolvers
│   ├── notificationResolvers.js  # Notification-related GraphQL resolvers
│   ├── index.js                  # Combine all resolvers
│
├── schema/
│   ├── typeDefs.js      # GraphQL type definitions
│
├── utils/
│   ├── auth.js          # Token-based user authentication utilities
│
├── .env                 # Environment variables
├── server.js            # Express server with Apollo Server integration
├── package.json         # Node.js dependencies and scripts
```

---

### Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add:
   ```
   JWT_SECRET=your_jwt_secret
   MONGO_URI=your_mongo_db_connection_string
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   The server will be running at `http://localhost:4000`.

---

### GraphQL Schema

#### User

```graphql
type User {
  id: ID!
  username: String!
  email: String!
  profile: Profile
  followers: [User]
  following: [User]
  createdAt: String!
  updatedAt: String!
}

type Profile {
  bio: String
  avatar: String
}
```

#### Post

```graphql
type Post {
  id: ID!
  author: User!
  content: String!
  comments: [Notification]
  createdAt: String!
  updatedAt: String!
}
```

#### Notification

```graphql
type Notification {
  id: ID!
  user: User!
  type: String!
  message: String
  isRead: Boolean!
  createdAt: String!
  updatedAt: String!
}
```

#### AuthPayload

```graphql
type AuthPayload {
  token: String!
  user: User!
}
```

---

### Key GraphQL Operations

#### Queries

- `me`: Get details of the authenticated user.
- `getUser(id: ID!)`: Fetch a user by ID.
- `getPosts`: Get all posts.
- `getFeed`: Fetch posts from users the authenticated user follows.
- `getNotifications`: Fetch notifications for the authenticated user.

#### Mutations

- `register`: Register a new user.
- `login`: Log in an existing user.
- `updateProfile`: Update user bio or avatar.
- `followUser(userId: ID!)`: Follow another user.
- `unfollowUser(userId: ID!)`: Unfollow a user.
- `createPost(content: String!)`: Create a new post.
- `editPost(postId: ID!, content: String!)`: Edit an existing post.
- `deletePost(postId: ID!)`: Delete a post.
- `addComment(postId: ID!, message: String!)`: Add a comment to a post.
- `markNotificationAsRead(notificationId: ID!)`: Mark a notification as read.

---

### Authentication

- **JWT-Based**: Each request must include a token in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- Token is generated during login or registration and decoded for authenticated operations.

---

### Technologies Used

- **Backend Framework**: Node.js with Express.js.
- **GraphQL**: Apollo Server for query resolution.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT for secure token-based auth.
- **Utilities**: bcrypt for password hashing.

---

### Running Tests

To test the application, ensure the server is running, and use tools like **GraphQL Playground**, **Postman**, or **Insomnia** to execute queries and mutations.

---

### Deployment

1. Set up a MongoDB Atlas cluster or local MongoDB instance.
2. Use a hosting platform like **Heroku** or **Vercel**.
3. Configure environment variables on the hosting platform.
4. Deploy the server.

---

### Notes

- Ensure your `.env` file is not included in the version control for security.
- Proper error handling is implemented to handle common user issues and authentication errors.

---

