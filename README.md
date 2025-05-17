# 🚀 BirJob - Your Ultimate Job Aggregator

BirJob is a modern, high-performance job board that aggregates positions from over 50 different sources, making job hunting simpler and more efficient. Built with Next.js and powered by real-time data scraping, it brings you the latest opportunities in one sleek interface.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.7-purple)

</div>

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Data Flow](#-data-flow)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Commands](#-development-commands)
- [Deployment](#-deployment)
- [Scheduled Tasks](#-scheduled-tasks)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Contact](#-contact)

## ✨ Features

### 🔍 Smart Search & Discovery
- **Intelligent Filtering**: Search across job titles and companies simultaneously
- **Real-time Results**: Instant search with debounced queries for optimal performance
- **Unique Listings**: Automatic deduplication of similar positions
- **Source Preferences**: Filter jobs by preferred platforms and companies

### 📊 Data Insights
- **Market Trends**: Visualize current job market data, sources, and top hiring companies
- **Real-time Updates**: Continuous scraping ensures fresh content
- **Smart Deduplication**: Intelligent algorithms to avoid duplicate listings

### 🔔 Personalized Notifications
- **Keyword-Based Alerts**: Set up daily email notifications for jobs matching your criteria
- **Source Filtering**: Choose which job platforms to monitor
- **Daily Digest**: Receive one comprehensive email with all matching opportunities

### 🤖 AI Assistant
- **Job Search Guidance**: Get personalized advice on job hunting strategies
- **Resume Optimization**: Tips for creating ATS-friendly resumes
- **Interview Preparation**: Helpful resources for acing your interviews
- **Powered by Groq**: Utilizes Groq API for fast, accurate responses

### 📱 User Experience
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dark Mode Support**: Choose between light and dark themes
- **Accessibility**: Built with web accessibility standards in mind
- **Performance Optimized**: Fast loading and interaction times

### 🧩 Additional Features
- **Blog**: Career advice and job search tips with categorized articles
- **Contact Form**: Easy way to reach out with questions or feedback
- **Analytics**: Track job market trends and source effectiveness

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph "Frontend"
        NF[Next.js Frontend]
        Components[React Components]
        Hooks[Custom Hooks]
        Context[Context API]
    end

    subgraph "Backend"
        API[Next.js API Routes]
        Prisma[Prisma ORM]
        Email[Email Service]
        AI[Groq AI Integration]
    end

    subgraph "Data Sources"
        DB[(PostgreSQL)]
        JobSites[50+ Job Sites]
    end

    subgraph "Services"
        GHA[GitHub Actions]
        Scraper[Job Scraper]
    end

    NF --> Components
    NF --> Hooks
    NF --> Context
    Components --> API
    API --> Prisma
    Prisma --> DB
    Scraper --> JobSites
    Scraper --> DB
    GHA --> Scraper
    GHA --> Email
    API --> Email
    API --> AI
```

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Client as Next.js Client
    participant API as API Routes
    participant DB as PostgreSQL
    participant Email as Email Service
    participant AI as Groq AI

    User->>Client: Search Jobs
    Client->>API: GET /api/jobs?search=...
    API->>DB: Query jobs_jobpost table
    DB->>API: Return matching jobs
    API->>Client: Return JSON response
    Client->>User: Display job listings

    User->>Client: Set up notifications
    Client->>API: POST /api/users/keywords
    API->>DB: Store user preferences
    DB->>API: Confirm storage
    API->>Client: Success response
    Client->>User: Confirm setup

    Note over User,DB: Daily job notification process
    DB->>Email: Find matching jobs
    Email->>User: Send daily digest email

    User->>Client: Ask AI Assistant
    Client->>API: POST /api/ai/chat
    API->>AI: Forward query to Groq
    AI->>API: AI response
    API->>Client: Return response
    Client->>User: Display AI answer
```

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **UI Components**: Custom components built on Radix UI primitives

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Email-based authentication
- **Caching**: Built-in Next.js caching mechanisms
- **Data Scraping**: Custom Node.js scraping engine
- **Email Service**: Resend for notification delivery
- **AI Integration**: Groq API for the AI assistant

### DevOps
- **CI/CD**: GitHub Actions for automated workflows
- **Scheduling**: Automated daily job notifications
- **Error Handling**: Comprehensive error boundary system
- **Analytics**: Custom analytics tracking

## 🗄 Database Schema

```mermaid
erDiagram
    jobs_jobpost {
        int id PK
        string title
        string company
        string apply_link
        string source
        datetime created_at
    }
    
    users {
        int id PK
        string email
        datetime createdAt
        datetime updatedAt
        datetime lastNotifiedAt
    }
    
    keywords {
        int id PK
        string keyword
        int userId FK
        datetime createdAt
    }
    
    sourcePreferences {
        int id PK
        int userId FK
        string source
        datetime createdAt
    }
    
    notifications {
        int id PK
        int userId FK
        int jobId FK
        datetime sentAt
        string matchedKeyword
        boolean isRead
    }
    
    contactSubmissions {
        int id PK
        string name
        string email
        string message
        string ip
        string userAgent
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    BlogPost {
        int id PK
        string slug
        string title
        string excerpt
        string content
        string author
        string authorImage
        string authorBio
        string authorRole
        datetime date
        string readTime
        string category
        string coverImage
        boolean featured
        int trendingScore
        int viewCount
        int likeCount
        int commentCount
    }
    
    BlogPostTag {
        int id PK
        string name
        int blogPostId FK
    }
    
    BlogPostRelation {
        int id PK
        int blogPostId FK
        int relatedPostId
    }
    
    users ||--o{ keywords : "has"
    users ||--o{ sourcePreferences : "has"
    users ||--o{ notifications : "receives"
    jobs_jobpost ||--o{ notifications : "generates"
    BlogPost ||--o{ BlogPostTag : "has"
    BlogPost ||--o{ BlogPostRelation : "relates to"
```

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 13
```

### Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/birjob"
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="no-reply@yourdomain.com"
CONTACT_NOTIFICATION_EMAIL="your-email@example.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GROQ_API_KEY="your_groq_api_key"
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ismat-samadov/birjob.git
cd birjob
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running! 🎉

## 📚 Project Structure

```
birjob/
├── src/
│   ├── app/              # Next.js 14 app directory
│   │   ├── api/          # API routes
│   │   ├── blog/         # Blog pages
│   │   ├── contact/      # Contact form
│   │   ├── trends/       # Job market trends
│   │   ├── notifications/# User notification preferences
│   │   ├── ai-assistant/ # AI chatbot assistant
│   │   └── page.tsx      # Main page
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI components (shadcn)
│   │   └── ...           # Feature-specific components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   ├── email.ts      # Email sending utilities
│   │   ├── groq.ts       # AI integration
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/               # Static assets
└── scripts/              # Scraping scripts
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run all checks
npm run check-all
```

## 🚢 Deployment

BirJob can be deployed to various platforms:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build Docker image
docker build -t birjob .

# Run container
docker run -p 3000:3000 birjob
```

## 🔄 Scheduled Tasks

```mermaid
gantt
    title BirJob Scheduled Tasks
    dateFormat  HH:mm
    axisFormat %H:%M
    
    section Daily Tasks
    Job Scraping           :daily1, 04:00, 1h
    Data Processing        :daily2, after daily1, 30m
    Email Notifications    :daily3, 09:00, 2h
    
    section Weekly Tasks
    Database Maintenance   :weekly1, 00:00, 1h
    Performance Analytics  :weekly2, after weekly1, 1h
```

BirJob uses GitHub Actions for scheduled tasks:

- **Daily Job Notifications**: Sends email notifications to users at 9:00 AM UTC based on their keyword preferences
- **Data Scraping**: Regularly scrapes job sources at 4:00 AM UTC to keep listings fresh
- **Database Maintenance**: Weekly cleanup and optimization of database tables

## 👥 User Journey

```mermaid
journey
    title BirJob User Journey
    section Search & Discovery
        Visit homepage: 5: User
        Browse job listings: 4: User
        Apply filters: 3: User
        View job details: 5: User
        Click apply button: 4: User
    section Notifications
        Set up email: 3: User
        Add keywords: 4: User
        Select sources: 3: User
        Receive daily emails: 5: User
        Click job in email: 4: User
    section Blog & Resources
        Visit blog: 3: User
        Read articles: 4: User
        Subscribe to newsletter: 3: User
        Use AI assistant: 5: User
```

## 🤝 Contributing

We love contributions! Follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Prisma](https://prisma.io) for database management
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Resend](https://resend.com) for email infrastructure
- [Groq](https://groq.com) for AI capabilities
- [Vercel](https://vercel.com) for hosting

## 🔗 Contact

For questions or feedback, reach out to us at [contact@birjob.com](mailto:contact@birjob.com) or visit our [contact page](https://birjob.com/contact).