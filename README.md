
```markdown
# Social App API Documentation

This repository contains the API documentation for the Social App, covering various endpoints for Posts and User functionalities.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pravinpgr9/social-app-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd social-app-api
   ```

3. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

## Posts API

### 1. Delete Post

- **Endpoint:** DELETE /api/posts/:postId
- **Description:** Delete a post by providing the post ID.
- **Request:**
  ```json
  {
    "userId": "65c0992a8e2ef2df15d48bdb"
  }
  ```
- **URL:** [http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9](http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9)

### 2. Like/Unlike Post

- **Endpoint:** PUT /api/posts/:postId/like
- **Description:** Like or Unlike a post by providing the post ID.
- **Request:**
  ```json
  {
    "userId": "65c0992a8e2ef2df15d48bdb"
  }
  ```
- **URL:** [http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9/like](http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9/like)

### 3. Create Post

- **Endpoint:** POST /api/post
- **Description:** Create a new post with user ID, description, image, and initial likes.
- **Request:**
  ```json
  {
    "userId": "65c0992a8e2ef2df15d48bdb",
    "desc": "This is the first post. Hello, world!",
    "img": "https://example.com/image1.jpg",
    "likes": [
      "65c07dca5268af08e8a7a997",
      "65c0991f8e2ef2df15d48bd9"
    ]
  }
  ```
- **URL:** [http://localhost:8808/api/post](http://localhost:8808/api/post)

### 4. Post Timeline

- **Endpoint:** GET /api/posts/timeline/:userId
- **Description:** Retrieve posts for a user's timeline.
- **URL:** [http://localhost:8808/api/posts/timeline/65c0992a8e2ef2df15d48bdb](http://localhost:8808/api/posts/timeline/65c0992a8e2ef2df15d48bdb)

### 5. Get All Posts

- **Endpoint:** GET /api/posts
- **Description:** Retrieve all posts.
- **URL:** [http://localhost:8808/api/posts](http://localhost:8808/api/posts)

### 6. Get One Post

- **Endpoint:** GET /api/posts/:postId
- **Description:** Retrieve details of a specific post.
- **URL:** [http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9](http://localhost:8808/api/posts/65c1174e93f537563a1ee0f9)

## User API

### 1. Unfollow User

- **Endpoint:** PUT /api/user/:userId/unfollow
- **Description:** Unfollow a user by providing the user ID.
- **Request:**
  ```json
  {
    "userId": "65c07dca5268af08e8a7a997"
  }
  ```
- **URL:** [http://localhost:8808/api/user/65c0992a8e2ef2df15d48bdb/unfollow](http://localhost:8808/api/user/65c0992a8e2ef2df15d48bdb/unfollow)

### 2. Register User

- **Endpoint:** POST /api/auth/register
- **Description:** Register a new user with a username, email, and password.
- **Request:**
  ```json
  {
    "username": "pravinpgr1998",
    "email": "pravinpgr1998@gmail.com",
    "password": "demotest"
  }
  ```
- **URL:** [http://localhost:8808/api/auth/register](http://localhost:8808/api/auth/register)

### 3. Login

- **Endpoint:** POST /api/auth/login
- **Description:** Login with a username and password.
- **Request:**
  ```json
  {
    "username": "pravinpgr12",
    "password": "demotest"
  }
  ```
- **URL:** [http://localhost:8808/api/auth/login](http://localhost:8808/api/auth/login)

### 4. Update User

- **Endpoint:** PUT /api/user/:userId
- **Description:** Update user details, such as the username.
- **Request:**
  ```json
  {
    "username": "demotest",
    "userId": "65c07f265ff401e6f682e7d2"
  }
  ```
- **URL:** [http://localhost:8808/api/user/65c07f265ff401e6f682e7d2](http://localhost:8808/api/user/65c07f265ff401e6f682e7d2)

### 5. Delete User

- **Endpoint:** DELETE /api/user/:userId
- **Description:** Delete a user by providing the user ID.
- **Request:**
  ```json
  {
    "userId": "65c07f265ff401e6f682e7d2"
  }
  ```
- **URL:** [http://localhost:8808/api/user/65c07f265ff401e6f682e7d2](http://localhost:8808/api/user/65c07f265ff401e6f682e7d2)

### 6. Follow User

- **Endpoint:** PUT /api/user/:userId/follow
- **Description:** Follow a user by providing the user ID.
- **Request:**
  ```json
  {
    "userId": "65c07dca5268af08e8a7a997"
  }
  ```
- **URL:** [http://localhost:8808/api/user/65c0992a8e2ef2df15d48bdb/follow](http://localhost:8808/api/user/65c0992a8e2ef2df15d48bdb/follow)

### 7. Get User Details

- **Endpoint:** GET /api/user/:userId
- **Description:** Retrieve details of a specific user.
- **URL:** [http://localhost:8808/api/user/65c0992

a8e2ef2df15d48bdb](http://localhost:8808/api/user/65c0992a8e2ef2df15d48bdb)

## License

This project is licensed under the [MIT License](LICENSE.md).
```
