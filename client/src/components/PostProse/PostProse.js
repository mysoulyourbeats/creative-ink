import React, { useState, useEffect } from 'react'
import { Container, Grid, Button, Paper, TextField } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Auth from '../Auth/Auth'

import axios from 'axios'

import useStyles from '../styles.js'
import './styles.css'

const url = "https://creative-ink.herokuapp.com"

const PostProse = (props) => {
    
    const title = props?.location?.state?.title
    const prose = props?.location?.state?.prose
    const postId = props?.location?.state?.id

    const classes = useStyles()    
    const [formData, setFormData] = useState({ title: '', prose: '' })
    const [isShowPleaseLogin, setIsShowPleaseLogin] = useState(false)
    const history = useHistory()
    

    useEffect(() => {

        if(title){
            setFormData({ title, prose, postId })
        }

        else
            setFormData({title: '', prose: ''})
        
    }, [title, prose, postId])
    

    const handleChange = (event) => {        
        setFormData( { ...formData, [event.target.name]: event.target.value } )
    }

    const handleSubmit = (event) => {
        event.preventDefault()        
        
        if(title){
            axios.patch(`${url}/${postId}/updateprose`, formData, {withCredentials: true})
            .then((res) => {
                history.push('/drafts')
            })
            .catch((error) => console.log(error))
        } else {
            axios.post(`${url}/postprose`, formData, { withCredentials: true })
            .then((res) => {
                    history.push('/drafts')             
            })
            .catch((error) => console.log(error))
        }

        setFormData({title: '', prose: ''})
    }

    return(
        <>
            { isShowPleaseLogin? <Auth setIsShowPleaseLogin={setIsShowPleaseLogin}/> : null}
            <div className="postprose-wrapper">        
                <Container component="main" maxWidth="md">
                    <Paper  elevation={4}>              
                        <div className="prosetitle" variant="h5" align="center">Drafts</div>                                    
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <Grid container spacing={3}>                      
                                <Grid item xs={12} ><TextField onClick={()=> localStorage.getItem('isAuth') === 'false' ? setIsShowPleaseLogin(true) : null} value={formData.title} required variant="outlined" fullWidth name="title" label="Title" onChange={handleChange} autoFocus /></Grid>
                                <Grid item xs={12} ><TextField onClick={()=> localStorage.getItem('isAuth') === 'false' ? setIsShowPleaseLogin(true) : null} value={formData.prose} required multiline rows={15} variant="outlined" fullWidth name="prose" label="Prose" onChange={handleChange} /></Grid>           
                            </Grid>
                            
                                <Button type="submit" variant="contained" color="primary" className={classes.submit}>Submit</Button>            
                        </form>
                    </Paper>
                </Container>
            </div>
        </>
    )
}

export default PostProse