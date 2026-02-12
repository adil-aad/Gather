import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'

const ProfileModal = () => {
    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        full_name: user.full_name,
    })

    const handle
  return (
    <div>ProfileModal</div>
  )
}

export default ProfileModal