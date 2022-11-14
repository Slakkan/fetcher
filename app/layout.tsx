// @ts-nocheck
import { FunctionComponent, PropsWithChildren } from "react"

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
				<div id="content">
					<Header />
					<div className="page py-5">
						{children}
					</div>
				</div>
			</body>
		</html>
	)
}

export default RootLayout
