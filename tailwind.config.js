/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gentle-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "smooth-bounce": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-2px)",
          },
        },
        "slow-spin": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-3px)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            filter: "brightness(1) drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))",
          },
          "50%": {
            filter: "brightness(1.2) drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))",
          },
        },
        "ai-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.6), 0 0 25px rgba(147, 51, 234, 0.4)",
          },
        },
        "sparkle-twinkle": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.2)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "gradient-shift": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(30, 58, 138, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(30, 58, 138, 0.8), 0 0 30px rgba(30, 58, 138, 0.6)",
          },
        },
        "arc-reactor": {
          "0%": {
            boxShadow: "0 0 10px rgba(30, 58, 138, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(30, 58, 138, 0.8), 0 0 30px rgba(30, 58, 138, 0.6), 0 0 40px rgba(30, 58, 138, 0.4)",
          },
          "100%": {
            boxShadow: "0 0 10px rgba(30, 58, 138, 0.5)",
          },
        },
        "holographic-glow": {
          "0%": {
            boxShadow: "0 0 15px rgba(30, 58, 138, 0.4), inset 0 0 15px rgba(30, 58, 138, 0.1)",
            transform: "translateY(-5px) rotateX(3deg)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(30, 58, 138, 0.7), 0 0 50px rgba(30, 58, 138, 0.5), inset 0 0 25px rgba(30, 58, 138, 0.2)",
            transform: "translateY(-7px) rotateX(4deg)",
          },
          "100%": {
            boxShadow: "0 0 15px rgba(30, 58, 138, 0.4), inset 0 0 15px rgba(30, 58, 138, 0.1)",
            transform: "translateY(-5px) rotateX(3deg)",
          },
        },
        "holographic-border": {
          "0%": {
            background: "linear-gradient(45deg, rgba(30, 58, 138, 0.4), rgba(59, 79, 125, 0.6), rgba(30, 58, 138, 0.4))",
          },
          "50%": {
            background: "linear-gradient(45deg, rgba(30, 58, 138, 0.8), rgba(245, 245, 220, 0.9), rgba(30, 58, 138, 0.8))",
          },
          "100%": {
            background: "linear-gradient(45deg, rgba(30, 58, 138, 0.4), rgba(59, 79, 125, 0.6), rgba(30, 58, 138, 0.4))",
          },
        },
        "gradient-flow": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "teal-gradient-flow": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "explosion": {
          "0%": {
            transform: "scale(0.8) rotate(0deg)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.2) rotate(180deg)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1.5) rotate(360deg)",
            opacity: "0",
          },
        },
        "explosion-particles": {
          "0%": {
            transform: "scale(0) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1) rotate(180deg)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1.5) rotate(360deg)",
            opacity: "0",
          },
        },
        "shimmer-blue": {
          "0%": {
            backgroundPosition: "-200% center",
          },
          "100%": {
            backgroundPosition: "200% center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gentle-pulse": "gentle-pulse 3s ease-in-out infinite",
        "smooth-bounce": "smooth-bounce 2s ease-in-out infinite",
        "slow-spin": "slow-spin 8s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "ai-glow": "ai-glow 2s ease-in-out infinite",
        "sparkle-twinkle": "sparkle-twinkle 1.5s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "arc-reactor": "arc-reactor 2s ease-in-out infinite",
        "holographic-glow": "holographic-glow 2s ease-in-out infinite",
        "holographic-border": "holographic-border 2s ease-in-out infinite",
        "gradient-flow": "gradient-flow 3s ease-in-out infinite",
        "teal-gradient-flow": "teal-gradient-flow 2s ease-in-out infinite",
        "explosion": "explosion 0.6s ease-out",
        "explosion-particles": "explosion-particles 0.8s ease-out",
        "shimmer-blue": "shimmer-blue 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
