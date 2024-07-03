import Link from 'next/link';

const TermsAndPrivacy = () => {
    return (
        <div className="min-h-screen text-black">
            <div className="max-w-4xl mx-auto bg-white shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">Terms of Use and Privacy Policy</h1>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Terms of Use</h2>
                    <p className="mb-4">
                        Welcome to Pastelog, an open-source logging application hosted on GitHub. By using our services, you agree to the following terms and conditions:
                    </p>
                    <ul className="list-disc list-inside mb-6">
                        <li>You are responsible for your content and actions.</li>
                        <li>You must not misuse our services for any illegal or unauthorized purposes.</li>
                        <li>We reserve the right to modify or terminate our services at any time.</li>
                    </ul>
                    <p className="mb-4">
                        For the complete Terms of Use, please visit our{' '}
                        <Link href={`${process.env.NEXT_PUBLIC_PRIVACY_POLICY}`} className="text-blue-500 hover:text-blue-700">
                            Terms of Use
                        </Link>{' '}
                        page.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
                    <p className="mb-4">
                        At Pastelog, we value your privacy and strive to protect your personal information. Our Privacy Policy outlines how we collect, use, and safeguard your data.
                    </p>
                    <ul className="list-disc list-inside mb-6">
                        <li>We collect only the necessary information to provide our services.</li>
                        <li>We do not share your personal data with third parties without your consent.</li>
                        <li>We implement industry-standard security measures to protect your data.</li>
                    </ul>
                    <p className="mb-4">
                        For more details, please visit our{' '}
                        <Link href={`${process.env.NEXT_PUBLIC_PRIVACY_POLICY}`} className="text-blue-500 hover:text-blue-700">
                            Privacy Policy
                        </Link>{' '}
                        page.
                    </p>
                </div>
                <div className="mt-8">
                    <p className="mb-4">
                        Pastelog is an open-source project hosted on GitHub. You can contribute to the project or report issues by visiting our{' '}
                        <Link href={`${process.env.NEXT_PUBLIC_GITHUB_REPO}`} className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                            GitHub repository
                        </Link>
                        .
                    </p>
                    <p>
                        If you have any questions or concerns, please feel free to contact us at{' '}
                        <Link href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-blue-500 hover:text-blue-700">
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacy;