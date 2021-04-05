
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Paper, Button, TextField } from '@material-ui/core'

import './join.css'

const Join = () => {
   
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [isRoomGenerated, setIsRoomGenerated] = useState(false)
    
    useEffect(() => {
        document.getElementsByClassName('navbar')[0].scrollIntoView()
    }, [])

    return(
        <div className="join-wrapper">
            <div className="oopsie">
                            <div><h2>Weave a story, <br/>together.</h2></div>
                            <p>Either create your own room to write with others, or join an existing one. </p>
                            <Button size="large" variant="outlined" className="oopsie-btn code-btn" onClick={() => {setIsRoomGenerated(true); document.getElementById('join-form').scrollIntoView({behavior: 'smooth'}); setRoom(Math.random().toString(36).slice(-7));} }>Create Room</Button>
                            <Button onClick={() => {document.getElementById('join-form').scrollIntoView({behavior: "smooth"}); setIsRoomGenerated(false)} } size="large" variant="outlined" className="oopsie-btn" >Join with Code</Button>                            
            </div>

           

            <div id="join-form">         
                   <Container maxWidth="xs">               
                       <Paper>                            
                                <form>
                                    <TextField fullWidth name="nickname" label="Your nickname" onChange={(event) => setName(event.target.value)} />                          
                                    <TextField fullWidth name="nickname" label="Room Code" onChange={(event) => setRoom(event.target.value)} value={room} />                          
                                    <Link to={(!name || !room) ? '/join' : `/weave?name=${name}&room=${room}`}><Button type="submit" className="join-btn-blue" fullWidth variant="contained" color="primary">Join</Button></Link>                                           
                                </form>
                       </Paper>
                   </Container>
                   {isRoomGenerated? <p>Room code Generated!</p> : <p></p>}     
            </div>
        </div>
    )
}

export default Join