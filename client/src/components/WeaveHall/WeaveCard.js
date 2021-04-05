import React, { useState }  from 'react'
import { Container, Paper } from '@material-ui/core'
import useStyles from '../styles'
import FullWeavePost from './FullWeavePost'

const WeaveCard = ({ title, spanArray }) => {
    const [isShowFullPost, setIsShowFullPost] = useState(false)

    const classes = useStyles()   
    let subtitle = spanArray[0].userProse
    if(subtitle === '')
        subtitle = 'Once upon a time'

    let proseSample = ''
    spanArray.map((val) => proseSample = proseSample + val.userProse)
        
    return (
         <>
          {isShowFullPost ? <FullWeavePost setIsShowFullPost={setIsShowFullPost} title={title} spanArray={spanArray}
                                                                        /> : null }
          <div className="used-prompts-wrapper">
                <Container className={classes.paper}>
                    <Paper>
                        {/* <Link to = {{      pathname: "/fullweave",
                                            state: { 
                                                title, spanArray                                                                       
                                            }}}> */}
                        <div style={{ cursor: 'pointer'}} onClick={() => setIsShowFullPost(true)}>
                            <h2 className="used-written-prompt">{title}</h2>  
                        </div>                                                          
                        {/* </Link> */}

                        <div className="text-meta-data">
                            <div><h3>{subtitle}</h3></div>
                            <div className="used-story">{proseSample}</div>
                        </div>
                     </Paper>
                 </Container>
          </div>
        </>
    )
}

export default WeaveCard