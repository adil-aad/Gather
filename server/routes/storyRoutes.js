import express from "express"
import { addUserStory, getStories } from "../controllers/storyController.js"
import { upload } from "../configs/multer.js"
import { protect } from "../middleware/auth.js"

const storyRouter = express.Router()

storyRouter.post('/story', upload.single('media'),protect, addUserStory)
storyRouter.get('/story', protect, getStories)

export default storyRouter