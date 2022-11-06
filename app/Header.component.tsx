import { FunctionComponent } from "react"
import Image from 'next/image';
import localFont from '@next/font/local';

import styles from "./Header.module.scss"
import Navigation from "./Navigation.component";
import Login from "./Login.component";

const stress = localFont({ src: '../public/fonts/Stress.ttf' });

const Header: FunctionComponent = () => {
    return (
        <header className="box">
            <div className="container d-flex align-items-end justify-content-between">
                <div className="d-flex align-items-end">
                    <Image className="my-3" priority={true} src='/fetcher.svg' alt='Vercel Logo' width={100} height={100} />
                    <h1 className={stress.className + " weight--normal m-3"}>Fetcher</h1>
                </div>
                <Navigation />
                <Login />
            </div>
        </header>
    )
}

export default Header