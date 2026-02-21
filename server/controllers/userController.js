// getting user data using user id

import { format } from "path"
import imagekit from "../configs/imageKit.js"
import User from "../models/User.js"
import fs from 'fs'
import Connection from "../models/connection.js"
import Post from "../models/Post.js"
import { inngest } from "../inngest/index.js"

export const getUserData = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const user = await User.findById(userId)
        if(!user){
            return res.json({success: false, message: "user not found"})
        }
        res.json({success: true, user})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}

//updatind user data
export const updateUserData = async (req, res) => {
    try {
        const {userId} = await req.auth()
        let {username, bio, location, full_name} = req.body


        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if(tempUser.username !== username){
            const user =await User.findOne({username})
            if(user){
                // already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp'},
                    { width: '512'}
                ]
            })

            updatedData.profile_picture = url
        }


        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp'},
                    { width: '1280'}
                ]
            })

            updatedData.cover_photo = url
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, {new: true})

        res.json({success: true, user, message: "Profile Updated Successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}


// finding user using email, username, location or name


export const dicoverUsers = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const { input } = req.body

        const allUsers = await User.find({
            $or: [
                {username: new RegExp(input, 'i')},
                {email: new RegExp(input, 'i')},
                {full_name: new RegExp(input, 'i')},
                {location: new RegExp(input, 'i')}
            ]
        })

        const filteredUsers = allUsers.filter((user)=> user._id !== userId)
        res.json({success: true, users: filteredUsers})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}

// follow user


export const followUser = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const { id } = req.body

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            return res.json({success: false, message:"Already following this user"})
        }


        user.following.push(id)
        await user.save()
        
        const toUser = await User.findById(id)

        toUser.followers.push(userId)
        await toUser.save()

        res.json({success: true, message: "You are following the user"})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}



// unfollow



export const unfollowUser = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const { id } = req.body

        const user = await User.findById(userId)

        user.following = user.following.filter(user => user !== id)
        await user.save()

        const toUser = await User.findById(id)
        
        toUser.followers = toUser.followers.filter(user => user !== id)
        await toUser.save()


        res.json({success: true, message: "You are no longer following the user"})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}



// send connection request

export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const { id } = req.body

        if (userId === id) {
            return res.json({success: false, message: "You cannot connect with yourself"})
        }

        // checking if user sent more than 20 connection request in the past 24 hours

        const last24Hours = new Date(Date.now() - 24 * 60* 60* 1000)
        const connectionRequest = await Connection.find({from_user_id: userId,
            createdAt: {$gt: last24Hours}
        })
        if(connectionRequest.length >= 20){
            return res.json({success: false, message: "More than 20 connection request sent in the past 24 hours"})

        }

        // cheking if users are already connected

        const connection = await Connection.findOne({
            $or: [
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId},
            ]
        })
        if(!connection){
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })
            await inngest.send({
                name: 'app/connection-request',
                data: {connectionId: newConnection._id}
            })
            
            return res.json({success: true,
            message: "Connection Request sent Successfully"})

        }
        else if(connection && connection.status === 'accepted'){
            return res.json({success: false, message: "Already Connected with the user"})
        }
        return res.json({success: false, message: "Connection request pending"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}

//get User Connections


export const getUserConnections = async (req, res) => {
    try {
        const {userId} = await req.auth()
        const user = await User.findById(userId).populate('connections followers following')
        if(!user){
            return res.json({success: false, message: "User not found"})
        }

        const dedupeUsers = (users) => {
            const userMap = new Map()
            users.forEach((u) => {
                if (u?._id && !userMap.has(u._id)) userMap.set(u._id, u)
            })
            return Array.from(userMap.values())
        }

        const connections = dedupeUsers(user.connections)
        const followers = dedupeUsers(user.followers)
        const following = dedupeUsers(user.following)


        const pendingConnections = (await Connection.find({to_user_id: userId,
        status: 'pending'}).populate('from_user_id')).map(connection => connection.from_user_id)

        res.json({
            success: true,
            connections,
            followers,
            following,
            pendingConnections: dedupeUsers(pendingConnections)
        })


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}

// accept connection request

export const acceptConnectionRequest = async (req, res) => {
    try {
        const {userId} =await req.auth()
        const { id } = req.body

        const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

        if(!connection){
            return res.json({success:false, message: 'Connection not found'})
        }

        if(connection.status === 'accepted'){
            return res.json({success: true, message: 'Connection already accepted'})
        }

        const [user, toUser] = await Promise.all([
            User.findById(userId),
            User.findById(id)
        ])

        if(!user || !toUser){
            return res.json({success:false, message: 'User not found'})
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, {$addToSet: {connections: id}}),
            User.findByIdAndUpdate(id, {$addToSet: {connections: userId}}),
            Connection.findByIdAndUpdate(connection._id, {status: 'accepted'})
        ])

        res.json({success: true, message: 'Connection was accepted'})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})

    }
}


// get user profile

export const getUserProfiles = async (req, res) => {
    try {
        const { profileId} = req.body

        const profile = await User.findById(profileId)

        if(!profile){
            return res.json({success: false, message: "Profile not found"})
        }
        const posts = await Post.find({user: profileId}).populate('user')

        res.json({success: true, profile, posts})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
