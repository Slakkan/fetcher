"use client"
import { FunctionComponent, PropsWithChildren } from "react"
import Image from "next/image"

import styles from "./Dialog.module.scss"

const Dialog: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <div className="d-flex justify-content-center">
            <div className={styles.dialog + " my-3"}>
                <div className="d-flex flex-column align-items-end p-5">
                    <div style={{ position: "relative" }}>
                        {children}
                        <Image className={styles.dialog__bubble + " d-none d-md-block"} priority={true} src="/dialog.svg" alt="" width={320} height={170} />
                        <Image className={styles.dialog__bubble + " d-block d-md-none"} priority={true} src="/dialog-flipped.svg" alt="" width={320} height={170} />
                    </div>
                    <Image className={styles.dialog__fetcher + " logo logo--big"} src='/fetcher.svg' alt='logo' width={300} height={200} />
                </div>
            </div>
            <div className="d-none d-md-block" style={{ width: "200px" }}></div>
        </div>
    )
}

export default Dialog