export function CreateAndShare() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen pt-8">
            <p className="text-3xl mt-8 mb-4 text-center">
                Create and Share Logs
            </p>
            <p>Create stunning logs in minutes with markdown support and share with anyone using a unique URL</p>
            <p className="text-center">Supports exporting logs in Image or Text format</p>
            <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                <video
                    src="https://github.com/maheshmnj/pastelog/assets/31410839/c4e4469b-3acb-45e1-a258-0d8593d1e831"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
} 