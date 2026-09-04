# TaskFlow

**AI-powered collaborative task management platform** with real-time synchronization, intelligent task suggestions, and seamless team collaboration.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📝 **Task Management** - Create, update, delete, and organize tasks by status and priority
- 👥 **Collaboration** - Assign team members and share projects
- 🔄 **Real-time Sync** - WebSocket-powered live updates across all clients
- 🎯 **Smart Prioritization** - Low, Medium, High priority levels with due date tracking
- 📊 **Project Organization** - Group tasks into projects with team members
- 🤖 **AI Suggestions** - OpenAI integration for intelligent task recommendations (extensible)
- 💾 **Data Persistence** - MongoDB with optimized indexing
- 📱 **Responsive UI** - Modern React + Tailwind CSS interface

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB running locally or connection URI
- npm >= 9

### Installation

```bash
git clone https://github.com/silvence/TaskFlow.git
cd TaskFlow
npm install
```

### Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start both server and client in watch mode
npm run dev

# Server: http://localhost:3001
# Client: http://localhost:5173
```

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
TaskFlow/
├── src/
│   ├── server/
│   │   ├── config/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT auth middleware
│   │   ├── models/
│   │   │   ├── User.ts           # User schema with password hashing
│   │   │   ├── Task.ts           # Task schema with indexing
│   │   │   └── Project.ts        # Project schema
│   │   ├── routes/
│   │   │   ├── auth.ts           # Login/Register endpoints
│   │   │   ├── tasks.ts          # Task CRUD operations
│   │   │   └── projects.ts       # Project management
│   │   └── server.ts             # Express + Socket.IO setup
│   ├── client/
│   │   ├── pages/
│   │   │   ├── Login.tsx         # Authentication UI
│   │   │   ├── Register.tsx      # Registration form
│   │   │   └── Dashboard.tsx     # Main app interface
│   │   ├── components/
│   │   │   ├── TaskList.tsx      # Kanban-style task columns
│   │   │   ├── TaskCard.tsx      # Individual task UI
│   │   │   ├── TaskForm.tsx      # Create task form
│   │   │   └── Header.tsx        # App header
│   │   ├── store/
│   │   │   ├── auth.ts           # Zustand auth state
│   │   │   └── tasks.ts          # Zustand task state
│   │   ├── App.tsx               # Router setup
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Tailwind styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 Technology Stack

### Backend
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Zod** - Request validation
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **React Query** - Server state
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time updates
- **TypeScript** - Type safety

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### Tasks
- `GET /api/tasks` - List user's tasks (filter by status/priority)
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project

## 🧪 Testing

```bash
# Run test suite
npm test

# Watch mode
npm test -- --watch
```

## 📈 Performance Optimizations

- ✅ MongoDB indexes on frequently queried fields
- ✅ JWT token validation to reduce DB queries
- ✅ WebSocket for real-time updates vs polling
- ✅ React Query caching strategies
- ✅ Tree-shaking via ES modules
- ✅ Production builds with Vite minification

## 🛣️ Future Roadmap

- [ ] AI-powered task suggestions via OpenAI
- [ ] File attachments for tasks
- [ ] Activity timeline and audit logs
- [ ] Calendar view for tasks
- [ ] Email notifications
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for developers who want to stay productive**
