import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import axios from 'axios'

import APIcard from './APIcard'
import PromptForm from './PromptForm'
import Auth from '../../Auth/Auth'
import './prompts.css'

const reddit = 'https://www.reddit.com/r/WritingPrompts/random.json'

const url = 'https://creative-ink.herokuapp.com'

const Prompts = (props) => {

    const [text, setText] = useState('')
    const [thumbLink, setThumbLink] = useState('')
    const [fullLink, setFullLink] = useState('')
    const [token, setToken] = useState('')
    const [needToken, setNeedToken] = useState(false)
    const [isShowPleaseLogin, setIsShowPleaseLogin] = useState(false)
    const  isAuth = localStorage.getItem('isAuth')

    useEffect(() => {
        if(props?.location?.state){
            setText(props.location.state.text)
            setThumbLink(props.location.state.thumbLink)
            setFullLink(props.location.state.fullLink)
        }
    }, [props.location.state])

    const clearPromptGeneratedTextOrLinkCallback = () => {
        setText('')
        setFullLink('')
    }

    useEffect(() => {        
        if(localStorage.getItem('access_token')){
            setToken(localStorage.getItem('access_token'))
        }

        const hash = props?.location?.state?.hash       
        if (hash && document.getElementById(hash)) {
            document.getElementById(hash).scrollIntoView({behavior: "smooth"})
        } else {
            window.scrollTo(0, 0)
        }
    }, [props?.location?.state?.hash])

    
    useEffect(() => {
        if(needToken){
            localStorage.setItem('access_token', token)
            picturecall()
        }
        // eslint-disable-next-line
    }, [token, needToken])

    const getToken = () => {
        axios.get(`${url}/getDeviantToken`)
        .then(res =>    {
                            setToken(res.data.access_token) 
                            setNeedToken(true)                                                   
                         })
        .catch(error => console.log(error))
    }
 
    const picturecall = () => {

        if(fullLink === '')
           { setText('Your picture is arriving! Please wait a sec :)')}
        else{    
            setText('')
        }

        if(token === ''){
            getToken()

        } else{
            axios.get(`${url}/${token}/deviant_prompt`)
            .then(res => {
                
                if(res.data?.results[0]?.category !== 'Visual Art'){
                    // IF it isn't an image, call again
                    picturecall()
                } else {
                    setText('')
                    setThumbLink(res.data?.results[0]?.thumbs[1]?.src)
                    setFullLink(res.data?.results[0]?.preview?.src)                    
                }
            })
            .catch(error => {
                                if(error.response?.request?.status === 401){
                                                                             localStorage.removeItem('access_token')
                                                                             getToken()
                                } else{console.log(error)}
                            }
                  )
        }
    }

    const writtencall = () => {
        setText('Prompt is arriving!       Please wait a sec :)   ')
        axios.get(reddit)
        .then((res) => {            
            setText(res.data[0].data.children[0].data.title.substring(4))
        })
        .catch((error) => console.log(error))
    }

    return(
        <div  className="boss">
           { isShowPleaseLogin? <Auth setIsShowPleaseLogin={setIsShowPleaseLogin}/> : null}
            <div className="prompt-page-title-section">
                <h1 className="prompt-page-title">{props.location.state? 'Update piece' : 'Prompt Generator'}</h1>
                {props.location.state? null : <p>Pick a writing prompt or a picture prompt</p> }
                
                {isAuth === 'true'? <Link to="/usedprompts"><Button size="large" variant="outlined">See Prompts Taken</Button></Link> : null }     
                
            </div>

                    <div className="prompt-wrapper">
                        
                            <div className="btn-and-card">
                                    <APIcard thumbLink={thumbLink} fullLink={fullLink} text={text} />

                                    { props?.location?.state ? 

                                        <div className="prompt-button-div">                                                            
                                        </div> : 
                                        <div className="prompt-button-div">                
                                            <Button size="large" variant="outlined" onClick={picturecall} className="picture-prompt-btn">Picture Prompt</Button>
                                            <Button size="large" variant="outlined" onClick={writtencall}>Written Prompt</Button>                   
                                        </div>
                                    }
                            </div>     
    
                            <div id="box" className="form-ultimatum"><PromptForm id={props?.location?.state?.id} title={props?.location?.state?.title} 
                                                                                 prose={props?.location?.state?.prose} genre={props?.location?.state?.genre}
                                                                                 thumbLink={thumbLink} fullLink={fullLink} text={text} 
                                                                                 clearPromptGeneratedTextOrLinkCallback={clearPromptGeneratedTextOrLinkCallback} 
                                                                                 setIsShowPleaseLogin={setIsShowPleaseLogin}
                                                                     />
                            </div>
                    </div>         
              
        </div>

    )
}

export default Prompts
