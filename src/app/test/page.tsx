import Link from "next/link";

export default async function TestPage() {
    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with hardcoded retrieval from db</p>
            <div className="container">
                <p>Scheduled for deletion</p>
                <br></br>
                <Link href="/test/buddy/">
                    <button className="btn btn-accent">1 dynamic path</button>
                </Link>
                <br></br>
                <Link href="/test/buddy/loving-buddy">
                    <button className="btn btn-accent">2 dynamic path</button>
                </Link>
            </div>
        </main>
    );
}
