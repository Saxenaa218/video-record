# Video Testimonials App

A web application for collecting video testimonials from customers. Built with Next.js, TypeScript, Tailwind CSS, NextAuth, and MongoDB.

## Features

- 🔐 User authentication (sign up/sign in)
- 📝 Create topics for testimonial collection
- 🔗 Generate shareable links for each topic
- 🎥 Record video testimonials directly in the browser
- ⭐ Star ratings (1-5 stars)
- 💬 Text testimonials
- 📊 View all testimonials for each topic

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **UI Components**: Custom components with shadcn/ui design principles

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Saxenaa218/video-record.git
cd video-record
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string and NextAuth secret:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Service Providers (Topic Creators)

1. Sign up for an account
2. Sign in to your dashboard
3. Create a new topic (e.g., "Product Feedback")
4. Copy the generated shareable link
5. Share the link with your customers
6. View submitted testimonials on the topic page

### For Testimonial Submitters

1. Open the shareable link provided
2. (Optional) Record a video testimonial using your camera
3. Fill in your name, email (optional), and testimonial text
4. Select a star rating (1-5 stars)
5. Submit the testimonial

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── topics/       # Topic CRUD operations
│   │   └── testimonials/ # Testimonial submissions
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard and topic management
│   └── submit/           # Public testimonial submission page
├── components/           # React components
│   ├── ui/              # UI components
│   ├── AuthProvider.tsx # NextAuth session provider
│   └── VideoRecorder.tsx # Video recording component
├── lib/                 # Utility functions
│   └── mongodb.ts       # MongoDB connection
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Topic.ts
│   └── Testimonial.ts
└── types/               # TypeScript type definitions

```

## Building for Production

```bash
npm run build
npm start
```

## License

ISC
