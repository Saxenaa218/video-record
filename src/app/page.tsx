import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold text-center mb-8">
          Video Testimonials
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600">
          Collect authentic video testimonials from your customers
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
