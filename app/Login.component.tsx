"use client"
import { signInWithPopup } from "firebase/auth";
import { FunctionComponent, useContext, useMemo, useState } from "react";
import Image from "next/image";
import { set, ref, push, get } from "firebase/database";

import { authClient, dbClient, authProvider } from "../utils/firebase-client";
import Loading from "../components/Loading.component";
import styles from "./Login.module.scss"
import Button from "../components/Button.component";
import Link from "next/link";
import PopUp, { PopUpPosition } from "../components/Pop-Up.component";
import { FirebaseContext } from "../components/Firebase-Provider.component";
import useDebounce from "../hooks/useDebounce";

const Login: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { uid, user, firebaseLoaded } = useContext(FirebaseContext)
    const [isOpenDebounced] = useDebounce(isOpen, 100)

    const [error, setError] = useState("")

    const onLogin = async () => {
        try {
            const credentials = await signInWithPopup(authClient, authProvider)

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
                    openProjectId: projectKey
                });
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const onSignOut = () => {
        authClient.signOut()
    }

    const getPopupClass = useMemo(() => {
        const base = styles.login__popup
        const open = styles["login__popup--open"]

        return `${base} ${isOpenDebounced ? open : ""} p-0`
    }, [isOpenDebounced])

    return (
        <div className="d-flex flex-column justify-content-end align-items-end">
            {!firebaseLoaded && <Loading size="small" />}
            {firebaseLoaded && (
                <>
                    <div className="d-flex align-items-end ">
                        {!uid && <Button className="mx-3" text="Login" onClick={onLogin} />}
                        {uid && (
                            <div className="d-flex align-items-end pe-3">
                                <span className="me-3">
                                    Welcome, <br />
                                    <span className="weight--bold">{user.displayName}</span>
                                </span>
                                <Image className={styles.login__image} src={user.photoURL!} onClick={() => setIsOpen(prev => !prev)} alt="Profile photo" width={48} height={48} />
                                <PopUp isOpen={isOpen} setIsOpen={setIsOpen} className={getPopupClass} position={PopUpPosition.RIGHT}>
                                    <div className="d-flex flex-column align-items-start">
                                        <div className="d-flex align-items-end p-3">
                                            <span className="me-3">
                                                Welcome, <br />
                                                <span className="weight--bold">{user.displayName}</span>
                                            </span>
                                            <Image className={styles.login__image} src={user.photoURL!} onClick={() => setIsOpen(prev => !prev)} alt="Profile photo" width={48} height={48} />
                                        </div>
                                        <hr />
                                        <Link className={styles.login__link + " no-underline px-3 py-2 mb-2"} href="/settings" onClick={onSignOut}><h3 className="m-0">Settings</h3></Link>
                                        <Link className={styles.login__link + " no-underline px-3 py-2 mb-2"} href="/" onClick={onSignOut}><h3 className="m-0">Sign Out</h3></Link>
                                    </div>
                                </PopUp>
                                {isOpen && <div id="overlay" className={styles.login__overlay}></div>}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Login;
