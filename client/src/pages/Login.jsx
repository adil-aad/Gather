import React from 'react'
import { assets } from '../assets/assets'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='relative min-h-screen flex flex-col lg:flex-row'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0'>
        <img 
          src={assets.bgImage} 
          alt="Background" 
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/80' />
      </div>

      {/* Left Side - Brand Section */}
      <div className='relative flex-1 flex flex-col items-start justify-between p-8 lg:p-16 xl:pl-32 text-white'>
        {/* Logo */}
        <img 
          src={assets.logo} 
          alt="Gather" 
          className='h-12 object-contain'
        />

        {/* Hero Text */}
        <div className='max-w-xl'>
          <h1 className='text-5xl lg:text-7xl font-bold mb-6'>
            Moments that
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300'>
              Matter
            </span>
          </h1>
          <p className='text-xl lg:text-2xl text-white/90 max-w-md'>
            Connect With Your Community
          </p>
        </div>

        {/* Empty space for balance */}
        <div className='h-20' />
      </div>

      {/* Right Side - Login Card */}
      <div className='relative flex-1 flex items-center justify-center p-6 lg:p-12'>
        <div className='w-full max-w-md'>
          {/* Login Card */}
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8'>
            {/* Card Header */}
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Welcome Back
              </h2>
              <p className='text-gray-600'>
                Sign in to continue to Gather
              </p>
            </div>

            {/* Clerk SignIn Component */}
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login