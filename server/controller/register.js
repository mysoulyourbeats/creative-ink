import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signin = async(req, res) => {
    const { email, password } = req.body
   
    try {
        const oldUser = await User.findOne({ email })
        
        if(!oldUser)
             return res.status(404).send('User does not exist')
         
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
          
        if(!isPasswordCorrect) return res.status(400).send('Invalid credentials!')


        const token = jwt.sign({ id: oldUser._id }, process.env.SECRET_KEY)
      
        return res.cookie('token', token, {httpOnly: false, secure: true, sameSite: 'none'}).status(200).send({ name: oldUser.name, id: oldUser._id, token })       

    } catch (error) {
        return res.status(500).send('Something went wrong.')        
    }
}


export const signup = async(req, res) => {
    
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        const oldUser = await User.findOne({ email })
        
        if(oldUser) return res.status(400).send('User already exists!')
        
        if(password !== confirmPassword) return res.status(400).send('Passwords do not match')
        
        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
        const token = jwt.sign({ id: result._id }, process.env.SECRET_KEY)
       
        return res.cookie('token', token, {httpOnly: false, secure: true, sameSite: 'none'}).status(200).send({ name: `${firstName} ${lastName}`, id: result._id, token})
    } catch (error) {
        return res.status(500).send('Something went wrong.')        
    }
}

export const clearcookies = (req, res) => {
    res.clearCookie('token').status(200).send()
}
