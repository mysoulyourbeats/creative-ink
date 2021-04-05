import React, { useState } from 'react'
import { Container, Paper } from '@material-ui/core'
import ProgressiveImage from "react-progressive-graceful-image"

import { Link } from 'react-router-dom'
import axios from 'axios'

import './displaypromptcard.css'
import heart from '../../../Images/heart.png'
import unheart from '../../../Images/unheart.png'
import edit from '../../../Images/edit.png'
import trash from '../../../Images/delete.png'
import useStyles from '../../styles.js'

import Auth from '../../Auth/Auth.js'

import FullPost from '../../FullPost/FullPost'
const url = "https://creative-ink.herokuapp.com"

const DisplayPromptCard = ({ title, prose, id, genre, like, thumbLink, fullLink, text, callback, isHall, writer, isLiked }) => {
    const classes = useStyles()   
    const [likeCount, setLikeCount] = useState(like)
    const [canDislike, setCanDislike] = useState(isLiked)
    const [isShowPleaseLogin, setIsShowPleaseLogin] = useState(false)
    const [isShowFullPost, setIsShowFullPost] = useState(false)

    const genre_string = (genre[0] === '' ? '' : '#') + (genre.join(' #'))
    
    const prompt = text.split(' ').slice(0,5).join(' ')
    const deletePrompt = () => {

        axios.delete(`${url}/${id}/prompt/deleteprose`, {withCredentials: true})
        .then((res) => {
            callback(id)
        })
        .catch((error) => console.log(error))
    }

    const likeIncrDecr = () => {

        if(localStorage.getItem('isAuth') === 'true'){
            if(canDislike){
                setLikeCount(prev => prev - 1)
                setCanDislike(false)
            } else {
                setLikeCount(prev => prev + 1)
                setCanDislike(true)
            }
        } else {
            setIsShowPleaseLogin(true)
        }

        axios.patch(`${url}/${id}/likestory`, {}, {withCredentials: true})
        .then()
        .catch(error => {           
            console.log(error)
        })
    }

    return(
        <>
          {isShowPleaseLogin ? <Auth setIsShowPleaseLogin={setIsShowPleaseLogin} redirectUrl={'hall'}/> : null }
          {isShowFullPost ? <FullPost setIsShowFullPost={setIsShowFullPost} title={title} prose={prose} id={id} 
                                                                        genre={genre} like={like} thumbLink={thumbLink} 
                                                                        fullLink={fullLink} text={text} writer={writer}
                                                                        /> : null }
          <div className="used-prompts-wrapper">
                <Container className={classes.paper}>
                    <Paper>

                           <div style={{ cursor: 'pointer'}} onClick={() => setIsShowFullPost(true)}>
                                {   text !== '' ? <h2 className="used-written-prompt">{prompt}</h2>
                                            :  <ProgressiveImage                  
                                                    src={fullLink}
                                                    placeholder={thumbLink}
                                                >
                                                {(src, loading) => <img className={ loading ? "used-thumbnail blur" : "used-thumbnail" } src={src} alt="idgafaalt" />}
                                                </ProgressiveImage>
                                }
                            </div>

                        <div className="text-meta-data">
                            <div><h3>{title}</h3></div>
                            <div className="used-story">{prose}</div>
                            <div className="used-genres">{genre_string}</div>                       
                            <div className="love-and-edit">

                                {   canDislike ? <img src={heart} alt="idgafaalt" className="heart" onClick={likeIncrDecr} />                        
                                               : <img src={unheart} alt="idgafaalt" className="heart" onClick={likeIncrDecr} />
                                }
                                <div className="prompt-like-counter">{likeCount}</div>

                                {   !isHall ?
                                        <>
                                            <Link to = {{
                                                pathname: "/prompts",
                                                state: { 
                                                            title, prose, id, genre, thumbLink, fullLink, text, hash: 'box', like
                                                }}}><img src={edit} alt="idgafaalt" className="prompt-edit-btn" /></Link>
                                            <img src={trash} alt="idgafaalt" className="prompt-trash-btn" onClick={deletePrompt}/>
                                        </>   
                                       
                                       : <div className="writer">-by {writer}</div>
                                }
                            </div>
                        </div>
                     </Paper>
                 </Container>
          </div>
        </>
    )
}

export default DisplayPromptCard 

