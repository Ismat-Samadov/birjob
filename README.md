# 🚀 Jobry - Your Ultimate Job Aggregator

Jobry is a modern, high-performance job board that aggregates positions from over 50 different sources, making job hunting simpler and more efficient. Built with Next.js and powered by real-time data scraping, it brings you the latest opportunities in one sleek interface.

## ✨ Features

### 🔍 Smart Search
- **Intelligent Filtering**: Search across job titles and companies simultaneously
- **Real-time Results**: Instant search with debounced queries for optimal performance
- **Unique Listings**: Automatic deduplication of similar positions

### 📊 Data Integration
- **Multi-source Aggregation**: Pulls data from 50+ job boards and company websites
- **Real-time Updates**: Continuous scraping ensures fresh content
- **Smart Deduplication**: Intelligent algorithms to avoid duplicate listings

### 💻 Technical Stack

#### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks
- **Type Safety**: TypeScript

#### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Built-in Next.js caching mechanisms
- **Data Scraping**: Custom Node.js scraping engine

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 13
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ismat-samadov/jobry.git
cd jobry
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create a .env file and add:
DATABASE_URL="postgresql://user:password@localhost:5432/jobry"
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running! 🎉

## 📚 Project Structure

```
jobry/
├── src/
│   ├── app/              # Next.js 14 app directory
│   │   ├── api/         # API routes
│   │   ├── components/  # Reusable components
│   │   └── page.tsx     # Main page
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── public/              # Static assets
└── scripts/            # Scraping scripts
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

## 🌟 Key Features in Detail

### Job Search Engine
- Case-insensitive search across all fields
- Debounced search to prevent API spam
- Real-time result updates

### Data Management
- Automatic duplicate detection
- Latest scraping timestamp tracking
- Search query logging for analytics

### User Interface
- Responsive design for all devices
- Clean, modern aesthetic
- Accessibility-first approach

## 🤝 Contributing

We love contributions! Follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Prisma](https://prisma.io) for database management
- [Vercel](https://vercel.com) for hosting

