import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],


  theme: {
	fontFamily: {
		sans: [
			'Manrope',
			'system-ui',
			'serif'
		]
	},
	extend: {
		boxShadow: {
			md: '0px 2px 4px -1px rgba(175, 182, 201, 0.2);',
			lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)',
			'dark-md': 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px',
			sm: '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
			'btn-shadow': 'box-shadow: rgba(0, 0, 0, .05) 0 9px 17.5px',
			tw: 'rgba(175, 182, 201, 0.2) 0px 2px 4px -1px',
			btnshdw: '0 17px 20px -8px rgba(77, 91, 236, .231372549)',
			elevation1: '0px 12px 30px -2px rgba(58,75,116,0.14);',
			elevation2: '0px 24px 24px -12px rgba(0,0,0,0.05);',
			elevation3: '0px 24px 24px -12px rgba(99,91,255,0.15);',
			elevation4: '0px 12px 12px -6px rgba(0,0,0,0.15)'
		},
		borderRadius: {
			sm: "6px",
			md: "9px",
			lg: "24px",
			tw: "12px",
			bb: "20px",
		},
		container: {
			center: true,
			padding: '20px'
		},
		letterSpacing: {
			tightest: '-.075em',
			tighter: '-.05em',
			tight: '-.025em',
			normal: '0',
			wide: '.025em',
			wider: '.05em',
			widest: '1.5px'
		},
		gap: {
			'30': '30px'
		},
		padding: {
			'30': '30px'
		},
		margin: {
			'30': '30px'
		},
		fontSize: {
			'15': '15px',
			'17': '17px',
			'13': '13px',
			'22': '22px',
			'28': '28px',
			'34': '34px',
			'40': '40px',
			'44': '44px',
			'50': '50px',
			'56': '56px',
			'64': '64px'
		},
		colors: {
			// ==================== NEW: Standard 50-900 Scale ====================
			// Primary Colors - Standard scale (50-900)
			primary: {
				50: 'var(--color-primary-50)',
				100: 'var(--color-primary-100)',
				200: 'var(--color-primary-200)',
				300: 'var(--color-primary-300)',
				400: 'var(--color-primary-400)',
				500: 'var(--color-primary-500)',
				600: 'var(--color-primary-600)',
				700: 'var(--color-primary-700)',
				800: 'var(--color-primary-800)',
				900: 'var(--color-primary-900)',
				DEFAULT: 'var(--color-primary-500)',
				// Legacy support
				light: 'var(--color-primary-50)',
				'light-hover': 'var(--color-primary-100)',
				'light-active': 'var(--color-primary-100)',
				hover: 'var(--color-primary-600)',
				active: 'var(--color-primary-700)',
				dark: 'var(--color-primary-700)',
				'dark-hover': 'var(--color-primary-800)',
				'dark-active': 'var(--color-primary-800)',
				darker: 'var(--color-primary-900)',
			},
			// Secondary Colors - Standard scale (50-900)
			secondary: {
				50: 'var(--color-secondary-50)',
				100: 'var(--color-secondary-100)',
				200: 'var(--color-secondary-200)',
				300: 'var(--color-secondary-300)',
				400: 'var(--color-secondary-400)',
				500: 'var(--color-secondary-500)',
				600: 'var(--color-secondary-600)',
				700: 'var(--color-secondary-700)',
				800: 'var(--color-secondary-800)',
				900: 'var(--color-secondary-900)',
				DEFAULT: 'var(--color-secondary-500)',
				// Legacy support
				light: 'var(--color-secondary-50)',
				'light-hover': 'var(--color-secondary-100)',
				'light-active': 'var(--color-secondary-100)',
				hover: 'var(--color-secondary-600)',
				active: 'var(--color-secondary-700)',
				dark: 'var(--color-secondary-700)',
				'dark-hover': 'var(--color-secondary-800)',
				'dark-active': 'var(--color-secondary-800)',
				darker: 'var(--color-secondary-900)',
			},
			// Success Colors - Standard scale (50-900)
			success: {
				50: 'var(--color-success-50)',
				100: 'var(--color-success-100)',
				200: 'var(--color-success-200)',
				300: 'var(--color-success-300)',
				400: 'var(--color-success-400)',
				500: 'var(--color-success-500)',
				600: 'var(--color-success-600)',
				700: 'var(--color-success-700)',
				800: 'var(--color-success-800)',
				900: 'var(--color-success-900)',
				DEFAULT: 'var(--color-success-500)',
				// Legacy support
				light: 'var(--color-success-50)',
				'light-hover': 'var(--color-success-100)',
				'light-active': 'var(--color-success-100)',
				hover: 'var(--color-success-600)',
				active: 'var(--color-success-700)',
				dark: 'var(--color-success-700)',
				'dark-hover': 'var(--color-success-800)',
				'dark-active': 'var(--color-success-800)',
				darker: 'var(--color-success-900)',
			},
			// Info Colors - Standard scale (50-900)
			info: {
				50: 'var(--color-info-50)',
				100: 'var(--color-info-100)',
				200: 'var(--color-info-200)',
				300: 'var(--color-info-300)',
				400: 'var(--color-info-400)',
				500: 'var(--color-info-500)',
				600: 'var(--color-info-600)',
				700: 'var(--color-info-700)',
				800: 'var(--color-info-800)',
				900: 'var(--color-info-900)',
				DEFAULT: 'var(--color-info-500)',
				// Legacy support
				light: 'var(--color-info-50)',
				'light-hover': 'var(--color-info-100)',
				'light-active': 'var(--color-info-100)',
				hover: 'var(--color-info-600)',
				active: 'var(--color-info-700)',
				dark: 'var(--color-info-700)',
				'dark-hover': 'var(--color-info-800)',
				'dark-active': 'var(--color-info-800)',
				darker: 'var(--color-info-900)',
			},
			// Warning Colors - Standard scale (50-900)
			warning: {
				50: 'var(--color-warning-50)',
				100: 'var(--color-warning-100)',
				200: 'var(--color-warning-200)',
				300: 'var(--color-warning-300)',
				400: 'var(--color-warning-400)',
				500: 'var(--color-warning-500)',
				600: 'var(--color-warning-600)',
				700: 'var(--color-warning-700)',
				800: 'var(--color-warning-800)',
				900: 'var(--color-warning-900)',
				DEFAULT: 'var(--color-warning-500)',
				// Legacy support
				light: 'var(--color-warning-50)',
				'light-hover': 'var(--color-warning-100)',
				'light-active': 'var(--color-warning-100)',
				hover: 'var(--color-warning-600)',
				active: 'var(--color-warning-700)',
				dark: 'var(--color-warning-700)',
				'dark-hover': 'var(--color-warning-800)',
				'dark-active': 'var(--color-warning-800)',
				darker: 'var(--color-warning-900)',
			},
			// Error/Danger Colors - Standard scale (50-900)
			error: {
				50: 'var(--color-error-50)',
				100: 'var(--color-error-100)',
				200: 'var(--color-error-200)',
				300: 'var(--color-error-300)',
				400: 'var(--color-error-400)',
				500: 'var(--color-error-500)',
				600: 'var(--color-error-600)',
				700: 'var(--color-error-700)',
				800: 'var(--color-error-800)',
				900: 'var(--color-error-900)',
				DEFAULT: 'var(--color-error-500)',
				// Legacy support
				light: 'var(--color-error-50)',
				'light-hover': 'var(--color-error-100)',
				'light-active': 'var(--color-error-100)',
				hover: 'var(--color-error-600)',
				active: 'var(--color-error-700)',
				dark: 'var(--color-error-700)',
				'dark-hover': 'var(--color-error-800)',
				'dark-active': 'var(--color-error-800)',
				darker: 'var(--color-error-900)',
			},
			// Danger alias (same as error)
			danger: {
				50: 'var(--color-danger-50)',
				100: 'var(--color-danger-100)',
				200: 'var(--color-danger-200)',
				300: 'var(--color-danger-300)',
				400: 'var(--color-danger-400)',
				500: 'var(--color-danger-500)',
				600: 'var(--color-danger-600)',
				700: 'var(--color-danger-700)',
				800: 'var(--color-danger-800)',
				900: 'var(--color-danger-900)',
				DEFAULT: 'var(--color-danger-500)',
				// Legacy support
				light: 'var(--color-danger-50)',
				'light-hover': 'var(--color-danger-100)',
				'light-active': 'var(--color-danger-100)',
				hover: 'var(--color-danger-600)',
				active: 'var(--color-danger-700)',
				dark: 'var(--color-danger-700)',
				'dark-hover': 'var(--color-danger-800)',
				'dark-active': 'var(--color-danger-800)',
				darker: 'var(--color-danger-900)',
			},
			// ==================== NEW: Neutral/Grayscale Colors ====================
			// Neutral Colors - N0 to N900 scale
			neutral: {
				0: 'var(--color-neutral-0)',
				10: 'var(--color-neutral-10)',
				20: 'var(--color-neutral-20)',
				30: 'var(--color-neutral-30)',
				40: 'var(--color-neutral-40)',
				50: 'var(--color-neutral-50)',
				60: 'var(--color-neutral-60)',
				70: 'var(--color-neutral-70)',
				80: 'var(--color-neutral-80)',
				90: 'var(--color-neutral-90)',
				100: 'var(--color-neutral-100)',
				200: 'var(--color-neutral-200)',
				300: 'var(--color-neutral-300)',
				400: 'var(--color-neutral-400)',
				500: 'var(--color-neutral-500)',
				600: 'var(--color-neutral-600)',
				700: 'var(--color-neutral-700)',
				800: 'var(--color-neutral-800)',
				900: 'var(--color-neutral-900)',
				DEFAULT: 'var(--color-neutral-500)',
			},
			// ==================== LEGACY COLORS ====================
			// Ascent Colors (keeping old values for backward compatibility)
			ascent: {
				light: 'var(--color-ascent-light)',
				'light-hover': 'var(--color-ascent-light-hover)',
				'light-active': 'var(--color-ascent-light-active)',
				DEFAULT: 'var(--color-ascent)',
				hover: 'var(--color-ascent-hover)',
				active: 'var(--color-ascent-active)',
				dark: 'var(--color-ascent-dark)',
				'dark-hover': 'var(--color-ascent-dark-hover)',
				'dark-active': 'var(--color-ascent-dark-active)',
				darker: 'var(--color-ascent-darker)',
			},
			// Background colors (mapped to neutral)
			bg: {
				light: 'var(--color-bg-light)',
				'light-hover': 'var(--color-bg-light-hover)',
				'light-active': 'var(--color-bg-light-active)',
				normal: 'var(--color-bg-normal)',
				'normal-hover': 'var(--color-bg-normal-hover)',
				'normal-active': 'var(--color-normal-active)',
				dark: 'var(--color-bg-dark)',
				'dark-hover': 'var(--color-bg-dark-hover)',
				'dark-active': 'var(--color-bg-dark-active)',
				darker: 'var(--color-bg-darker)',
			},
			// Text colors (mapped to neutral)
			text: {
				light: 'var(--color-text-light)',
				'light-hover': 'var(--color-text-light-hover)',
				'light-active': 'var(--color-text-light-active)',
				DEFAULT: 'var(--color-text)',
				hover: 'var(--color-text-hover)',
				active: 'var(--color-text-active)',
				dark: 'var(--color-text-dark)',
				'dark-hover': 'var(--color-text-dark-hover)',
				'dark-active': 'var(--color-text-dark-active)',
				darker: 'var(--color-text-darker)',
			},
			// Legacy single colors
			cyan: {
				'500': 'var(--color-primary)',
				'600': 'var(--color-primary)',
				'700': 'var(--color-primary)'
			},
			lightprimary: 'var(--color-lightprimary)',
			lightsecondary: 'var(--color-lightsecondary)',
			lightsuccess: 'var(--color-lightsuccess)',
			lighterror: 'var(--color-lighterror)',
			lightinfo: 'var(--color-lightinfo)',
			lightwarning: 'var(--color-lightwarning)',
			border: 'var(--color-border)',
			bordergray: 'var(--color-bordergray)',
			lightgray: 'var(--color-lightgray)',
			muted: 'var(--color-muted)',
			lighthover: 'var(--color-lighthover)',
			surface: 'var(--color-surface-ld)',
			sky: 'var(--color-sky)',
			bodytext: 'var(--color-bodytext)',
			dark: 'var(--color-dark)',
			link: 'var(--color-link)',
			darklink: 'var(--color-darklink)',
			darkborder: 'var(--color-darkborder)',
			darkgray: 'var(--color-darkgray)',
			primaryemphasis: 'var(--color-primary-emphasis)',
			secondaryemphasis: 'var(--color-secondary-emphasis)',
			warningemphasis: 'var(--color-warning-emphasis)',
			erroremphasis: 'var(--color-error-emphasis)',
			successemphasis: 'var(--color-success-emphasis)',
			infoemphasis: 'var(--color-info-emphasis)',
			darkmuted: 'var(--color-darkmuted)'
		}
	}
  },
  plugins: [
      require("tailwindcss-animate")
],
};
export default config;
