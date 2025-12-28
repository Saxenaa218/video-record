'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Testimonial {
  _id: string
  name: string
  email?: string
  rating: number
  text: string
  videoData?: string
  createdAt: string
}

interface Topic {
  _id: string
  title: string
  description?: string
}

export default function TopicTestimonials() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, params.id])

  const fetchData = async () => {
    try {
      // In a real app, you'd want to verify the user owns this topic
      const topicResponse = await fetch(`/api/topics/${params.id}`)
      if (topicResponse.ok) {
        const topicData = await topicResponse.json()
        setTopic(topicData.topic)
      }

      const testimonialsResponse = await fetch(`/api/testimonials?topicId=${params.id}`)
      if (testimonialsResponse.ok) {
        const data = await testimonialsResponse.json()
        setTestimonials(data.testimonials || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-primary hover:opacity-80">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-2">{topic?.title}</h1>
          {topic?.description && (
            <p className="text-gray-600 mb-6">{topic.description}</p>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Testimonials ({testimonials.length})
            </h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500">No testimonials yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                      {testimonial.email && (
                        <p className="text-sm text-gray-600">{testimonial.email}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {testimonial.videoData && (
                    <div className="mb-4">
                      <video
                        controls
                        className="w-full max-w-2xl rounded-lg"
                        src={testimonial.videoData}
                      />
                    </div>
                  )}

                  <p className="text-gray-700 whitespace-pre-wrap">{testimonial.text}</p>

                  <p className="text-sm text-gray-500 mt-4">
                    Submitted on {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
