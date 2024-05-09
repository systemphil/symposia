export function CardShell({
    children,
    addClasses,
}: {
    children: React.ReactNode;
    addClasses?: string;
}) {
    return (
        <div
            className={`card rounded shadow-xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90  md:bg-gradient-to-bl ${addClasses}`}
        >
            {children}
        </div>
    );
}
