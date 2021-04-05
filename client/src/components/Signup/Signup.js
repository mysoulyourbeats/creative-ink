import { React, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { Container, Grid, Button, Typography, Paper } from '@material-ui/core'
import Input from './Input'
import useStyles from './styles';
import { Context } from '../Context'

import axios from 'axios'
const url = "https://creative-ink.herokuapp.com"

const Signup = ({ setIsShowPleaseLogin, redirectUrl }) => {

    const classes = useStyles()    
    const[showPassword, setShowPassword] = useState(false)
    const[isSignup, setIsSignup] = useState(true)
    
    const initialSignupState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
    const initialSigninState = { email: '', password: ''}
    const [formData, setFormData] = useState(isSignup ? initialSignupState : initialSigninState)
    const [failedAuth, setFailedAuth] = useState('')
    // eslint-disable-next-line
    const [isAuth, setIsAuth] = useContext(Context)
    const [isLoading, setIsLoading] = useState('')

    const history = useHistory()

    const handleSubmit = (event) => {
                event.preventDefault()        
                setFailedAuth('')
                setIsLoading('Authenticating...')
                axios.post(isSignup ? `${url}/signup` : `${url}/signin`, formData, {
                    withCredentials: true
                })
                .then((res) => {                           
                             localStorage.setItem('isAuth', true)
                             localStorage.setItem('userName', res.data.name)                               
                             setIsAuth(true)
                             if(setIsShowPleaseLogin)
                                {   setIsShowPleaseLogin(false)
                                }                                                                                
                             else
                                {history.push('/')}
                    })
                .catch((error) => { 
                                            const display = error.response.data
                                            setFailedAuth(display)                                    
                                })
    }

    const handleChange = (event) => {        
        setFormData( { ...formData, [event.target.name]: event.target.value } )
    }

    const handleSwitch = () => {
        setIsSignup(prevState => !prevState)
        setFailedAuth('')
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)
    
    return(
        
        <>         
            <Container component="main" maxWidth="xs">
                <Paper className={classes.paper} elevation={4}>              
                    <Typography variant="h5" align="center">{isSignup ? 'Sign Up' : 'Log In'}</Typography>                
                   
                    {failedAuth !== '' ? <Typography style={{color: "rgb(158, 32, 44)",  paddingTop : "20px"}}>{failedAuth}</Typography> : null}
                    {failedAuth === '' && isLoading!== '' ? <Typography style={{color: "rgb(26,188,156)",  paddingTop : "20px"}}>{isLoading}</Typography> : null}                
                    <form onSubmit={handleSubmit} className={classes.form}>
                        <Grid container spacing={3}>
                            {
                                isSignup && (
                                    <>
                                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                                        <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                                    </>
                                )
                            } 
                            <Input name="email" label="Email" handleChange={handleChange} type="email"  />
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                            { isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/> }                        
                        </Grid>
                        
                            <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submit}>
                                { isSignup ? 'Sign Up' : 'Log In' }
                            </Button>       
    
                             <Button fullWidth variant="contained" color="primary" onClick={handleSwitch} className={classes.submit}>
                                     { isSignup ? 'Or Log In' : 'Or Sign Up' }
                            </Button>         
                    </form>
                </Paper>
            </Container>
            
        </>
    )
}

export default Signup