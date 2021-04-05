import React, { useEffect } from 'react';
import { Container, Paper } from '@material-ui/core'

const FullDraft = (props) => {

    const title = props.title
    const prose = props.prose
    const setIsShowFullPost = props.setIsShowFullPost

    useEffect(() => {
                window.history.pushState(null, null, window.location.href);
                window.onpopstate = () => setIsShowFullPost(false)
                window.history.go(1)
                document.body.style.overflow = 'hidden'

        const handleClick = (event) => {      

            if (document.getElementById('draft-paper')?.contains(event.target)){
            } else{
                setIsShowFullPost(false)
            }
        }

        document.documentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        document.documentElement.style.cursor = 'pointer'
        let timeoutId = setTimeout(() => document.addEventListener('click', handleClick))

        return () => {
            window.onpopstate = null
            document.body.style.overflow = 'visible'

            document.removeEventListener('click', handleClick)
            clearTimeout(timeoutId)
            document.documentElement.style.backgroundColor = 'rgba(39, 37, 37, 0.55)'
            document.documentElement.style.cursor = 'default'
        }        
    }, [])

    return (
        <div className="full-post-wrapper">
                <Container>
                    <Paper id="draft-paper">
                        <div className="full-post-title padder"><h2>{title}</h2></div>
                        <div className="full-post-prose padder">{prose}</div>
                    </Paper>
                </Container>
            </div>
    )
}

export default FullDraft