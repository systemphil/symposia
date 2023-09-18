import { MouseEventHandler } from "react"
import { ButtonVariantEnum, buttonVariants } from "@/config/buttonConfig"

type FunctionButtonProps = {
    text: string;
    onClick?: MouseEventHandler
}

type FunctionButtonSettings = {
    variant: ButtonVariantEnum;
    props: FunctionButtonProps;
}

const FunctionButton = ({variant, props}: FunctionButtonSettings) => {
    const buttonVariant = buttonVariants[variant.toString()];
    return (
        <div className={buttonVariant.class}>
            <button onClick={props.onClick} >
                <p style={{padding: buttonVariant.padding}}>
                    {props.text}
                </p>
            </button>
        </div>
    )
}

export default FunctionButton