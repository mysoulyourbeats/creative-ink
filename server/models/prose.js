import mongoose from 'mongoose'

const proseSchema = mongoose.Schema({
    title: {type: String, required: true},
    prose: {type: String, required: true},
    userId: {type: String, required: true}    
})

export default mongoose.model('ProseModel', proseSchema)