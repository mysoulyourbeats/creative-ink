import WeaveModel from '../models/weave.js'

export const postWeave = async(req, res) => {
    let { spanArray, title }  = req.body

    if(title === '')
        title = 'Once upon a time'

    try {
        await WeaveModel.create({ title, prose: spanArray })
        return res.status(200).send()
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}

export const getWeave = async(req, res) => {

    try {
        const result = await WeaveModel.find({})
        if(result.length)
            return res.status(200).send({ result }) 
        else return res.status(404).send()       

    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
    
}