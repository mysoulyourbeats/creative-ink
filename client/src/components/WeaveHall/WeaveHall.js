import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core' 
import WeaveCard from './WeaveCard'
import './weavehall.css'
import axios from 'axios'

const url = 'https://creative-ink.herokuapp.com'

const WeaveHall = () => {

    const [weavedArray, setWeavedArray] = useState([])
    const [isEmptyHall, setIsEmptyHall] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    useEffect(() => {
        setIsLoading('Loading')

        axios.get(`${url}/getWeave`)
        .then((res) => {
            setIsLoading(null)
            res.data.result.map((val) => setWeavedArray((prev) => [...prev, { title: val.title, spanArray: val.prose, id: val._id }]))        
        })
        .catch((error) => {setIsLoading(null); setIsEmptyHall(true); console.log(error)})
    }, [])

    return (
        <div className="weave-hally">
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
            
            {isEmptyHall? <div className="oopsie">
                            <div><h2>No collab stories<br /> weaved yet!</h2></div>
                            <Link to='/join'><Button size="large" variant="outlined" className="oopsie-btn" >Weave your own</Button></Link>                            
            </div> : null}
            <div className="display-prompt-container">{weavedArray.map((val) => <WeaveCard key={val.id} title={val.title} spanArray={val.spanArray} />)}</div>
        </div>
    )
}

export default WeaveHall