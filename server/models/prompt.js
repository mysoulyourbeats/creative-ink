import mongoose from 'mongoose'

const likeSchema = mongoose.Schema({
    userId: {type: String}
})

const promptSchema = mongoose.Schema({
    title: {type: String, required: true},
    prose: {type: String, required: true},
    userId: {type: String, required: true},
    genre: [String],
    writer: {type: String, required: true},
    like: { type: {
                    count: {type: Number}, 
                    likedBy: {type: [likeSchema]}
                  },
            default: {count: 0, likedBy: []}
          },
    born: {type: Date},
    thumbLink: {type: String, default: 'holyhell'},
    fullLink: String,
    text: String    
})

export default mongoose.model('PromptModel', promptSchema)
