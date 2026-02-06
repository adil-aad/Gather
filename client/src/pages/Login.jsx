import React from 'react'
import { assets } from '../assets/assets'
import bgImage from '../assets/bgImage.png'

const Login = () => {
  return (
    <div className='relative min-h-screen flex flex-col md:flex-row'>
      {/* BG image */}
      <img src={bgImage} alt="" className='absolute top-0 left-0 z-0 w-full h-full object-cover'/>
      {/* side */}

      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 relative z-10'>
        <img src={assets.logo} alt="Logo" className='h-12 object-contain'/>
      </div>
    </div>
  )
}

export default Login