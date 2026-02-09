import React, { useEffect } from 'react'
import { dummyStoriesData } from '../assets/assets'

const StoriesBar = () => {

    const [stories, setStories] = useState([])

    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }
    useEffect(() =>{
        fetchStories()
    }, [])
  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>

        <div className='flex gap-4 pb-5'>
            {/*Add Story card */}
            <div className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg
            transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to white'>

            </div>

            {/*story cards */}

        </div>
        
    </div>
    
  )
}

export default StoriesBar