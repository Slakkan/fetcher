import { FunctionComponent, PropsWithChildren } from "react"
import Image from "next/image"

import styles from "./Dialog.module.scss"

const Dialog: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.dialog + " my-5"}>
            <div className="d-flex flex-column align-items-end">
                <div className={styles.dialog__bubble + " px-5 py-3"}>{children}</div>
                <Image className="logo logo--big" priority={true} src='/fetcher.svg' alt='logo' width={300} height={300} />
            </div>
        </div>
    )
}

export default Dialog