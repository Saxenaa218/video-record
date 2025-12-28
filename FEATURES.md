# Video Testimonial App - Feature Overview

## Application Flow

### 1. Authentication Flow
```
User Registration → POST /api/auth/signup → User created in MongoDB
User Login → NextAuth credentials → JWT session → Dashboard access
```

### 2. Topic Creation Flow (Authenticated Users)
```
Dashboard → Create Topic Form → POST /api/topics
  ↓
Topic saved with unique shareableLink (using nanoid)
  ↓
Copy shareable link → Share with customers
```

### 3. Testimonial Submission Flow (Public)
```
Customer opens shared link → /submit/[id]
  ↓
(Optional) Record video using MediaRecorder API
  ↓
Fill form:
  - Name (required)
  - Email (optional)
  - Star rating 1-5 (required)
  - Text testimonial (required)
  ↓
POST /api/testimonials → Saved to MongoDB with base64 video data
  ↓
Success message shown
```

### 4. View Testimonials Flow (Authenticated Users)
```
Dashboard → Click "View Testimonials" on a topic
  ↓
GET /api/testimonials?topicId=[id]
  ↓
Display all testimonials with:
  - Video playback (if recorded)
  - Star rating
  - Text content
  - Submitter name/email
  - Submission date
```

## Pages & Components

### Public Pages
- `/` - Landing page with sign in/up buttons
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/submit/[id]` - Public testimonial submission page

### Protected Pages (Require Authentication)
- `/dashboard` - User dashboard with topic management
- `/dashboard/topics/[id]` - View testimonials for a specific topic

### API Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/topics` - Get user's topics
- `POST /api/topics` - Create new topic
- `GET /api/topics/[link]` - Get topic by shareable link
- `GET /api/testimonials` - Get testimonials for a topic
- `POST /api/testimonials` - Submit new testimonial

### Key Components
- `VideoRecorder` - Handles camera access and video recording
- `AuthProvider` - NextAuth session provider wrapper

## Database Schema

### User Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date
}
```

### Topic Collection
```javascript
{
  title: String (required),
  description: String (optional),
  userId: ObjectId (ref: User, required),
  shareableLink: String (unique, required),
  createdAt: Date
}
```

### Testimonial Collection
```javascript
{
  topicId: ObjectId (ref: Topic, required),
  name: String (required),
  email: String (optional),
  rating: Number (1-5, required),
  text: String (required),
  videoData: String (base64, optional),
  createdAt: Date
}
```

## Security Features

1. **Password Security**: Passwords are hashed using bcryptjs before storage
2. **Authentication**: NextAuth.js with JWT strategy for session management
3. **Authorization**: API routes check authentication before allowing operations
4. **Database Security**: Mongoose ORM prevents SQL injection with parameterized queries
5. **Environment Variables**: Sensitive data stored in environment variables
6. **HTTPS Ready**: Compatible with production HTTPS deployments

## Technology Highlights

### Frontend
- **Next.js 16** with App Router for modern React patterns
- **TypeScript** for type safety
- **Tailwind CSS v3** for utility-first styling
- **MediaRecorder API** for native browser video recording

### Backend
- **NextAuth.js** for authentication
- **MongoDB** with Mongoose for database operations
- **API Routes** for serverless backend functions
- **bcryptjs** for secure password hashing
- **nanoid** for generating unique shareable links

## Video Recording Features

The `VideoRecorder` component provides:
- ✅ Camera permission request
- ✅ Live camera preview
- ✅ Start/stop recording controls
- ✅ Video preview before submission
- ✅ Re-record option
- ✅ Video stored as base64 in MongoDB (for simplicity)

Note: For production, consider using cloud storage (AWS S3, Cloudinary) for video files instead of storing in database.

## Usage Example

1. **Service Provider** (e.g., business owner):
   - Signs up and logs in
   - Creates a topic: "Product Feedback for XYZ"
   - Copies the generated link: `http://app.com/submit/abc123xyz`
   - Shares link via email/social media

2. **Customer**:
   - Opens the shared link
   - Records a video testimonial (or skips)
   - Fills in name, email, rating, and text
   - Submits testimonial

3. **Service Provider**:
   - Views all testimonials in their dashboard
   - Can see video testimonials with star ratings
   - Uses testimonials for marketing/improvement

## Future Enhancement Ideas

- [ ] Export testimonials to CSV/PDF
- [ ] Embed widget for website integration
- [ ] Email notifications on new testimonial
- [ ] Testimonial moderation/approval workflow
- [ ] Analytics dashboard (total views, ratings, etc.)
- [ ] Social media sharing of testimonials
- [ ] Custom branding/themes per user
- [ ] Video cloud storage integration
- [ ] Multi-language support
