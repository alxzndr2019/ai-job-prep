# AI Job Preparation Backend

A comprehensive backend system for AI-driven job preparation that analyzes user skills, matches them with job requirements, and creates personalized learning plans.

## Features

- 🔐 **Authentication & Authorization**: JWT-based secure authentication
- 👤 **User Profile Management**: Comprehensive skill and experience tracking
- 🤖 **AI-Powered Job Analysis**: LangChain integration for flexible AI model usage
- 📊 **Match Score Calculation**: Intelligent job-candidate matching algorithm
- 📚 **Learning Plan Generation**: Personalized study plans with curated resources
- 🏗️ **Repository Pattern**: Clean, maintainable code architecture
- 🛡️ **Security**: Rate limiting, input validation, and security headers
- 📝 **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: LangChain (OpenAI/Anthropic)
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:

   - MongoDB connection string
   - JWT secret
   - AI API keys (OpenAI or Anthropic)

5. Build and start:

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Job Analysis

- `POST /api/jobs/analyze` - Analyze job match and create learning plan
- `GET /api/jobs/applications` - Get user's job applications
- `GET /api/jobs/applications/:id` - Get specific application
- `PATCH /api/jobs/applications/:id/status` - Update application status

### User Management

- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/skills` - Add skill to profile
- `DELETE /api/users/skills/:skillName` - Remove skill from profile

## Architecture

The application follows the Repository Pattern with clean separation of concerns:

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── models/         # Database schemas
├── middleware/     # Express middleware
├── routes/         # API routes
├── config/         # Configuration files
└── types/          # TypeScript type definitions
```

## AI Integration

The system uses LangChain for flexible AI model integration. You can easily switch between:

- OpenAI GPT models
- Anthropic Claude models
- Other supported LangChain providers

## Usage Example

1. **Register a user** with their skills and experience
2. **Analyze a job** by providing the job description
3. **Get match score** and detailed analysis
4. **Follow the learning plan** with curated resources and projects
5. **Track progress** through the application status system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License;
