"use client"
import { signInWithPopup, User } from "firebase/auth";
import { FunctionComponent, useEffect, useState } from "react";
import { authClient, authProvider } from "../utils/firebase-client";
import Image from "next/image";
import Loading from "../components/Loading.component";

import styles from "./Login.module.scss"

const Login: FunctionComponent = () => {
    const [user, setUser] = useState<User | null>()
    const [authStatusChanged, setAuthStatuCshanged] = useState(false)

    useEffect(() => {
        const unsubscribe = authClient.onAuthStateChanged(() => {
            setUser(authClient.currentUser)
            setAuthStatuCshanged(true)
        })
        return unsubscribe()
    }, [])

    const onLogin = async () => {
        const credentials = await signInWithPopup(authClient, authProvider)
        setUser(credentials.user)
    }

    const onSignOut = () => {
        authClient.signOut()
    }

    return (
        <div className=" d-flex justify-content-end align-items-end">
            {!authStatusChanged && <Loading size="small" />}
            {authStatusChanged && (
                <>
                    {!user && <button onClick={onLogin}>Login</button>}
                    {user && (
                        <>
                            <div className={styles.account + " me-2"}>
                                <span>
                                    Welcome, <strong>{user.displayName}</strong>
                                </span>
                                <a onClick={onSignOut}>Sign Out</a>
                            </div>
                            <Image className={styles.account__image} src={user.photoURL!} alt="Profile photo" width={48} height={48} />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Login;
