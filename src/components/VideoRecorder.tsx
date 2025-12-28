'use client'

import { useRef, useState, useEffect } from 'react'

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void
}

export default function VideoRecorder({ onVideoRecorded }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(mediaStream)
      setHasPermission(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const startRecording = () => {
    if (!stream) return

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    })

    mediaRecorderRef.current = mediaRecorder
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      setRecordedChunks([blob])
      onVideoRecorded(blob)
      setIsPreviewing(true)
      stopCamera()
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const resetRecording = () => {
    setRecordedChunks([])
    setIsPreviewing(false)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={!isPreviewing}
          className="w-full h-full object-cover"
          src={isPreviewing && recordedChunks.length > 0 ? URL.createObjectURL(recordedChunks[0]) : undefined}
        />
        {!hasPermission && !isPreviewing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg">Camera not started</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {!hasPermission && !isPreviewing && (
          <button
            onClick={startCamera}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Start Camera
          </button>
        )}

        {hasPermission && !isRecording && !isPreviewing && (
          <>
            <button
              onClick={startRecording}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Start Recording
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Stop Camera
            </button>
          </>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 animate-pulse"
          >
            Stop Recording
          </button>
        )}

        {isPreviewing && (
          <button
            onClick={resetRecording}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Re-record
          </button>
        )}
      </div>
    </div>
  )
}
