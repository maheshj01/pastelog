import Image from 'next/image';

export function SaveLocally() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen pt-8">
            <p className="text-3xl mt-8 mb-4 text-center">
                Save Logs Locally
            </p>
            <p className="text-center">Your logs are saved locally on device, so that you can access them without signing in.</p>
            <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={'/images/local.png'}
                    alt="Feature 3"
                    layout="responsive"
                    width={1024}
                    height={768}
                    className="transition-transform duration-500 transform hover:scale-105"
                />
            </div>
        </section>
    );
} 