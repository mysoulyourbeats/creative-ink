import React, { useState, createContext } from 'react'

export const Context = createContext()

export const StateProvider = (props) => {

    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') === 'true')
    return(
        <Context.Provider value={[isAuth, setIsAuth]}>
            { props.children }
        </Context.Provider>
    )
}
