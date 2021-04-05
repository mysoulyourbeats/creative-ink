import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {

    try {
        if(req.params?.isAuth === 'false'){
            next()
        } else {
            
            const token = req.cookies['token']
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY)    
            req.userId = decoded.id    
            next()    
        }

    } catch (error) {
        console.log(error)
        res.status(401).send('You arent authenticated bitch')
    }
}

export default auth