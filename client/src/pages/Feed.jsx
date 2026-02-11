import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'

const Feed = () => {

  const [feeds, setfeed] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = async () => {
    setfeed(dummyPostsData)
    setLoading(false)
  }

  useEffect (() => {
    fetchFeed()
  }, [])
  return !loading ?(
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
    items-start justify-center xl:gap-8'>

      {/*stories and post */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>

      {/*Right side */}

      <div>
        <div>
          Sponsored
        </div>
        <h1>Recent Messages</h1>
      </div>

    </div>
  ) : <Loading />
}

export default Feed