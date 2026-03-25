import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TeacherState {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useTeacherStore = create<TeacherState>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme) => set({ theme }),
        }),
        { 
            name: 'teacher-preferences',
        }
    )
)
