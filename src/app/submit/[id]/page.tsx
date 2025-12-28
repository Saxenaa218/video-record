'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import VideoRecorder from '@/components/VideoRecorder'

interface Topic {
  _id: string
  title: string
  description?: string
}

export default function SubmitTestimonial() {
  const params = useParams()
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTopic(data.topic)
        } else {
          alert('Topic not found')
        }
      } catch (error) {
        console.error('Error fetching topic:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [params.id])

  const handleVideoRecorded = (blob: Blob) => {
    setVideoBlob(blob)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let videoData = null
      if (videoBlob) {
        const reader = new FileReader()
        videoData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(videoBlob)
        })
      }

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic?._id,
          name,
          email,
          rating,
          text,
          videoData,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Failed to submit testimonial')
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      alert('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-600">Topic not found</div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <div className="mb-4 text-green-600">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600">Your testimonial has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
          {topic.description && (
            <p className="text-gray-600 mb-6">{topic.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Record Your Video (Optional)</h2>
              <VideoRecorder onVideoRecorded={handleVideoRecorded} />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email (Optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Your Testimonial *
              </label>
              <textarea
                id="text"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
                placeholder="Share your experience..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
