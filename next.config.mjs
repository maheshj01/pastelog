/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
});

export default withPWA({
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    reactStrictMode: true,
});
// const nextConfig = {
//     // output: 'export',
//     trailingSlash: true,
//     images: {
//         unoptimized: true
//     }
// };

// export default nextConfig;
