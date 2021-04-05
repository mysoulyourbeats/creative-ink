import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Container, Grid, Button, Paper, TextField } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'

import useStyles from './styles.js'
import './prompts.css'

import axios from 'axios'
const url = "https://creative-ink.herokuapp.com"

const PromptForm = ({id, title, prose, genre, thumbLink, fullLink, text, clearPromptGeneratedTextOrLinkCallback, setIsShowPleaseLogin}) => {
    
    const classes = useStyles()  
    const history = useHistory()
    let [genre_string, setGenre_String] = useState('')

    const [isPromptChosen, setIsPromptChosen] = useState('')
    const [formData, setFormData] = useState({ title: '', prose: '', genre: [], writer: localStorage.getItem('userName'), born: '', thumbLink: '', fullLink: '', text: '' })    
    
    const handleChange = (event) =>  {
        event.target.name === 'genre' ? setGenre_String(event.target.value)
        : setFormData( { ...formData, [event.target.name]: event.target.value } )
    }
    
    useEffect(() => {
        if(id){     
            setGenre_String(genre.join(' #'))
            setFormData({ title, prose, id, genre,
                                writer: localStorage.getItem('userName'), born: '', thumbLink, fullLink, text
                                }) 
        } else {
                    setFormData({ title: formData.title, prose: formData.prose, genre: formData.genre,
                                writer: localStorage.getItem('userName'), born: '', thumbLink, fullLink, text
                                })  
                }
    // eslint-disable-next-line
    }, [id, title, prose, genre,    text, thumbLink, fullLink])
    
    const handleSubmit = (event) => {
        event.preventDefault() 

        genre_string = genre_string.replace(/\s+/g, '')
        if(genre_string === ''){
            formData.genre = "#unbound".split('#')
        }
        else
            {formData.genre = genre_string.split('#')}
            
        if(title){
            axios.patch(`${url}/${id}/updateprose`, formData, {withCredentials: true})
            .then((res) => {
                setGenre_String('')
                history.push('/usedprompts')
            })
            .catch((error) => console.log(error))
        } 
        else if(text === '' && thumbLink === ''){
            setIsPromptChosen('Choose a prompt first from the generator!')
        } 
        else {
            formData.born = moment().format()            

            axios.post(`${url}/postprose`, formData, {withCredentials: true})
            .then()
            .catch( err => {console.log(err)})   

            setFormData({ title: '', prose: '', genre: [], writer: localStorage.getItem('userName'), born: '' })       
            clearPromptGeneratedTextOrLinkCallback()
            setIsPromptChosen('Submitted! Click')
            setGenre_String('')
        }
    }

    return(
        <>  
            <Container className="submit-btn" component="main">
                <Paper className={classes.paper} elevation={4}>                      
                    <form onSubmit={handleSubmit} className={classes.form}>
                        <Grid container spacing={2} >                      
                            <Grid item xs={12} ><TextField onClick={()=> localStorage.getItem('isAuth') === 'false' ? setIsShowPleaseLogin(true) : null} value={formData.title} required variant="outlined" fullWidth name="title" label="Title" onChange={handleChange} /></Grid>
                            <Grid item xs={12} ><TextField onClick={()=> localStorage.getItem('isAuth') === 'false' ? setIsShowPleaseLogin(true) : null} value={formData.prose} required multiline rows={15} variant="outlined" fullWidth name="prose" label="Story" onChange={handleChange} /></Grid>           
                            <Grid item xs={12} ><TextField onClick={()=> localStorage.getItem('isAuth') === 'false' ? setIsShowPleaseLogin(true) : null} value={genre_string} variant="outlined" fullWidth name="genre" label="Genres(use #)" onChange={handleChange} /></Grid>
                        </Grid>
                        
                        <div className="submit-and-error">
                                <div className={(isPromptChosen === 'Submitted! Click') ? "success-submit" : "please-choose-prompt"}>{isPromptChosen} {isPromptChosen === 'Submitted! Click'? <span><Link to="/usedprompts">here</Link> to see your prompts</span> : null}</div>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>   
                        </div>       
                    </form>
                </Paper>
            </Container>
        </>
    )
}

export default PromptForm