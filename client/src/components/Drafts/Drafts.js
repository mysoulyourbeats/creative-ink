import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import ProseCard from './ProseCard'
import axios from 'axios'

import './styles.css'
import plus from '../../Images/plus.png'

const url = "https://creative-ink.herokuapp.com"

const Drafts = () => {
    const[proseData, setProseData] = useState([])
    const[id, setId] = useState('')
    const [isNoDraftTaken, setIsNoDraftTaken] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    const callback = (id) => {
            const index = proseData.findIndex((val) => val.id === id)
    
            if(index !== -1) {
               proseData.splice(index, 1) 
               setId(id)   
            }
            else
                console.log('User ID is invalid')
        }

    useEffect(() => {
        setIsLoading('Loading')
        axios.get(`${url}/prose/getprose`, {withCredentials: true})
        .then((res) => {
            setIsLoading(null)
            res.data.result.map((val) => (

                setProseData((prev) => [...prev, { title: val.title, prose: val.prose, id: val._id }])
                            ))
            
            // console.log('Proses obtained')             
        })
        .catch((error) => {setIsLoading(null); setIsNoDraftTaken(true); console.log(error) })
    }, [])


    return(
            <div className="drafts-container">  
                 {   
                    isLoading ? 
                    <div className="loader-wrapper">
                    <p style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div className="loading-font">
                                <div><h2>{isLoading}</h2></div>                    
                            </div> 

                            <div class="sk-cube-grid">
                                <div class="sk-cube sk-cube1"></div>
                                <div class="sk-cube sk-cube2"></div>
                                <div class="sk-cube sk-cube3"></div>
                                <div class="sk-cube sk-cube4"></div>
                                <div class="sk-cube sk-cube5"></div>
                                <div class="sk-cube sk-cube6"></div>
                                <div class="sk-cube sk-cube7"></div>
                                <div class="sk-cube sk-cube8"></div>
                                <div class="sk-cube sk-cube9"></div>
                            </div>
                        </p>
                    </div> : null
                }
                
                {   
                    isNoDraftTaken ? 
                    <div className="oopsie">
                        <div><h2>No drafts<br/>written yet!</h2></div>
                        <Link to="/postprose"><Button size="large" variant="outlined" className="oopsie-btn">Write a draft</Button></Link>
                    </div>
                     :  null }  
                    {proseData.map((val) => (   id!==val.id ?
                                                <ProseCard key={val.id} id={val.id} title={val.title} prose={val.prose} callback={callback}/>
                                                : null
                                            ) 
                                 ) }
              <Link to="/postprose"><img src={plus} alt="idgafaalt" className="create-draft-btn" /></Link>
            </div>

    )
}

export default Drafts