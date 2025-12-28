# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/video-testimonials
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## First Steps

### As a Service Provider:
1. Click **"Sign Up"** on the homepage
2. Create an account with email and password
3. Sign in to access your dashboard
4. Click **"Create Topic"**
5. Enter a title (e.g., "Product Feedback")
6. Copy the generated shareable link
7. Share it with your customers via email or social media

### As a Customer (Testimonial Submitter):
1. Open the shared link
2. (Optional) Click **"Start Camera"** to record a video
3. Fill in your details:
   - Name (required)
   - Email (optional)
   - Select star rating (1-5)
   - Write your testimonial
4. Click **"Submit Testimonial"**
5. Done! 🎉

## Project Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Common Issues

### MongoDB Connection Error
**Problem:** Cannot connect to MongoDB  
**Solution:** Ensure MongoDB is running and MONGODB_URI is correct

For local MongoDB:
```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb
# Start MongoDB: mongod --dbpath /path/to/data
```

For cloud MongoDB (recommended):
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Replace MONGODB_URI in .env.local

### Camera Permission Denied
**Problem:** Video recording doesn't work  
**Solution:** 
- Allow camera/microphone permissions in browser
- Use HTTPS in production (required for camera access)
- Check browser console for specific errors

### Build Errors
**Problem:** `npm run build` fails  
**Solution:**
- Ensure all dependencies are installed: `npm install`
- Clear .next folder: `rm -rf .next`
- Try again: `npm run build`

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- Set Node.js version to 18+
- Set build command: `npm run build`
- Set start command: `npm start`
- Configure environment variables

## Video Storage Note

⚠️ **Current Implementation**: Videos are stored as base64 strings in MongoDB. This works for demos but is not recommended for production with many/large videos.

**For Production**, integrate cloud storage:
- AWS S3
- Cloudinary
- Azure Blob Storage
- Google Cloud Storage

## Need Help?

- Check `README.md` for detailed documentation
- Check `FEATURES.md` for feature overview
- Review code comments in source files
- Check browser console for errors

## Tech Stack Reference

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Auth | NextAuth.js |
| Database | MongoDB + Mongoose |
| Encryption | bcryptjs |
| Video | MediaRecorder API |

## License
ISC
