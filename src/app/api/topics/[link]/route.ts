import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Topic from '@/models/Topic'

export async function GET(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    await dbConnect()

    const topic = await Topic.findOne({ shareableLink: params.link })

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ topic })
  } catch (error) {
    console.error('Get topic by link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
