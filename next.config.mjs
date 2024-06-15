/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        'gistApi': 'https://api.github.com/gists/'
    },
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;
