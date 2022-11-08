"use client"
import { ButtonProps } from "../components/Button.component"

export enum DefaultButton {
    ADD
}

export const getDefaultButton = (button: DefaultButton): ButtonProps => {
    switch (button) {
        case DefaultButton.ADD:
            return {
                onClick: () => {},
                icon: {
                    src: "/icons/plus-solid.svg",
                    alt: "add",
                    width: 36,
                    height: 36
                }
            }
    }
}
