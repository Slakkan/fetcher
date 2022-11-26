"use client"
import { FunctionComponent } from "react"

interface LoadingProps {
    size?: "small" | "normal" | "big"
}

const Loading: FunctionComponent<LoadingProps> = ({ size = "normal" }) => {
    return (
        <div className={`loading loading--${size}`}><div></div><div></div><div></div><div></div></div>
    )
}

export default Loading