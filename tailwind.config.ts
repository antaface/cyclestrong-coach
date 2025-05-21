
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                // Joyful Health theme colors
                'joyful': {
                    'coral': '#F27261',
                    'peach': '#F9D5B4',
                    'clay': '#D4504C',
                    'green': '#9FB79C',
                    'cream': '#FFFDF9',
                    'orange': '#F49E85'
                },
                // Add text color for secondary text
                'secondary-text': '#5F5F5F',
                'placeholder': '#9A9A9A',
			},
			fontFamily: {
				'display': ['Author', 'system-ui', 'sans-serif'],
				'body': ['Author', 'system-ui', 'sans-serif'],
                'author': ['Author', 'system-ui', 'sans-serif'],
			},
            fontSize: {
                'h1': ['24px', {
                    lineHeight: '1.3',
                    letterSpacing: '-0.5px',
                    fontWeight: '700' // Bold
                }],
                'h2': ['20px', {
                    lineHeight: '1.4',
                    fontWeight: '500' // Medium
                }],
                'h3': ['16px', {
                    lineHeight: '1.4',
                    fontWeight: '500' // Medium
                }],
                'body': ['15px', {
                    lineHeight: '1.6',
                    fontWeight: '400' // Regular
                }],
                'secondary': ['13px', {
                    lineHeight: '1.5',
                    fontWeight: '400' // Regular
                }],
                'button-primary': ['15px', {
                    fontWeight: '700' // Bold
                }],
                'button-secondary': ['14px', {
                    fontWeight: '500' // Medium
                }],
                'label': ['14px', {
                    fontWeight: '400' // Regular
                }],
                'placeholder': ['14px', {
                    fontWeight: '400' // Regular
                }],
            },
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
			},
			opacity: {
				'15': '0.15',
			},
			spacing: {
                // 8px spacing system
                '1': '8px',
                '2': '16px',
                '3': '24px',
                '4': '32px',
                '5': '40px',
                '6': '48px',
            },
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'pulse-ring': {
                    '0%': { transform: 'scale(0.8)', opacity: '0.8' },
                    '50%': { transform: 'scale(1)', opacity: '0.4' },
                    '100%': { transform: 'scale(0.8)', opacity: '0.8' }
                },
                'subtle-bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
