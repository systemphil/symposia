type ButtonVariant = {
    class: string;
    padding: string;
}

const buttonVariants: { [key: string] : ButtonVariant} = {
    'rounded-blue': {
        class: 'rounded-lg bg-blue-300 justify-center',
        padding: '20px'
    }
}

const enum ButtonVariantEnum {
    roundedBlue = 'rounded-blue',
}

export { ButtonVariantEnum, buttonVariants, type ButtonVariant }