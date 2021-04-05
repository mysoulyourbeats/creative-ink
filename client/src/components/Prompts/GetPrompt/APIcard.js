import React from 'react'
import ProgressiveImage from "react-progressive-graceful-image"
import './prompts.css'

const PromptCard = ({fullLink, thumbLink, text }) => {
    let title
    if(text !== ''){
        title = text.split(' ').slice(0,4).join(' ')
    }

    return(
        <div className="api-card-wrapper">
            {   text === '' && fullLink !== ''?
                
                <div className="deviant-img-container">
                     <ProgressiveImage                  
                        src={fullLink}
                        placeholder={thumbLink}
                    >
                         {(src, loading) => <img className={ loading ? "thumbnail" : "full-image" } src={src} alt="an alternative text" />}
                    </ProgressiveImage>
                </div>

                :   (
                        text !== ''?
                            <div className="reddit-prompt-wrapper">             
                                <h1>{title}</h1>
                                <p>{text.substring(title.length+1)}</p>
                            </div>  

                            :     
                                <div className="reddit-prompt-wrapper">             
                                    <h1>Click Prompt Button</h1>
                                    <p>Pick your poison - image or a written piece. Each with its own beauty. Generate intriguing and exciting prompts!</p>
                              </div>  
                   ) 
                   
            }
            
        </div>
    )
}

export default PromptCard