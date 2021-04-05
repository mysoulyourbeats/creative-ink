import express from 'express'
import { signup, signin, clearcookies } from '../controller/register.js'
import { postprose, getprose, updateprose, deleteprose } from '../controller/crud.js'
import likestory  from '../controller/like.js'
import { postWeave, getWeave } from '../controller/weave.js'
import auth from '../middleware/auth.js'
import axios from 'axios'

const router = express.Router()

const genre = ['digital-art', 'science-fiction', 'fantasy']
const deviant = 'https://www.deviantart.com/api/v1/oauth2/browse/topic'
const filters = '&with_session=false&mature_content=false'
const rand = (x) => Math.floor(Math.random() * (x))
const index = rand(genre.length)

router.get('/getDeviantToken', async(req, res) => {
    const request_token_url = process.env.REQUEST_TOKEN_URL

    try {
        const result = await axios.get(request_token_url)
        return res.status(200).send(result.data)
    } catch (error) {
        console.log(error)
    }  
})

router.get('/:token/deviant_prompt', async(req, res) => {

    const token = req.params.token
    try {
        const result = await axios.get(`${deviant}?topic=${genre[index]}&offset=${genre[index] === 'digital-art' ? rand(820) : rand(999)}&limit=1&${filters}&access_token=${token}`)
        return res.status(200).send(result.data)
    } catch (error) {
        return res.status(401).send()
    }
})


// ================
//      REGISTER
// ================
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/clearcookies', clearcookies)

// ================
//      CRUD
// ================
router.post('/postprose', auth, postprose)
router.patch('/:postId/updateprose', auth, updateprose)
router.delete('/:postId/:type/deleteprose', auth, deleteprose)
router.get('/:type/getprose', auth, getprose)
router.get('/:isAuth/:type/gethallprose', auth, getprose)
router.patch('/:postId/likestory', auth, likestory)


// ================
//      WEAVE
// ================
router.get('/getWeave', getWeave)
router.post('/postWeave', postWeave)

export default router
