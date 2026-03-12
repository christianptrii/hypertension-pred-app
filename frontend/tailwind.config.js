// tailwind.config.js
export default {
    theme: {
        extend: {
            animation: {
                'scan': 'scan 2s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
}