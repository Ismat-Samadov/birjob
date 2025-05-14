# 🚀 BirJob - Your Ultimate Job Aggregator

BirJob is a modern, high-performance job board that aggregates positions from over 50 different sources, making job hunting simpler and more efficient. Built with Next.js and powered by real-time data scraping, it brings you the latest opportunities in one sleek interface.

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

## 💻 Technical Stack

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

BirJob uses GitHub Actions for scheduled tasks:

- **Daily Job Notifications**: Sends email notifications to users based on their keyword preferences
- **Data Scraping**: Regularly scrapes job sources to keep listings fresh

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