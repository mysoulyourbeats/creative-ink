import React, { useEffect } from 'react'
import Signup from '../Signup/Signup'

import './auth.css'
import cancel from '../../Images/x2.png'

const Auth = ( { setIsShowPleaseLogin, redirectUrl } ) => {
    const hideAuthLogin = () => setIsShowPleaseLogin(false)
    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => document.body.style.overflow = "visible"
    }, [])
    

    return(
        <div className="auth-popup">
                <>  
                    <img src={cancel} alt="idgafaalt" className="cancel-auth" onClick={hideAuthLogin}/>
                    <Signup setIsShowPleaseLogin={setIsShowPleaseLogin} redirectUrl={redirectUrl}/>
                    <p>Please Login/Signup to continue</p>
                </>
        </div>
    )
}

export default Auth