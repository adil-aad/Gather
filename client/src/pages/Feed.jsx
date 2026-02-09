import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'

const Feed = () => {

  const [feed, setfeed] = useState([])
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
        <h1>Stories</h1>
        <div className='p-4 space-y-6'>
          List of Post
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