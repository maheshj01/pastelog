import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Pastelog',
        short_name: 'Pastelog',
        description: 'Create Stunning AI Powered Rich notes with markdown Support',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/public/favicon/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/public/favicon/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}