"use client"
import { signInWithPopup, User } from "firebase/auth";
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { set, ref, onValue, push, get } from "firebase/database";

import { authClient, dbClient, authProvider } from "../utils/firebase-client";
import Loading from "../components/Loading.component";
import styles from "./Login.module.scss"
import Button from "../components/Button.component";
import { useRouter } from "next/navigation";

const Login: FunctionComponent = () => {
    const [user, setUser] = useState<User | null>()
    const [authStatusChanged, setAuthStatuCshanged] = useState(false)
    const router = useRouter()

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

        const { uid, displayName, email, photoURL } = credentials.user;

        const usersRef = ref(dbClient, `users/${uid}`)

        const usersSnapshot = await get(usersRef)
        if (!usersSnapshot.exists()) {
            const { key: organizationKey } = await push(ref(dbClient, "organizations"), {
                name: 'My Organization',
                members: {
                    [uid]: true
                }
            })

            const { key: projectKey } = await push(ref(dbClient, "projects"), {
                name: 'My Project',
                organization: organizationKey,
                members: {
                    [uid]: true
                }
            })


            await set(ref(dbClient, `users/${uid}`), {
                name: displayName,
                email,
                profilePhoto: photoURL,
                organization: organizationKey,
                openProject: projectKey
            });
        }

    }

    const onSignOut = () => {
        authClient.signOut()
        router.push("/")
        setUser(null)
    }

    return (
        <div className="d-flex justify-content-end align-items-end">
            {!authStatusChanged && <Loading size="small" />}
            {authStatusChanged && (
                <>
                    {!user && <Button text="Login" onClick={onLogin} />}
                    {user && (
                        <>
                            <div className={styles.account + " me-2"}>
                                <span>
                                    Welcome, <span className="weight--bold">{user.displayName}</span>
                                </span>
                                <button className={styles.signout + " p-1"} onClick={onSignOut}>Sign Out</button>
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
