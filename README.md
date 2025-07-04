# DSA PathRecommender

A comprehensive Data Structures and Algorithms learning platform that provides personalized learning paths based on your current knowledge level.

## Features

### 🎯 Personalized Learning Paths
- **Known Topics**: Tell us what you already know and get a customized learning path
- **Start from Scratch**: Begin your DSA journey from the very beginning
- **Mastery Plan**: Access organized PDFs and resources for systematic learning

### 📚 Rich Content
- **Topic Cards**: Each topic includes YouTube videos, LeetCode problems, and PDF resources
- **Progress Tracking**: Monitor your learning progress with detailed analytics
- **Interactive Learning**: Practice problems with integrated code editor

### 🏗️ Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Neo4j (Graph Database)
- **Authentication**: JWT-based authentication

## Project Structure

```
dsa project/
├── client-final/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── scripts/       # Database seeding scripts
│   └── package.json
└── docker-compose.yml     # Docker configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (optional, for Neo4j)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-project
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client-final
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in `client-final/`:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```
   
   Create `.env` in `server/`:
   ```
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=pleaseletmein
   PORT=5000
   ```

4. **Start Neo4j (Optional)**
   
   If you have Docker installed:
   ```bash
   docker-compose up -d neo4j
   ```
   
   Or install Neo4j Desktop and start it manually.

5. **Seed the database (Optional)**
   ```bash
   cd server
   npm run seed-topics
   ```

6. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client-final
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Neo4j Browser: http://localhost:7474 (if using Docker)

## Usage

### For New Users
1. **Sign Up**: Create a new account
2. **Choose Your Path**:
   - **Known Topics**: Select topics you're familiar with
   - **Start from Scratch**: Begin with fundamentals
   - **Mastery Plan**: Focus on essential concepts

### Learning Flow
1. **Select Topics**: Choose from available DSA topics
2. **View Resources**: Access videos, articles, and practice problems
3. **Practice**: Solve problems with the integrated code editor
4. **Track Progress**: Monitor your learning journey

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Topics & Learning Paths
- `GET /api/topics` - Get all available topics
- `POST /api/path` - Generate personalized learning path
- `GET /api/path/mastery` - Get mastery plan topics
- `GET /api/path/full` - Get complete learning path

### User Progress
- `GET /api/user/progress` - Get user progress
- `POST /api/user/progress` - Update user progress

## Development

### Available Scripts

**Frontend (client-final/)**
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

**Backend (server/)**
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run seed-topics` - Seed database with topics

### Mock Data
The application includes mock data for development when Neo4j is not available. This allows you to test the frontend functionality without setting up the database.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 