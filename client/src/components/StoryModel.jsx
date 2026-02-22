import { useAuth } from '@clerk/clerk-react'
import { ArrowLeft, Sparkles, TextIcon, Upload, Image as ImageIcon, Film } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const StoryModel = ({ setShowModal, fetchStories }) => {
  const bgColors = ['#6d28d9', '#7c3aed', '#a21caf', '#be185d', '#2563eb', '#0f766e']

  const [media, setMedia] = useState(null)
  const [mode, setMode] = useState('text')
  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  const { getToken } = useAuth()

  const MAX_VIDEO_DURATION = 60
  const MAX_VIDEO_SIZE = 50

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('video')) {
      if (file.size > MAX_VIDEO_SIZE * 1024 * 1024) {
        toast.error(`Video size cannot exceed ${MAX_VIDEO_SIZE} MB`)
        setMedia(null)
        setPreviewUrl(null)
        return
      }

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error('Video duration cannot exceed 1 minute')
          setMedia(null)
          setPreviewUrl(null)
        } else {
          setMedia(file)
          setPreviewUrl(URL.createObjectURL(file))
          setText('')
          setMode('media')
        }
      }
      video.src = URL.createObjectURL(file)
    } else if (file.type.startsWith('image')) {
      setMedia(file)
      setPreviewUrl(URL.createObjectURL(file))
      setText('')
      setMode('media')
    }
  }

  const handleCreateStory = async () => {
    const mediaType = mode === 'media' ? (media?.type?.startsWith('image') ? 'image' : 'video') : 'text'

    if (mediaType === 'text' && !text.trim()) {
      throw new Error('Please enter some text')
    }

    if (mediaType !== 'text' && !media) {
      throw new Error('Please select media')
    }

    const formData = new FormData()
    formData.append('content', text)
    formData.append('media_type', mediaType)
    if (media) formData.append('media', media)
    formData.append('background_color', background)

    const token = await getToken()

    try {
      const { data } = await api.post('/api/story/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setShowModal(false)
        toast.success('Story Created Successfully')
        fetchStories()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='fixed inset-0 z-[110] min-h-screen bg-slate-950/75 backdrop-blur-md text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md rounded-3xl border border-violet-300/30 bg-gradient-to-b from-violet-900/60 via-fuchsia-900/40 to-slate-900/80 shadow-2xl p-4 sm:p-5'>
        <div className='mb-4 flex items-center justify-between'>
          <button onClick={() => setShowModal(false)} className='rounded-xl bg-white/10 p-2 hover:bg-white/20 transition cursor-pointer'>
            <ArrowLeft className='h-5 w-5' />
          </button>
          <h2 className='text-lg font-semibold tracking-wide'>Create Story</h2>
          <span className='w-9' />
        </div>

        <div className='relative rounded-2xl h-96 overflow-hidden ring-1 ring-white/20' style={{ backgroundColor: background }}>
          <div className='absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20' />

          {mode === 'text' && (
            <textarea
              className='relative z-10 bg-transparent text-white placeholder:text-white/65 w-full h-full p-6 text-lg resize-none focus:outline-none'
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === 'media' && previewUrl && (
            <div className='relative z-10 h-full w-full flex items-center justify-center bg-black/35'>
              {media?.type?.startsWith('image') ? (
                <img src={previewUrl} alt='' className='object-contain max-h-full max-w-full' />
              ) : (
                <video src={previewUrl} className='object-contain max-h-full max-w-full' controls />
              )}
            </div>
          )}
        </div>

        <div className='mt-4 flex gap-2'>
          {bgColors.map((color) => (
            <button
              key={color}
              className={`h-7 w-7 rounded-full transition ring-offset-2 ring-offset-transparent cursor-pointer ${
                background === color ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/30'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        <div className='mt-4 grid grid-cols-2 gap-2'>
          <button
            onClick={() => {
              setMode('text')
              setMedia(null)
              setPreviewUrl(null)
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-2.5 cursor-pointer transition ${
              mode === 'text' ? 'bg-white text-violet-800 font-medium' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <TextIcon size={18} />
            Text
          </button>

          <label
            className={`flex items-center justify-center gap-2 rounded-xl p-2.5 cursor-pointer transition ${
              mode === 'media' ? 'bg-white text-violet-800 font-medium' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <input onChange={handleMediaUpload} type='file' accept='image/*, video/*' className='hidden' />
            {media?.type?.startsWith('video') ? <Film size={18} /> : <ImageIcon size={18} />}
            <Upload size={16} />
            Media
          </label>
        </div>

        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: 'Saving...',
              success: 'Story posted',
              error: (err) => err.message || 'Story failed'
            })
          }
          className='mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 py-3 text-white font-medium shadow-[0_10px_24px_rgba(124,58,237,0.35)] hover:brightness-110 active:scale-[0.99] transition cursor-pointer'
        >
          <Sparkles size={18} />
          Publish Story
        </button>
      </div>
    </div>
  )
}

export default StoryModel
