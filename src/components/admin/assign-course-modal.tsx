"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Mock list of courses for assignment
const AVAILABLE_COURSES = [
    { id: "course-1", title: "Compliance Corporativo 2024" },
    { id: "course-2", title: "Seguridad de la Información" },
    { id: "course-3", title: "Liderazgo Efectivo" },
    { id: "course-4", title: "Excel Avanzado" },
]

interface AssignCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedUserIds: string[]
    onConfirm: (data: { courseId: string, dueDate: string, sendNotification: boolean }) => void
}

export function AssignCourseModal({ open, onOpenChange, selectedUserIds, onConfirm }: AssignCourseModalProps) {
    const [courseId, setCourseId] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [sendNotification, setSendNotification] = useState(true)

    const handleSubmit = () => {
        if (!courseId) return
        onConfirm({ courseId, dueDate, sendNotification })
        onOpenChange(false)
        // Reset
        setCourseId("")
        setDueDate("")
        setSendNotification(true)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Curso Masivo</DialogTitle>
                    <DialogDescription>
                        Asignando curso a {selectedUserIds.length} usuarios seleccionados.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="course">Curso</Label>
                        <Select value={courseId} onValueChange={setCourseId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar curso..." />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABLE_COURSES.map(course => (
                                    <SelectItem key={course.id} value={course.id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dueDate">Fecha Límite (Opcional)</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="notify"
                            checked={sendNotification}
                            onCheckedChange={(checked) => setSendNotification(!!checked)}
                        />
                        <Label htmlFor="notify">Enviar notificación por email</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={!courseId}>Asignar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
