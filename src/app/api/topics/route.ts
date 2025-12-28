import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import Topic from '@/models/Topic'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const topics = await Topic.find({ userId: session.user.id }).sort({ createdAt: -1 })

    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Get topics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const shareableLink = nanoid(10)

    const topic = await Topic.create({
      title,
      description,
      userId: session.user.id,
      shareableLink,
    })

    return NextResponse.json(
      { message: 'Topic created successfully', topic },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create topic error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
