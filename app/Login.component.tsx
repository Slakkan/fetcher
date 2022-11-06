"use client"
import { signInWithPopup, User } from "firebase/auth";
import { FunctionComponent, useEffect, useState } from "react";
import { auth, authProvider } from "../utils/firebase-client";


const Login: FunctionComponent = () => {
    const [user, setUser] = useState<User | null>()


    useEffect(() => {
        auth.onAuthStateChanged(() => {
            setUser(auth.currentUser)
        })
    },[])

    const onLogin = async () => {
        const credentials = await signInWithPopup(auth, authProvider)
        setUser(credentials.user)
    }

    return (
        <div>
            {!user && <button onClick={onLogin} className="my-3">Login</button>}
            {user && <span>Welcome, {user.displayName}</span>}
        </div>
    )
}

export default Login