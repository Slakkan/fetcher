'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FunctionComponent, useCallback } from "react"

import styles from "./Navigation.module.scss"

const Navigation: FunctionComponent = () => {
    const path = usePathname()

    const getLinkClass = useCallback((href: string) => {
        if (!path) return "";

        const base = "link";
        const active = "link--active"

        const isActive = path.split("/")[1] === href
        return `${base} ${isActive ? active : ""} ms-3 p-1`
    }, [path])

    return (
        <nav className={styles.navigation}>
            <ul className="d-flex p-0 m-0 pb-md-3">
                <li><Link className={getLinkClass("")} href="/">Home</Link></li>
                <li><Link className={getLinkClass("design")} href="/design">Design</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation