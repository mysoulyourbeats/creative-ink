import React, { useState, useEffect } from 'react'
import DisplayPromptCard from '../Prompts/UsedPrompts/DisplayPromptCard'


import axios from 'axios'
import './Hall.css'

const url = "https://creative-ink.herokuapp.com"
const Hall = () => {
    const [promptData, setPromptData] = useState([])
    const [isLoading, setIsLoading] = useState(null)
    
    useEffect(() => {
        setIsLoading('Loading')
        axios.get(`${url}/${localStorage.getItem('isAuth')}/hall/gethallprose`, {withCredentials: true})
        .then(res => {
            setIsLoading(null)
            res.data.result.map((val) => (
            setPromptData((prev) => [...prev, { title: val.title, prose: val.prose, id: val._id, genre: val.genre, like: val.like.count, thumbLink: val.thumbLink, fullLink: val.fullLink, text: val.text, 
                                                writer: val.writer, isLiked: val.isLiked
                                            }])
                            ))     
        })
        .catch(error => console.log(error))
    }, [])


    return(

       <>
            {   isLoading ? 
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
            <div className="display-prompt-container">
                {promptData.map((val) =>  (
                                                <DisplayPromptCard title={val.title} prose={val.prose} key={val.id} 
                                                                   id={val.id} genre={val.genre} like={val.like} 
                                                                   thumbLink={val.thumbLink} fullLink={val.fullLink} 
                                                                   text={val.text}
                                                                   isHall={true}
                                                                   writer={val.writer}
                                                                   isLiked={val.isLiked}                                                           
                                                />
                                          )
                                )
                }
            </div>
       </>
    )
}

export default Hall