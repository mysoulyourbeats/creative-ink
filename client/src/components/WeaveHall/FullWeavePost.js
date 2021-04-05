import React, { useEffect } from 'react'
import { Container, Paper, Tooltip } from '@material-ui/core'

import '../FullPost/fullpost.css'
import './fullweavepost.css'


const FullWeavePost = (props) => {

    
    const title = props.title
    const spanArray = props.spanArray
    const setIsShowFullPost = props.setIsShowFullPost

    const changeBackground = (index, randomColor) => document.getElementById(index).style.backgroundColor = randomColor

    const removeBackground = (index) => document.getElementById(index).style.backgroundColor = 'transparent'
   
    const hClick = (event) => {if (document.getElementById('weave-paper')?.contains(event.target)){
        } else{
            setIsShowFullPost(false)
        }
    }

    useEffect(() => {

            window.history.pushState(null, null, window.location.href);
            window.onpopstate = () => setIsShowFullPost(false)
            window.history.go(1)
            document.body.style.overflow = 'hidden'

        let timeoutId = setTimeout(() => document.addEventListener('click', hClick), 1)

        document.documentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        document.documentElement.style.cursor = 'pointer'

        return () => {
        document.body.style.overflow = 'visible'
        document.removeEventListener('click', hClick); clearTimeout(timeoutId);
        document.documentElement.style.backgroundColor = 'rgba(39, 37, 37, 0.55)'
        document.documentElement.style.cursor = 'default'}
        //eslint-disable-next-line
    }, [])

    return(
            <div className="full-post-wrapper">
                <Container>
                    <Paper id="weave-paper">
                        <div className="full-post-title padder"><h2>{title}</h2></div>
                        <div className="full-post-prose padder">
                            {
                             spanArray.map((val, index) => 
                                <Tooltip title={val.penName} placement="top" arrow  
                                             >
                                    <span key={index} id={index} style={{ cursor: 'pointer' }} onMouseOver={() => changeBackground(index, val.randomColor)} onMouseOut={() => removeBackground(index)}>{val.userProse}</span>
                                </Tooltip>
                            )}
                        </div>
                    </Paper>
                </Container>
            </div>
    )
}

export default FullWeavePost