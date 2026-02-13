"use client"

import { useRef, useEffect, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
    src: string
    poster?: string
    autoPlay?:
    boolean
    lessonId: string
    onCompleted?: () => void
}

export function VideoPlayer({ src, poster, autoPlay = false, lessonId, onCompleted }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    // Progress Tracking Throttling
    const lastProgressUpdate = useRef<number>(0)

    useEffect(() => {
        if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(() => setIsPlaying(false))
        }
    }, [autoPlay, src])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime
            const total = videoRef.current.duration
            const percent = (current / total) * 100

            setCurrentTime(current)
            setProgress(percent)

            // Track progress every 30 seconds or when 90% completed
            const now = Date.now()
            if (now - lastProgressUpdate.current > 30000 || (percent > 90 && lastProgressUpdate.current === 0)) {
                saveProgress(lessonId, percent > 90, current)
                lastProgressUpdate.current = now
            }
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        saveProgress(lessonId, true, duration)
        if (onCompleted) onCompleted()
    }

    const saveProgress = async (id: string, completed: boolean, time: number) => {
        try {
            await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: id, completed, timeSpent: Math.floor(time) }),
            })
            console.log("Progress saved", { id, completed, time })
        } catch (error) {
            console.error("Failed to save progress", error)
        }
    }

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0]
        setVolume(newVolume)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
            setIsMuted(newVolume === 0)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted
            setIsMuted(newMuted)
            videoRef.current.muted = newMuted
        }
    }

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                videoRef.current.requestFullscreen()
            }
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="relative group bg-black rounded-lg overflow-hidden shadow-xl aspect-video">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress Bar */}
                <div className="relative w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer">
                    <div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>

                        <div className="flex items-center gap-2 group/vol">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300">
                                <Slider
                                    defaultValue={[1]}
                                    max={1}
                                    step={0.1}
                                    value={[isMuted ? 0 : volume]}
                                    onValueChange={handleVolumeChange}
                                    className="w-20"
                                />
                            </div>
                        </div>

                        <span className="text-sm font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                        <Maximize className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="bg-primary/90 p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                </div>
            )}
        </div>
    )
}
