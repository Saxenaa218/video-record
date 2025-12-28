'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Topic {
  _id: string
  title: string
  description?: string
  shareableLink: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchTopics()
    }
  }, [session])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics')
      const data = await response.json()
      setTopics(data.topics || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        setShowCreateForm(false)
        fetchTopics()
      }
    } catch (error) {
      console.error('Error creating topic:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react')
    signOut({ callbackUrl: '/' })
  }

  const copyToClipboard = (link: string) => {
    const fullUrl = `${window.location.origin}/submit/${link}`
    navigator.clipboard.writeText(fullUrl)
    alert('Link copied to clipboard!')
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
              <h1 className="text-xl font-bold">Video Testimonials</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Topics</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {showCreateForm ? 'Cancel' : 'Create Topic'}
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Create New Topic</h3>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
                    placeholder="e.g., Product Feedback"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
                    placeholder="Describe what kind of testimonials you're looking for..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Topic'}
                </button>
              </form>
            </div>
          )}

          {topics.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500">No topics yet. Create your first topic to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <div key={topic._id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                  {topic.description && (
                    <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/submit/${topic.shareableLink}`}
                        className="flex-1 text-xs px-2 py-1 bg-gray-100 rounded border"
                      />
                      <button
                        onClick={() => copyToClipboard(topic.shareableLink)}
                        className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        Copy
                      </button>
                    </div>
                    <Link
                      href={`/dashboard/topics/${topic._id}`}
                      className="block text-center px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                    >
                      View Testimonials
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
