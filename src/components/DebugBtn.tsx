interface DebugBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
}

export function DebugBtn ({ 
    children, ...props 
}: DebugBtnProps) {
    return <button className="btn btn-warning btn-xs m-2 border-dotted border-2 border-black hover:border-solid hover:border-black hover:border-2 duration-200" {...props}>{children}</button>;
}