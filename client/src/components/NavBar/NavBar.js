import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../Context'

import axios from 'axios'

import './styles.css'
import creative_ink from '../../Images/quill.png'
import ham from '../../Images/ham.png'

const url = "https://creative-ink.herokuapp.com"

const NavBar = () => {
    
    const [isAuth, setIsAuth] = useContext(Context)
    const [isSmallDevice, setIsSmallDevice] = useState(false)

    const toggleSmallNavOptions = () => {
        setIsSmallDevice(prev => !prev)
    }

    const disappear = () => {
        setIsSmallDevice(false)
    }

    useEffect(() => {
        if(isSmallDevice === true){
            document.body.style.overflow = "hidden"
        }
        else{
            document.body.style.overflow = "visible"
        }
    }, [isSmallDevice])

    useEffect(() => {
        localStorage.setItem('isAuth', isAuth)
    }, [isAuth])

    window.addEventListener('storage', (event) => {
        if (event.key === 'isAuth') { 
            window.location.reload()
        }
    })
    
    const clickHandler = () => {
        localStorage.clear()
        setIsAuth(false)
        axios.get(`${url}/clearcookies`, {withCredentials: true})
    }

    return(
        <>
            <nav className="navbar">
                <div className="outer">
                <Link to="/">
                    <div className="logo" onClick={disappear}>
                        <div>Creative.Inc</div>
                        <img src={creative_ink} alt="imtoolazytowritealt"/>
                    </div>
                </Link>               
                
                        <Link to="/prompts"><div className="nav-options-large">Prompts</div></Link>
                        <Link to="/hall"><div className="nav-options-large">Hall</div></Link>
                        { (isAuth)? <Link to="/drafts"><div className="nav-options-large">Drafts</div></Link> : null }
                        <Link to="/join"><div className="nav-options-large">Weave</div></Link>
                        <Link to="/weavehall"><div className="nav-options-large">Collab Pieces</div></Link>
                        { (!isAuth)? <Link to="/signup"><div className="nav-options-large">Sign Up</div> </Link> : <Link to="/" onClick={clickHandler}><div className="nav-options-large">Log Out</div></Link> }
                
                <img src={ham} alt="idgafaa" className="hamburger" onClick={toggleSmallNavOptions}></img>                      
                </div>
                
            </nav>

            { isSmallDevice ? 
                
                    <div className="xxx">
                        <div className="nav-options-small">
                            <Link to="/prompts" onClick={toggleSmallNavOptions}><div className="top-option">Prompts</div></Link>
                            <Link to="/hall"><div onClick={toggleSmallNavOptions}>Hall</div></Link>
                            { (isAuth)? <Link to="/drafts" onClick={toggleSmallNavOptions}><div>Drafts</div></Link> : null }
                            <Link to="/join" onClick={toggleSmallNavOptions}><div>Weave</div></Link>
                            <Link to="/weavehall" onClick={toggleSmallNavOptions}><div>Collab Pieces</div></Link>
                            { (!isAuth)? <Link to="/signup" onClick={toggleSmallNavOptions}><div>Sign Up</div> </Link> : <Link to="/" onClick={() => {clickHandler(); toggleSmallNavOptions()}}><div>Log Out</div></Link> }
                        </div>
                    </div> 
                
                : null
            }       

        </>

    )
}

export default NavBar