import Prose from '../models/prose.js'
import Prompt from '../models/prompt.js'
import mongoose from 'mongoose'

export const getprose = async(req, res) => {
    
    const { type } = req.params
    const userId = req.userId

    let result
    try {

        if(type === 'hall'){
  
            result = await Prompt.find({}, {"id": 0}).sort({ born: -1}).lean() /* i.e., include all columns except the damned ID column*/
            // FOR SETTING isLiked bool to each result object by checking if user has liked a particular post
            if(userId){
                result = await Promise.all(result.map(async(val) => {
                    if(await Prompt.findOne({'like.likedBy.userId': userId, '_id': val._id}, '_id')){
                        val.isLiked = true
                    } else {
                        val.isLiked = false
                    }
                    return val
               }))
           }
       }    
       
       else if(type === 'prompt'){

            result = await Prompt.find({ userId }).sort({ born: -1}).lean()
            if(userId){
                result = await Promise.all(result.map(async(val) => {
                    if(await Prompt.findOne({'like.likedBy.userId': userId, '_id': val._id}, '_id')){
                        val.isLiked = true
                    } else {
                        val.isLiked = false
                    }
                    return val
                }))
            }
        }

        else{
            result = await Prose.find({ userId })
        }
        
        if(result?.length === 0)
            return res.status(404).send()
           
        return res.status(200).send({ result })        

    } catch (error) {
        console.log(error)
        return res.status(404).send()
    }
}


export const postprose = async(req, res) => {

    const userId = req.userId
    const { title, prose, genre, writer, born, thumbLink, fullLink, text } = req.body

    try {
        if(genre){
            await Prompt.create({ title, prose, userId, genre, writer, born, thumbLink, fullLink, text })
        }
        else{
            await Prose.create({ title, prose, userId }) 
        }
        return res.status(200).send()

    } catch (error) {     
        console.log(error)
        return res.status(404).send()
    }
}


export const updateprose = async(req, res) => {
    
    const { postId } = req.params
    const { title, prose, genre, writer, thumbLink, fullLink, text } = req.body
   
    if(!mongoose.Types.ObjectId.isValid(postId)){
            console.log('User ID is not valid')
            return res.status(404).send()
        }
    
    try {        
        if(genre){
            // console.log('updated prompt post')
            await Prompt.findByIdAndUpdate(postId, {  title, prose, genre, writer, thumbLink, fullLink, text }).sort({ born: -1})
        } else {
            // console.log('updated prose post')
            await Prose.findByIdAndUpdate(postId, { title, prose })
        }
        return res.status(200).send()

    } catch (error) {
        console.log(error)
        return res.status(404).send()
    }
}

export const deleteprose = async(req, res) => {
    
    const { postId, type } = req.params
  
    try {
        if(type === 'prompt'){
            await Prompt.findByIdAndDelete(postId)
        }
        else{
            await Prose.findByIdAndDelete(postId)
        }

        res.status(200).send()
        
    } catch (error) {
        console.log(error)
        res.status(404).send()
    }
}

