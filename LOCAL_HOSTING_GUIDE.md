# 🚀 Local Hosting Guide for Stark Workspace

This is a **Next.js 14** application. Follow these steps to run it locally.

## Prerequisites

✅ **Node.js** (v18+) and **npm** are already installed on your system
- npm version: 10.9.0

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies
```powershell
cd C:\Users\Nkosinathi\Downloads\stark-workspaceSecondone
npm install
```

### Step 2: Run Development Server
```powershell
npm run dev
```

### Step 3: Open in Browser
- 🌐 Go to: **http://localhost:3000**
- Your app will be live and auto-refresh on code changes

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run linter checks |

---

## 🔧 Development Workflow

### Development Mode (Recommended for Development)
```powershell
npm run dev
```
- Auto-refreshes when you save code changes
- Shows errors in the browser
- Perfect for debugging

### Production Build & Start
```powershell
npm run build
npm start
```
- Optimized for performance
- Use this to test production behavior

---

## 🐛 Troubleshooting

### Port 3000 Already in Use?
If port 3000 is busy, Next.js will use 3001:
```
> ready - started server on 0.0.0.0:3001
```
Access it at: **http://localhost:3001**

### Need to Kill a Process?
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Dependencies Not Installing?
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
npm install
```

---

## 📁 Project Structure

```
stark-workspaceSecondone/
├── app/                      # Next.js app directory
│   ├── bizora/              # Bizora AI page (FIXED ✅)
│   ├── hypeos/              # HypeOS features
│   ├── api/                 # API routes
│   └── ...
├── components/              # React components
├── lib/                      # Utility functions
├── public/                   # Static files
├── package.json             # Dependencies
└── next.config.mjs          # Next.js config
```

---

## 🌍 Environment Setup

Your project doesn't require `.env` configuration to run locally.
If you need API keys later, create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## ✅ Navigation Fix Status

**Issue:** Click navigation not working on Bizora AI page  
**Cause:** `pointer-events-none` CSS class blocking clicks  
**Status:** ✅ **FIXED** in `app/bizora/page.tsx`

---

## 📞 Quick Reference

- **Start here:** `npm run dev`
- **Access at:** http://localhost:3000
- **Stop server:** Press `Ctrl + C` in terminal
- **View logs:** Check terminal output

Enjoy! 🎉
