import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer
    let progressInterval

    if (viewStory && viewStory.media_type !== 'video') {
      setProgress(0)

      const duration = 10000
      const stepTime = 100
      let elapsed = 0

      progressInterval = setInterval(() => {
        elapsed += stepTime
        setProgress((elapsed / duration) * 100)
      }, stepTime)

      timer = setTimeout(() => {
        setViewStory(null)
      }, duration)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [viewStory, setViewStory])

  if (!viewStory) return null

  const handleClose = () => setViewStory(null)

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return <img src={viewStory.media_url} alt='' className='max-w-full max-h-[84vh] object-contain rounded-2xl shadow-2xl' />
      case 'video':
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            className='max-w-full max-h-[84vh] rounded-2xl shadow-2xl'
            controls
            autoPlay
          />
        )
      case 'text':
        return (
          <div
            className='w-[min(92vw,680px)] min-h-[52vh] rounded-3xl shadow-2xl ring-1 ring-white/20 flex items-center justify-center p-10 text-white text-2xl leading-relaxed text-center'
            style={{
              background: `linear-gradient(180deg, ${viewStory.background_color || '#6d28d9'}, #3b0764)`
            }}
          >
            {viewStory.content}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='fixed inset-0 z-[110] bg-gradient-to-b from-slate-950/95 to-black flex items-center justify-center p-4'>
      <div className='absolute top-0 left-0 w-full h-1 bg-white/15'>
        <div className='h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-100' style={{ width: `${progress}%` }} />
      </div>

      <div className='absolute top-4 left-4 flex items-center gap-3 rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md ring-1 ring-white/20'>
        <img src={viewStory.user?.profile_picture} alt='' className='size-8 rounded-full object-cover border border-white/70' />
        <div className='text-white text-sm font-medium flex items-center gap-1.5'>
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={16} className='text-violet-300' />
        </div>
      </div>

      <button
        onClick={handleClose}
        className='absolute top-4 right-4 rounded-xl bg-black/45 p-2 text-white hover:bg-black/60 transition cursor-pointer backdrop-blur-md ring-1 ring-white/20'
      >
        <X className='w-6 h-6' />
      </button>

      <div className='w-full flex items-center justify-center'>
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViewer
