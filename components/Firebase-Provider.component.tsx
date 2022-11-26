'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import { createContext, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { authClient, dbClient } from '../utils/firebase-client';

export const FirebaseContext = createContext<Record<string, any>>({});

const FirebaseProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [firebaseLoaded, setFirebaseLoaded] = useState(false)
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [uid, setUid] = useState<string | undefined>(undefined)
  const [openProject, setOpenProject] = useState()
  const [openProjectId, setOpenProjectId] = useState()

  // Listens for openProject changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authClient, () => {
      setFirebaseLoaded(true)
      if (authClient.currentUser) {
        setUid(authClient.currentUser.uid)
        setUser(authClient.currentUser)
      } else {
        setUid(undefined)
        setUser(null)
      }
    })
    return unsubscribe
  }, [uid])

  useEffect(() => {
    const unsubscribe = onValue(ref(dbClient, `users/${uid}/openProjectId`), (snapshot) => {
      setOpenProjectId(snapshot.val())
    })
    return unsubscribe
  }, [uid])

  useEffect(() => {
    if (!openProjectId) return;
    get(ref(dbClient, `projects/${openProjectId}`)).then(snapshot => {
      setOpenProject(snapshot.val())
    })
  }, [openProjectId])

  useEffect(() => {
    if (firebaseLoaded && !user) {
      setIsNotLoggedIn(true)
    }
    if (firebaseLoaded && user) {
      setIsNotLoggedIn(false)
    }
  }, [firebaseLoaded, user])


  return (
    <FirebaseContext.Provider value={{ firebaseLoaded, isNotLoggedIn, user, uid, openProject, openProjectId }} >
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseProvider