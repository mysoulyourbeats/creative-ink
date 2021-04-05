import React, { useEffect } from 'react'
import { Container, Paper } from '@material-ui/core'
import ProgressiveImage from "react-progressive-graceful-image"

import './fullpost.css'


const FullPost = (props) => {
    
    const title = props.title
    const prose = props.prose
    const writer = !props.writer? localStorage.getItem('userName') : props.writer
    const genre = props.genre
    const genre_string = (genre[0] === '' ? '' : '#') + (genre.join(' #'))
    const setIsShowFullPost = props.setIsShowFullPost
    const text = props.text
    const thumbLink = props.thumbLink
    const fullLink = props.fullLink

    useEffect(() => {

            window.history.pushState(null, null, window.location.href);
            window.onpopstate = () => setIsShowFullPost(false)
            window.history.go(1)
            document.body.style.overflow = 'hidden'

        const handleClick = (event) => {      

            if (document.getElementById('post-paper')?.contains(event.target)){
            } else{
                 setIsShowFullPost(false)
            }
        }
        
        document.documentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        document.documentElement.style.cursor = 'pointer'
        let timeoutId = setTimeout(() => document.addEventListener('click', handleClick))

        return () => {
            document.body.style.overflow = 'visible'
            window.onpopstate = null

            document.removeEventListener('click', handleClick)
            clearTimeout(timeoutId)
            document.documentElement.style.backgroundColor = 'rgba(39, 37, 37, 0.55)'
            document.documentElement.style.cursor = 'default'
        }        
    }, [])

    return(
            <>
                <div className="full-post-wrapper">
                    <Container>
                        { !thumbLink? <div className="full-post-written-prompt">"{text} "</div> : null }                    
                        <Paper id="post-paper">
                        {thumbLink ? <div className="full-post-img">
                                                <ProgressiveImage                  
                                                    src={fullLink}
                                                    placeholder={thumbLink}
                                                >
                                                    {(src, loading) => <img className={ loading ? "thumbnail" : "full-image" } src={src} alt="an alternative text" />}
                                                </ProgressiveImage>
                                         </div> : null
                        }
                            <div className="full-post-title padder"><h2>{title}</h2></div>
                            <div className="full-post-prose padder">{prose}</div>
                            <div className="full-post-genre padder">{genre_string}</div>
                            <div className="full-post-writer padder">- {writer}</div>
                        </Paper>
                    </Container>
                </div>
            </>
    )
}

export default FullPost