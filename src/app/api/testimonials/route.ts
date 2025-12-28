import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import Topic from '@/models/Topic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get('topicId')

    if (!topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const testimonials = await Testimonial.find({ topicId }).sort({ createdAt: -1 })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topicId, name, email, rating, text, videoData } = await request.json()

    if (!topicId || !name || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Verify topic exists
    const topic = await Topic.findById(topicId)
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    const testimonial = await Testimonial.create({
      topicId,
      name,
      email,
      rating,
      text,
      videoData,
    })

    return NextResponse.json(
      { message: 'Testimonial submitted successfully', testimonial },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
