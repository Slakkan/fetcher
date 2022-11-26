// @ts-nocheck
import { FunctionComponent, PropsWithChildren } from "react"
import FirebaseProvider from "../components/Firebase-Provider.component"

import "./globals.scss"
import Header from "./Header.component"

const RootLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<html lang="en">
			<head>
				<title>Fetcher</title>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel='icon' href='/logo.svg' />
			</head>
			<body>
				<FirebaseProvider>
					<div id="content">
						<Header />
						<div className="page background--gray">
							{children}
						</div>
					</div>
				</FirebaseProvider>
			</body>
		</html>
	)
}

export default RootLayout
