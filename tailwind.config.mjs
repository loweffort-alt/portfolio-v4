/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['selector', 'class'],
  theme: {
  	fontSize: {
  		xs: [
  			'var(--font-size-xs)',
  			{
  				lineHeight: 'var(--line-height-xs)'
  			}
  		],
  		sm: [
  			'var(--font-size-sm)',
  			{
  				lineHeight: 'var(--line-height-sm)'
  			}
  		],
  		base: [
  			'var(--font-size-base)',
  			{
  				lineHeight: 'var(--line-height-base)'
  			}
  		],
  		lg: [
  			'var(--font-size-lg)',
  			{
  				lineHeight: 'var(--line-height-lg)'
  			}
  		],
  		xl: [
  			'var(--font-size-xl)',
  			{
  				lineHeight: 'var(--line-height-xl)'
  			}
  		],
  		'2xl': [
  			'var(--font-size-2xl)',
  			{
  				lineHeight: 'var(--line-height-2xl)'
  			}
  		],
  		'3xl': [
  			'var(--font-size-3xl)',
  			{
  				lineHeight: 'var(--line-height-3xl)'
  			}
  		],
  		'4xl': [
  			'var(--font-size-4xl)',
  			{
  				lineHeight: 'var(--line-height-4xl)'
  			}
  		],
  		'5xl': [
  			'var(--font-size-5xl)',
  			{
  				lineHeight: 'var(--line-height-5xl)'
  			}
  		],
  		'6xl': [
  			'var(--font-size-6xl)',
  			{
  				lineHeight: 'var(--line-height-6xl)'
  			}
  		],
  		'7xl': [
  			'var(--font-size-7xl)',
  			{
  				lineHeight: 'var(--line-height-7xl)'
  			}
  		],
  		'8xl': [
  			'var(--font-size-8xl)',
  			{
  				lineHeight: 'var(--line-height-8xl)'
  			}
  		],
  		'9xl': [
  			'var(--font-size-9xl)',
  			{
  				lineHeight: 'var(--line-height-9xl)'
  			}
  		]
  	},
  	extend: {
  		colors: {
  			black: '#222222',
  			white: '#f1f1f1',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    typography,
      require("tailwindcss-animate")
],
}
