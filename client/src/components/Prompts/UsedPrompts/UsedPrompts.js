import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import DisplayPromptCard  from './DisplayPromptCard'

import axios from 'axios'
import './displaypromptcard.css'

const url = 'https://creative-ink.herokuapp.com'

const UsedPrompts = () => {
    const [promptData, setPromptData] = useState([])
    const [isNoPromptTaken, setIsNoPromptTaken] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    // eslint-disable-next-line
    const[id, setId] = useState('')

    const callback = (id) => {
            const index = promptData.findIndex((val) => val.id === id)
    
            if(index !== -1) {
               promptData.splice(index, 1) 
               setId(id)   
            }
            else
                {console.log('User ID is invalid')}
        }
    
    useEffect(() => {
        setIsLoading('Loading')
        axios.get(`${url}/prompt/getprose`, {withCredentials: true})
        .then(res => {
            setIsLoading(null)
            res.data.result.map((val) => (
                setPromptData((prev) => [...prev, { title: val.title, prose: val.prose, id: val._id, genre: val.genre, like: val.like.count, 
                                                    thumbLink: val.thumbLink, fullLink: val.fullLink, text: val.text, isLiked: val.isLiked }])
                            ))
        })
        .catch(err => {console.log(err); setIsLoading(null); setIsNoPromptTaken(true)}) 
    },[])
    
    return(
        <div className="display-prompt-container">
            {   
                    isLoading ? 
                    <div className="loader-wrapper">
                    <p style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div className="loading-font">
                                <div><h2>{isLoading}</h2></div>                    
                            </div> 

                            <div class="sk-cube-grid">
                                <div class="sk-cube sk-cube1"></div>
                                <div class="sk-cube sk-cube2"></div>
                                <div class="sk-cube sk-cube3"></div>
                                <div class="sk-cube sk-cube4"></div>
                                <div class="sk-cube sk-cube5"></div>
                                <div class="sk-cube sk-cube6"></div>
                                <div class="sk-cube sk-cube7"></div>
                                <div class="sk-cube sk-cube8"></div>
                                <div class="sk-cube sk-cube9"></div>
                            </div>
                        </p>
                    </div> : null
                }
                
            {   isNoPromptTaken? 
                    <div className="oopsie">
                        <div><h2>No prompts <br/>taken yet!</h2></div>
                        <Link to="/prompts"><Button size="large" variant="outlined" className="oopsie-btn">Take a prompt</Button></Link>
                    </div>
                     :                
                    promptData.map((val) =>  (                                                
                                                        <DisplayPromptCard 
                                                            title={val.title} prose={val.prose} key={val.id} id={val.id} genre={val.genre} like={val.like} 
                                                            thumbLink={val.thumbLink} fullLink={val.fullLink} 
                                                            text={val.text} callback={callback}
                                                            isLiked={val.isLiked}
                                                        />                                    
                                            )
                                )
                
                
            }
        </div>
    )
}

export default UsedPrompts