import React, { useEffect, useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoriesBar = () => {
  const { getToken } = useAuth()

  const [stories, setStories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [viewStory, setViewStory] = useState(null)

  const fetchStories = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/story/get', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setStories(data.stories)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl px-4'>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-semibold tracking-wide text-violet-800'>Stories</p>
        <span className='inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700'>
          <Sparkles className='h-3.5 w-3.5' />
          Fresh
        </span>
      </div>

      <div className='no-scrollbar overflow-x-auto'>
        <div className='flex gap-3 pb-5'>
          <button
            onClick={() => setShowModal(true)}
            className='group relative min-w-30 max-w-30 aspect-[3/4] rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-100 via-fuchsia-50 to-white shadow-sm hover:shadow-md transition overflow-hidden'
          >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-violet-500/10 to-fuchsia-500/20 transition' />
            <div className='h-full flex flex-col items-center justify-center p-4'>
              <div className='mb-3 size-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white flex items-center justify-center shadow'>
                <Plus className='w-5 h-5' />
              </div>
              <p className='text-sm font-semibold text-violet-900 text-center'>Create Story</p>
            </div>
          </button>

          {stories.map((story) => (
            <button
              onClick={() => setViewStory(story)}
              key={story._id}
              className='group relative min-w-30 max-w-30 aspect-[3/4] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] overflow-hidden text-left'
              style={{
                background:
                  story.media_type === 'text'
                    ? `linear-gradient(180deg, ${story.background_color || '#6d28d9'}, #4c1d95)`
                    : 'linear-gradient(180deg, #312e81, #4c1d95)'
              }}
            >
              {story.media_type !== 'text' && (
                <div className='absolute inset-0'>
                  {story.media_type === 'image' ? (
                    <img src={story.media_url} alt='' className='h-full w-full object-cover opacity-75 group-hover:scale-105 transition duration-500' />
                  ) : (
                    <video src={story.media_url} className='h-full w-full object-cover opacity-75 group-hover:scale-105 transition duration-500' />
                  )}
                </div>
              )}

              <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/65' />
              <img
                src={story.user?.profile_picture}
                alt=''
                className='absolute z-10 size-8 top-3 left-3 rounded-full ring-2 ring-white/80 shadow'
              />
              <p className='absolute z-10 left-3 right-3 bottom-7 text-white/90 text-xs line-clamp-2'>
                {story.content || story.user?.full_name}
              </p>
              <p className='absolute z-10 bottom-2 right-2 text-[10px] text-white/80'>
                {moment(story.createdAt).fromNow()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {showModal && <StoryModel setShowModal={setShowModal} fetchStories={fetchStories} />}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar
