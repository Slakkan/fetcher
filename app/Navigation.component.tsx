'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FunctionComponent, useCallback } from "react"

import styles from "./Navigation.module.scss"

const Navigation: FunctionComponent = () => {
    const path = usePathname()

    const getLinkClass = useCallback((href: string) => {
        if (!path) return "";

        const base = styles.navigation__link;
        const active = styles["navigation__link--active"]

        const isActive = path.split("/")[1] === href
        return `${base} ${isActive ? active : ""} ms-3`
    }, [path])

    return (
        <nav className={styles.navigation}>
            <ul className="p-0 m-0">
                <li className={getLinkClass("")}><Link href="/">Home</Link></li>
                <li className={getLinkClass("blocks")}><Link href="/blocks">Blocks</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation