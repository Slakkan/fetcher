import { FunctionComponent } from "react"
import Image from 'next/image';

import styles from "./Header.module.scss"
import Navigation from "./Navigation.component";
import Login from "./Login.component";
import Link from "next/link";

const Header: FunctionComponent = () => {
    return (
        <header className="box">
            {/* MOBILE */}
            <div className={styles.header + " container g-0 pt-3 d-flex d-md-none"}>
                <div className="row g-0">
                    <div className="col-12 d-flex justify-content-between pb-4">
                        <Link href='/' className={styles.logo + " d-flex align-items-end"}>
                            <Image className="logo ms-3" priority={true} src='/fetcher.svg' alt='logo' width={100} height={100} />
                            <h1 className={"stress weight--normal m-0 ms-2"}>Fetcher</h1>
                        </Link>
                        <Login />
                    </div>
                    <div className="col-12 pb-2">
                        <Navigation />
                    </div>
                </div>
            </div>
            {/* DESKTOP */}
            <div className={styles.header + " container g-0 py-3 d-none d-md-flex"}>
                <Link href='/' className={styles.logo + " d-flex align-items-end"}>
                    <Image className="logo ms-3" priority={true} src='/fetcher.svg' alt='logo' width={100} height={100} />
                    <h1 className={"stress weight--normal m-0 ms-2"}>Fetcher</h1>
                </Link>
                <Navigation />
                <Login />
            </div>
        </header>
    )
}

export default Header