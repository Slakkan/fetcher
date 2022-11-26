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
        return `${base} ${isActive ? active : ""} me-3`
    }, [path])

    return (
        <nav className={styles.navigation}>
            <ul className="d-flex justify-content-center m-0 p-0 py-0 py-md-3">
                <li><Link className={getLinkClass("")} href="/">Home</Link></li>
                <li><Link className={getLinkClass("design")} href="/design">Design</Link></li>
                <li><Link className={getLinkClass("build")} href="/build">Build</Link></li>
                <li><Link className={getLinkClass("projects")} href="/projects">Projects</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation