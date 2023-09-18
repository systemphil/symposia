import Link from "next/link"
import { ButtonVariantEnum, buttonVariants } from "@/config/buttonConfig"
import { UrlObject } from "url";

type LinkButtonProps = {
    text: string;
    href?: string | UrlObject;
}

type LinkButtonSettings = {
    variant: ButtonVariantEnum;
    props: LinkButtonProps;
}

const LinkButton = ({variant, props}: LinkButtonSettings) => {
    const buttonVariant = buttonVariants[variant.toString()];
    return (
        <div className={buttonVariant.class}>
            <Link href={props.href ? props.href : '#'} >
                <p style={{padding: buttonVariant.padding}}>
                    {props.text}
                </p>
            </Link>
        </div>
    )
}

export default LinkButton