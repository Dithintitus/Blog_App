# The Blog App

A complete MERN (MongoDB, Express, React, Node.js) stack application for blogging with user authentication, admin panel, and blog approval system.

## Features

### User Features
- **Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Update profile information and profile picture
- **Blog Creation**: Create blogs with title, description, images, and categories
- **Blog Management**: Edit and delete your own blogs
- **Browse Blogs**: View approved blogs with search and category filtering
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **User Management**: View all users, promote/demote admin roles, delete users
- **Blog Moderation**: Approve/reject pending blogs
- **Dashboard**: Overview of users and pending content

### Technical Features
- **Secure Authentication**: Password hashing with bcrypt, JWT tokens
- **Input Validation**: Comprehensive form validation on both client and server
- **Error Handling**: Global error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with CSS Grid and Flexbox
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router v6** for client-side routing
- **Axios** for HTTP requests
- **React Toastify** for notifications
- **CSS3** with custom properties and responsive design

### Backend
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## Project Structure

\`\`\`
/project-root
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd blog-app
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file in the server directory:
\`\`\`env
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../client
npm install
\`\`\`

### 4. Database Setup
The application will automatically create default categories when the server starts. Make sure MongoDB is running.

### 5. Running the Application

#### Development Mode
Start the backend server:
\`\`\`bash
cd server
npm run dev
\`\`\`

Start the frontend development server:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Mode
Build the frontend:
\`\`\`bash
cd client
npm run build
\`\`\`

Start the production server:
\`\`\`bash
cd server
npm start
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Blogs
- `GET /api/blogs` - Get all approved blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (owner/admin)
- `DELETE /api/blogs/:id` - Delete blog (owner/admin)
- `GET /api/blogs/categories` - Get all categories

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id/blogs` - Get user's blogs
- `PUT /api/users/:id` - Update user profile

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/blogs` - Get blogs (with filters)
- `PUT /api/admin/blogs/:id/approve` - Approve blog
- `DELETE /api/admin/blogs/:id` - Delete any blog
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Update user role

## Environment Variables

### Server (.env)
\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
\`\`\`

## Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Enable automatic deploys

### Manual Deployment
1. Build the frontend: `cd client && npm run build`
2. Set environment variables on your server
3. Start the server: `cd server && npm start`

### Environment Setup
- Set `NODE_ENV=production`
- Configure `MONGO_URI` with your production database
- Use a strong `JWT_SECRET`

## Security Features

- **Password Security**: Passwords hashed with bcrypt (12 rounds)
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Secure error messages without sensitive data exposure

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
