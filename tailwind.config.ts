import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			zIndex: {
        'base': '1',
        'dropdown': '1000',
        'overlay': '2000',
        'modal': '3000',
        'escape-hatch': '9999',
      },
			// Add glassmorphism-specific utilities
			backdropBlur: {
				'glass': '12px',
				'glass-strong': '16px',
				'glass-subtle': '8px',
			},
			
			boxShadow: {
				'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
				'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
				'glass-hover': '0 12px 48px rgba(31, 38, 135, 0.5)',
				'glass-hover-dark': '0 12px 48px rgba(0, 0, 0, 0.7)',
			},
			
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				// Custom cream/neon color palette based on #E5D6C4
				cream: {
					50: '#faf8f6',
					100: '#f5f1ed',
					200: '#ebe3da',
					300: '#e5d6c4', // Base color
					400: '#d9c4a8',
					500: '#cdb08c',
					600: '#b8966f',
					700: '#9a7a57',
					800: '#7d6247',
					900: '#645039',
				},
				neon: {
					cream: '#E5D6C4',
					'cream-light': '#F0E6D9',
					'cream-dark': '#DAC5AF',
					'cream-glow': 'rgba(229, 214, 196, 0.8)',
					'cream-shadow': 'rgba(229, 214, 196, 0.4)',
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				glass: '20px',
				'glass-sm': '12px',
				'glass-lg': '24px',
			},
			animation: {
				"meteor-effect": "meteor 5s linear infinite",
				"gradient-border": "gradientBorder 3s linear infinite",
				'float': 'float 6s ease-in-out infinite',
				'glass-shimmer': 'glass-shimmer 2s linear infinite',
			},
			backgroundImage: {
				'warm-sunset': 'linear-gradient(90deg, #f7e6d4, #e2b8a1, #d89e88, #c77c6b, #a65d54)',
				'glass-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				'glass-gradient-dark': 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
				'glass-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
			},
			keyframes: {
				meteor: {
					"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
					"70%": { opacity: "1" },
					"100%": {
						transform: "rotate(215deg) translateX(-500px)",
						opacity: "0",
					},
				},
				gradientBorder: {
					"0%, 100%": {
						borderImage:
							"linear-gradient(0deg, rgba(255,128,0,0.7), rgba(255,255,0,0.7), rgba(0,255,0,0.7), rgba(0,255,255,0.7), rgba(0,0,255,0.7), rgba(128,0,255,0.7), rgba(255,0,128,0.7)) 1",
						boxShadow:
							"0 0 5px rgba(255,0,0,0.2), 0 0 10px rgba(0,255,255,0.2), 0 0 15px rgba(255,0,255,0.2)",
					},
					"50%": {
						borderImage:
							"linear-gradient(180deg, rgba(255,128,0,0.7), rgba(255,255,0,0.7), rgba(0,255,0,0.7), rgba(0,255,255,0.7), rgba(0,0,255,0.7), rgba(128,0,255,0.7), rgba(255,0,128,0.7)) 1",
						boxShadow:
							"0 0 10px rgba(255,0,0,0.3), 0 0 20px rgba(0,255,255,0.3), 0 0 30px rgba(255,0,255,0.3)",
					},
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'glass-shimmer': {
					'0%': { backgroundPosition: '-200px 0' },
					'100%': { backgroundPosition: 'calc(200px + 100%) 0' },
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
