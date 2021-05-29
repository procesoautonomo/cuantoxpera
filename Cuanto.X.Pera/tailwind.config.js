const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
        enabled: true,
        content: [
            './Web.UI/**/*.html',
            './Web.UI/**/*.razor'
        ],
    },
    darkMode: 'class',
    theme: {
        boxShadow: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            none: 'none',
            light: '0 1px 3px 0 rgba(61, 65, 78, 1), 0 1px 2px 0 rgba(61, 65, 78, 1)',
            'light-md': '0 4px 6px -1px rgba(61, 65, 78, 1), 0 2px 4px -1px rgba(61, 65, 78, 1)'
        },
        extend: {
            boxShadow: ['dark'],
            colors: {
                black: '#0D0D0D',
                orange: {
                    50: '#F9F3EF',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#EC693C',
                    600: '#CC561E',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#592323'
                },
                gray:{
                    950: "#1A1C23",
                  }
            },
        },
    },
    variants: {
        extend: {
            boxShadow: ['dark']
        }
    },
    plugins: [],
}
