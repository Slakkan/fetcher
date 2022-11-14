import { FunctionComponent } from "react"
import Image from 'next/image';
import localFont from '@next/font/local';

import styles from "./Header.module.scss"
import Navigation from "./Navigation.component";
import Login from "./Login.component";
import Link from "next/link";

const stress = localFont({ src: '../public/fonts/Stress.ttf', preload: true });

const Header: FunctionComponent = () => {
    return (
        <header className="box">
            {/* DESKTOP */}
            <div className={styles.header + " container py-3 d-none d-md-flex"}>
                <Link href='/' className={styles.logo + " d-flex align-items-end p-2"}>
                    <Image className="logo" priority={true} src='/fetcher.svg' alt='logo' width={100} height={100} />
                    <h1 className={stress.className + " weight--normal m-0 ms-2"}>Fetcher</h1>
                </Link>
                <Navigation />
                <Login />
            </div>
            {/* MOBILE */}
            <div className={styles.header + " container pt-3 d-flex d-md-none"}>
                <div className="row">
                    <div className="col-12 d-flex justify-content-between pb-3">
                        <Link href='/' className={styles.logo + " d-flex align-items-end p-2"}>
                            <Image className="logo" priority={true} src='/fetcher.svg' alt='logo' width={100} height={100} />
                            <h1 className={stress.className + " weight--normal m-0 ms-2"}>Fetcher</h1>
                        </Link>
                        <Login />
                    </div>
                    <div className="col-12 pb-2">
                        <Navigation />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header