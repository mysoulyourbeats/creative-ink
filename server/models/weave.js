import mongoose from 'mongoose'

const spanSchema = mongoose.Schema({
    penName: String,
    color: String,
    userProse: String
})

const weaveSchema = mongoose.Schema({
    title: String,
    prose: {
            type: {        
                   proseArray: {type: [spanSchema]}
                  }
            }

})

export default mongoose.model('WeaveModel', weaveSchema)
