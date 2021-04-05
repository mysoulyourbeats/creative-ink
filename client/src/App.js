import React from 'react'
import {BrowserRouter as Router, Route } from "react-router-dom"
import { StateProvider } from './components/Context'

import NavBar from './components/NavBar/NavBar'
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import Drafts from './components/Drafts/Drafts'
import PostProse from './components/PostProse/PostProse'
import APIcalls from './components/Prompts/GetPrompt/APIcalls'
import UsedPrompts from './components/Prompts/UsedPrompts/UsedPrompts'
import Weave from './components/Weave/Weave'
import WeaveHall from './components/WeaveHall/WeaveHall'
import FullWeavePost from './components/WeaveHall/FullWeavePost'
import Join from './components/Weave/Join'
import Hall from './components/Hall/Hall'
import Auth from './components/Auth/Auth'
import FullPost from './components/FullPost/FullPost'
import FullDraft from './components/Drafts/FullDraft'


const App = () => {

    return(      
        <>              
            <Router>   
                <StateProvider>
                    <NavBar />
                    <Route path="/auth" exact component={Auth} />    
                    <Route path="/signup" exact component={Signup} />                 
                    
                    <Route path="/" exact component={Home} />
                    <Route path="/drafts" exact component={Drafts} />
                    <Route path="/fulldraft" exact component={FullDraft} />
                    <Route path="/postprose" exact component={PostProse} />
                    <Route path="/prompts" exact component={APIcalls} />
                    <Route path="/usedprompts" exact component={UsedPrompts} /> 
                    <Route path="/hall" exact component={Hall} />           
                    <Route path="/fullpost" exact component={FullPost} />                   
                    <Route path="/join" exact component={Join} />                 
                    <Route path="/weave" exact component={Weave} />                                             
                    <Route path="/weavehall" exact component={WeaveHall} />                                             
                    <Route path="/fullweave" exact component={FullWeavePost} />                                             
                </StateProvider>
            </Router>
        </>
    )

}

export default App