import React, { useEffect, useState } from 'react'
import { Container, Paper, TextField, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import hexAlpha from 'hex-alpha'
import queryString from 'query-string'
import io from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
import axios from 'axios'

import './weave.css'
const url = 'https://creative-ink.herokuapp.com'
let socket
let index = -1
let randomColor
let previousWriter

const Weave = ( { location } ) => {    

    const { name, room } = queryString.parse(location.search)
    const totalTime = 20*6 
    const oneWriterTime = 20
    const maxRoundRobins = totalTime/oneWriterTime
    const history = useHistory()

    const [timeLeft, setTimeLeft] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [writerNamesArray, setWriterNamesArray] = useState([])
    const [spanArray, setSpanArray] = useState([])
    const [isGameOver, setIsGameOver] = useState(false)
    const [info, setInfo] = useState('')
    const [title, setTitle] = useState('')
    const [isMyTurn, setIsMyTurn] = useState(false)
    const [titleIsChanging, setTitleIsChanging] = useState('')
    const [turnsLeft, setTurnsLeft] = useState(null)

    const startWriting = () => {
        socket.emit('startWriting', { room, maxRoundRobins, penName: name })
        document.getElementById('submit-before-game-over').style.display = 'none'
        document.getElementById('weave-field').style.cursor = 'default'
    }

    const restartWriting = () => {
        setIsGameOver(false)
        socket.emit('restartWriting', (room))
        setSpanArray([])
        socket.emit('startWriting', { room, maxRoundRobins, penName: name })
        document.getElementById('weave-field').style.cursor = 'default'
    }

    const changeProse = (event) => {    
        setSpanArray(((prev) => prev.map((val) => val.keyPropId === index? {...val, userProse: event.target.value, randomColor: hexAlpha(randomColor, 0.18) } : val )))
        socket.emit('userProse', { userProse: event.target.value, room })
    }

    const changeTitle = (event) => {
        setTitle(event.target.value)
        socket.emit('title', { title: event.target.value, room })
    }

    const postWeave = () => {
        document.getElementById('publish').style.display = 'none'
        socket.emit('published', ({ room, name }))
        setInfo('Successfully Published!')
        axios.post(`${url}/postWeave`, { spanArray, title })
        .then()
        .catch((error) => console.log(error))
    }

    const closeRoom = () => {
        if(isAdmin)
            socket.emit('closeRoom', { room })
        history.push('/join')
    }

    useEffect(() => {
        window.scrollTo(0, 10000)
        document.getElementById('weave-field').disabled = true
        randomColor = '#' + Math.floor(Math.random()*16777215).toString(16)
        socket = io(url)

        // Let server know you joined, and get subscribed
        socket.emit('join', { name, room, randomColor }, (res) => {      
            setIsAdmin(res.roomSize === 1? true : false)
            res.otherMembers.map((val) => setWriterNamesArray((prev) => [...prev, val]))
        })

        // Other members will know which new member subscribed to the room
        socket.on('newJoinedMember', ({ userSocketId, name, randomColor }) => {
            setWriterNamesArray((prev) => [...prev, { userSocketId, name, randomColor }])
        })

        socket.on('titleChanged', ({ title, adminName }) => {
            setTitle(title)
            setTitleIsChanging(`Title being changed by host ${adminName}...`)            
        })

        // Your turn to (shine) write
        socket.on('yourTurn', () => {
            setInfo(`Your turn to write, ${name}!`)
            document.getElementById('weave-field').disabled = false            
            setTimeLeft(oneWriterTime)
            setIsMyTurn(true)
        })

        // Get to know which writer is going to write next
        socket.on('nextWriterPenName', ({ penName, randomColor, userSocketId, maxRoundRobins }) => {        
            setWriterNamesArray((prev) => prev.map((val) => val.userSocketId === previousWriter? {...val, indicatorColor: null } : val ))
            previousWriter = userSocketId
            setSpanArray((prev) => [...prev, { keyPropId: ++index, penName, userProse: '' } ])
            document.getElementById(userSocketId).scrollIntoView({ behavour: 'smooth' })
            setWriterNamesArray((prev) => prev.map((val) => val.userSocketId === userSocketId? {...val, indicatorColor: hexAlpha(randomColor, 0.2) } : val ))
            setTimeLeft(oneWriterTime)
            setTurnsLeft(maxRoundRobins)
            setInfo(`${penName} is writing the prose!`)
        })

        // Render what other writer is currently writing
        socket.on('friendProse', ({ friendProse, randomColor }) => {                       
            setSpanArray(((prev) => prev.map((val) => val.keyPropId === index? {...val, userProse: friendProse, randomColor: hexAlpha(randomColor, 0.18)} : val )))
        })

        // Game Over
        socket.on('timeIsUp', ({ adminName }) => {  
            setInfo(`Time is up, ${adminName} can now choose to publish this piece.`)
            setTurnsLeft(null)
            setIsGameOver(true)
        })

        // Remove that mofo
        socket.on('writerLeft', ({ userSocketId }) => {
            setWriterNamesArray((prev) => prev.filter(item => item.userSocketId !== userSocketId))
        })

        socket.on('published', (name) => setInfo(`${name} published this piece!`))
        socket.on('restartWriting', () => setSpanArray([]))

        socket.on('closeRoom', () => {
            history.push('/join')
        })

        return () => {  
            socket.disconnect()
        }

    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(timeLeft === 0){
            if(isMyTurn){ 
                socket.emit('nextWriterPlease', { room })
                document.getElementById('span-writer').backgroundColor = '#15130C'
                document.getElementById('weave-field').disabled = true
                setTimeLeft(null) 
                document.getElementById('weave-field').value = ''        
                setIsMyTurn(false)           
            } else{
                setTimeLeft(null)
            }      
        }

        if(!timeLeft) return
        
        const intervalId = setInterval(() => {
                  setTimeLeft(timeLeft - 1)
            }, 1000)
        
        return () => clearInterval(intervalId)
    //eslint-disable-next-line
    }, [timeLeft])    

    useEffect(() => {
        if(isMyTurn)
            document.getElementById('weave-field').style.cursor = 'default' 
        else
            document.getElementById('weave-field').style.cursor = 'not-allowed' 
    }, [isMyTurn])

    useEffect(() => {
        if(isGameOver && isAdmin)
            {   
                setInfo('')
                document.getElementById('publish').style.display = 'block'
            }
            //eslint-disable-next-line
    }, [isGameOver])

    useEffect(() => {
        if(!isAdmin){
            let typingIndicator = setTimeout(() => {
                setTitleIsChanging('')
            }, 1500)
        
        return () => clearTimeout(typingIndicator)
      }
      //eslint-disable-next-line
    }, [title])

    return(
        <div className="weave-form" id="weave-id">
            <Container>
                <Paper>  
                    <span className="redcross" onClick={closeRoom}>x</span>
                    {isAdmin? <TextField className="title-weave" fullWidth name="title" label="Title" onChange={changeTitle} disabled={isGameOver? true : false}/> : <div className="title-weave">{title}</div>  }                                            
                    <div className="writer-array-wrapper"> { writerNamesArray.map((val) => <div key={val.userSocketId} id={val.userSocketId} style={{borderTopColor: val.randomColor, backgroundColor: val.indicatorColor  }}>{val.name}</div> ) }</div>
                    <ScrollToBottom className="react-scroll-to-bottom"><div className="weave-story">{ spanArray.map((val) => <span id="span-writer" key={val.keyPropId} style={{ backgroundColor: val.randomColor }}>{val.userProse} </span>) }</div></ScrollToBottom>
                    <TextField id="weave-field" multiline rows={15} fullWidth name="story" label="Story" onChange={changeProse} />                          
                    <div className="submit-and-error">
                        { titleIsChanging !== ''? <div className="weave-info-bar">{titleIsChanging}</div> :
                          <div className="weave-info-bar"><span className="turns-left">{timeLeft !== null? (turnsLeft === 1? `${turnsLeft} turn left` : `${turnsLeft} turns left`) : null}</span> {turnsLeft!==null? <span className="separators">|</span> : null} {info} {timeLeft? <span className="separators">|</span> : null} <span className="time-left">{timeLeft !== null? `${timeLeft}s to go` : null}</span></div> 
                        }                        
                        
                        <div className="btns-array">  
                            {isAdmin? <Button id="submit-before-game-over" variant="contained" color="secondary" onClick={startWriting}>Start</Button> : null}                          
                            {isAdmin && isGameOver? <Button className="submit-weave" variant="contained" color="secondary" onClick={restartWriting}>Again</Button> : null}
                            {isAdmin && isGameOver? <Button id="publish" variant="contained" color="primary" onClick={postWeave}>Publish</Button> : null}
                        </div>
                    </div>
                                 
                </Paper>
            </Container>            
        </div>
    )
}

export default Weave