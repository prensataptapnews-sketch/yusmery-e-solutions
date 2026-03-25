"use client"

import { useEffect, useState } from 'react'
import { useTeacherStore } from '@/store/useTeacherStore'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTeacherStore()
    const [mounted, setMounted] = useState(false)
    const [isActuallyDark, setIsActuallyDark] = useState(false)

    useEffect(() => {
        setMounted(true)
        const root = document.documentElement;
        
        const applyTheme = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const resolvedDark = theme === 'dark' || (theme === 'system' && systemPrefersDark)
            
            setIsActuallyDark(resolvedDark)
            
            if (resolvedDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
        
        applyTheme()

        if (theme === 'system') {
            const listener = (e: MediaQueryListEvent) => {
                setIsActuallyDark(e.matches)
                if (e.matches) root.classList.add('dark')
                else root.classList.remove('dark')
            }
            const media = window.matchMedia('(prefers-color-scheme: dark)')
            media.addEventListener('change', listener)
            return () => media.removeEventListener('change', listener)
        }
    }, [theme])

    if (!mounted) {
        return (
            <div 
                className="flex p-1 rounded-xl shadow-inner border"
                style={{ backgroundColor: '#e2e8f0', borderColor: '#cbd5e1', width: '104px', height: '40px' }} 
            />
        )
    }

    // Unbreakable Inline Style Colors based solely on React State
    const containerBg = isActuallyDark ? '#020617' : '#e2e8f0' // slate-950 | slate-200
    const containerBorder = isActuallyDark ? '#1e293b' : '#cbd5e1' // slate-800 | slate-300
    
    const activeBg = isActuallyDark ? '#1e293b' : '#ffffff' // slate-800 | white
    const activeText = isActuallyDark ? '#ffffff' : '#4f46e5' // white | indigo-600
    
    // Crucial: High-contrast inactive colors guarantee the icons are ALWAYS visible
    const inactiveText = isActuallyDark ? '#94a3b8' : '#64748b' // slate-400 | slate-500

    return (
        <div 
            className="flex p-1 rounded-xl shadow-inner border transition-colors duration-300"
            style={{ backgroundColor: containerBg, borderColor: containerBorder }}
        >
            <button
                onClick={() => setTheme('light')}
                className="p-2 rounded-lg flex items-center justify-center transition-all"
                style={{
                    backgroundColor: theme === 'light' ? activeBg : 'transparent',
                    color: theme === 'light' ? activeText : inactiveText,
                    boxShadow: theme === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    fontWeight: theme === 'light' ? 'bold' : 'normal'
                }}
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className="p-2 rounded-lg flex items-center justify-center transition-all"
                style={{
                    backgroundColor: theme === 'system' ? activeBg : 'transparent',
                    color: theme === 'system' ? activeText : inactiveText,
                    boxShadow: theme === 'system' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    fontWeight: theme === 'system' ? 'bold' : 'normal'
                }}
            >
                <Monitor className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className="p-2 rounded-lg flex items-center justify-center transition-all"
                style={{
                    backgroundColor: theme === 'dark' ? activeBg : 'transparent',
                    color: theme === 'dark' ? activeText : inactiveText,
                    boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    fontWeight: theme === 'dark' ? 'bold' : 'normal'
                }}
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    )
}
