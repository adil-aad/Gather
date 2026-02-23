import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Messages = () => {

  const { connections } = useSelector((state) => state.connections)
  const uniqueConnections = Array.from(new Map(connections.map((u) => [u._id, u])).values())

  const navigate = useNavigate()

  return (
    <div className='min-h-screen relative bg-slate-50 dark:bg-slate-900'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title*/}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2 dark:text-slate-100'>Messages</h1>
          <p className='text-slate-600 dark:text-slate-300'>Talk To your Community</p>
        </div>

        {/* connected Users*/}
        <div className='flex flex-col gap-3'>
          {uniqueConnections.map((user)=>(
            <div key={user._id} className='max-w-xl flex flex-wrap gap-5 p-6 
            bg-white shadow rounded-md dark:bg-slate-800'>
              <img src={user.profile_picture} alt="" className='rounded-full size-12 mx-auto'/>
              <div className='flex-1'>
                <p className='font-medium text-slate-700 dark:text-slate-100'>{user.full_name}</p>
                <p className='text-slate-500 dark:text-slate-300'>@{user.username}</p>
                <p className='text-sm text-gray-600 dark:text-slate-300'>{user.bio}</p>
              </div>

              <div className='flex flex-col gap-2 mt-4'>
                <button onClick={()=>navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100'>
                  <MessageSquare className='w-4 h-4'/>
                </button>

                <button onClick={()=>navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100'>
                  <Eye className='w-4 h-4'/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Messages
