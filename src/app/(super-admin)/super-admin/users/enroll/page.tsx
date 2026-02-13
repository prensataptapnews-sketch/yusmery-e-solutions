
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle,
    XCircle, Download, ArrowRight, ArrowLeft, RefreshCw, Users, Database
} from "lucide-react"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

// Types
type Step = "SOURCE" | "UPLOAD" | "SELECT_EXISTING" | "VALIDATE" | "CONFIG" | "PROCESSING" | "RESULTS"
type UserRecord = {
    email: string
    name: string
    role?: string
    company?: string
    status: "PENDING" | "SUCCESS" | "ERROR"
    message?: string
}

// Mock Existing Users
const EXISTING_USERS = [
    { id: "u1", name: "Ana García", email: "ana@techcorp.com", company: "TechCorp Inc.", role: "STUDENT" },
    { id: "u2", name: "Carlos Ruiz", email: "carlos@techcorp.com", company: "TechCorp Inc.", role: "TEACHER" },
    { id: "u3", name: "Maria López", email: "maria@globalsol.com", company: "Global Solutions", role: "ADMIN" },
    { id: "u4", name: "Juan Perez", email: "juan@globalsol.com", company: "Global Solutions", role: "STUDENT" },
    { id: "u5", name: "Sofia Diaz", email: "sofia@startuphub.com", company: "StartupHub", role: "STUDENT" },
    { id: "u6", name: "Luis Torres", email: "luis@techcorp.com", company: "TechCorp Inc.", role: "STUDENT" },
    { id: "u7", name: "Elena Volkov", email: "elena@globalsol.com", company: "Global Solutions", role: "STUDENT" },
    { id: "u8", name: "Pedro Pascal", email: "pedro@mandalorian.com", company: "Disney", role: "TEACHER" },
]

export default function EnrollUsersPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>("SOURCE")
    const [sourceType, setSourceType] = useState<"CSV" | "EXISTING" | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [records, setRecords] = useState<UserRecord[]>([])
    const [errors, setErrors] = useState<string[]>([])
    const [progress, setProgress] = useState(0)
    const [processedCount, setProcessedCount] = useState(0)
    const [successCount, setSuccessCount] = useState(0)
    const [failCount, setFailCount] = useState(0)

    // Selection State
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Config State
    const [globalRole, setGlobalRole] = useState("STUDENT")
    const [globalCompany, setGlobalCompany] = useState("1") // Default to TechCorp
    const [globalCourse, setGlobalCourse] = useState("none") // New: Course Selection
    const [duplicateAction, setDuplicateAction] = useState("SKIP")

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Helper: Generate Template
    const downloadTemplate = () => {
        const headers = "email,name,role,company_id"
        const example = "juan.perez@email.com,Juan Perez,STUDENT,1\nmaria.gomez@email.com,Maria Gomez,TEACHER,2"
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "plantilla_matricula.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Helper: Parse CSV
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0]
        if (!uploadedFile) return

        setFile(uploadedFile)
        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            const lines = text.split('\n')
            const parsedRecords: UserRecord[] = []
            const newErrors: string[] = []

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue

                const cols = line.split(',')
                if (cols.length < 2) {
                    newErrors.push(`Fila ${i + 1}: Formato inválido (faltan columnas)`)
                    continue
                }

                const email = cols[0]?.trim()
                const name = cols[1]?.trim()

                if (!email || !email.includes('@')) {
                    newErrors.push(`Fila ${i + 1}: Email inválido (${email})`)
                }

                parsedRecords.push({
                    email,
                    name,
                    role: cols[2]?.trim(),
                    company: cols[3]?.trim(),
                    status: "PENDING"
                })
            }

            setRecords(parsedRecords)
            setErrors(newErrors)
            setStep("VALIDATE")
        }
        reader.readAsText(uploadedFile)
    }

    // Helper: Handle Existing Selection
    const handleSelectionContinue = () => {
        const selectedUsers = EXISTING_USERS.filter(u => selectedUserIds.includes(u.id))
        const mappedRecords: UserRecord[] = selectedUsers.map(u => ({
            email: u.email,
            name: u.name,
            role: u.role,
            company: u.company,
            status: "PENDING"
        }))
        setRecords(mappedRecords)
        setErrors([]) // Assume existing users are valid
        setStep("VALIDATE") // Skip directly to validate/preview
    }

    const toggleUserSelection = (id: string) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        const filtered = EXISTING_USERS.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (selectedUserIds.length === filtered.length) {
            setSelectedUserIds([])
        } else {
            setSelectedUserIds(filtered.map(u => u.id))
        }
    }

    // Action: Start Processing
    const startProcessing = async () => {
        setStep("PROCESSING")
        setProgress(0)
        setProcessedCount(0)
        setSuccessCount(0)
        setFailCount(0)

        // Reset statuses
        const initialRecords = records.map(r => ({ ...r, status: "PENDING" as const, message: "" }))
        setRecords(initialRecords)

        let pCount = 0
        let sCount = 0
        let fCount = 0
        const updatedRecords = [...initialRecords]

        for (let i = 0; i < updatedRecords.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300))

            const isSuccess = Math.random() > 0.1

            if (isSuccess) {
                (updatedRecords[i] as any).status = "SUCCESS"
                updatedRecords[i].message = "Matriculado correctamente"
                sCount++
            } else {
                (updatedRecords[i] as any).status = "ERROR"
                updatedRecords[i].message = "Error: Email duplicado o inválido"
                fCount++
            }

            pCount++
            setProcessedCount(pCount)
            setSuccessCount(sCount)
            setFailCount(fCount)
            setProgress(Math.round((pCount / updatedRecords.length) * 100))
            setRecords([...updatedRecords])
        }

        setTimeout(() => setStep("RESULTS"), 1000)
    }

    const downloadReport = () => {
        const content = records.map(r =>
            `[${r.status}] ${r.email} - ${r.name}: ${r.message}`
        ).join('\n')

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `reporte_matricula_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const resetFlow = () => {
        setStep("SOURCE")
        setSourceType(null)
        setFile(null)
        setRecords([])
        setErrors([])
        setSelectedUserIds([])
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Matriculación Masiva</h1>
                <p className="text-muted-foreground">Asistentente para carga e inscripción de usuarios.</p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex justify-between items-center px-4 py-4 bg-slate-50 rounded-lg border text-[10px] md:text-xs">
                {["Fuente", "Selección", "Validación", "Configuración", "Proceso", "Resultados"].map((label, idx) => {
                    const stepOrder = ["SOURCE", sourceType === 'CSV' ? "UPLOAD" : "SELECT_EXISTING", "VALIDATE", "CONFIG", "PROCESSING", "RESULTS"]
                    const currentStepIdx = stepOrder.indexOf(step)
                    // Simplify: Source is 0, Selection/Upload is 1...
                    // "SOURCE" -> 0. "UPLOAD"/"SELECT" -> 1. "VALIDATE" -> 2.
                    const myIdx = idx // 0..5

                    // Logic to highlight steps relative to current progress
                    let status = "pending"
                    if (step === label.toUpperCase()) status = "active"

                    // Simple logic for UI (approximate)
                    const isActive = (step === "SOURCE" && idx === 0) ||
                        ((step === "UPLOAD" || step === "SELECT_EXISTING") && idx === 1) ||
                        (step === "VALIDATE" && idx === 2) ||
                        (step === "CONFIG" && idx === 3) ||
                        (step === "PROCESSING" && idx === 4) ||
                        (step === "RESULTS" && idx === 5)

                    const isCompleted = !isActive && idx < (step === "SOURCE" ? 0 :
                        step === "UPLOAD" || step === "SELECT_EXISTING" ? 1 :
                            step === "VALIDATE" ? 2 :
                                step === "CONFIG" ? 3 :
                                    step === "PROCESSING" ? 4 : 5)

                    return (
                        <div key={label} className="flex flex-col items-center gap-1 md:gap-2">
                            <div className={`
                                w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold transition-all
                                ${isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : ""}
                                ${isCompleted ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"}
                                ${!isActive && !isCompleted ? "bg-slate-200" : ""}
                            `}>
                                {isCompleted ? <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" /> : idx + 1}
                            </div>
                            <span className={`font-medium hidden md:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                        </div>
                    )
                })}
            </div>

            <Card className="min-h-[400px] flex flex-col">

                {/* STEP 1: SOURCE SELECTION */}
                {step === "SOURCE" && (
                    <CardContent className="py-12 space-y-8 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">¿Cómo deseas agregar los usuarios?</h2>
                            <p className="text-muted-foreground">Selecciona el origen de los datos.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                            <div
                                className="border-2 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 group"
                                onClick={() => { setSourceType("CSV"); setStep("UPLOAD"); }}
                            >
                                <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transaction-colors">
                                    <FileSpreadsheet className="h-8 w-8 text-blue-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Carga Masiva (CSV)</h3>
                                <p className="text-sm text-slate-500">Sube un archivo Excel/CSV con la lista de usuarios.</p>
                            </div>

                            <div
                                className="border-2 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 group"
                                onClick={() => { setSourceType("EXISTING"); setStep("SELECT_EXISTING"); }}
                            >
                                <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transaction-colors">
                                    <Database className="h-8 w-8 text-green-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Usuarios Existentes</h3>
                                <p className="text-sm text-slate-500">Selecciona usuarios ya registrados en la plataforma.</p>
                            </div>
                        </div>
                    </CardContent>
                )}

                {/* STEP 2A: CSV UPLOAD */}
                {step === "UPLOAD" && (
                    <CardContent className="py-10 space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <Button variant="ghost" size="sm" onClick={() => setStep("SOURCE")}><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Button>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">Sube tu archivo de usuarios</h2>
                            <p className="text-muted-foreground">Aceptamos archivos CSV con el formato estándar.</p>
                        </div>

                        <div
                            className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="bg-blue-50 p-4 rounded-full mb-4">
                                <Upload className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-lg font-medium text-slate-900">Haz clic para seleccionar tu archivo CSV</p>
                            <p className="text-sm text-slate-500 mt-2">o arrastra y suelta aquí</p>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button variant="outline" onClick={downloadTemplate}>
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                Descargar Plantilla de Ejemplo
                            </Button>
                        </div>
                    </CardContent>
                )}

                {/* STEP 2B: SELECT EXISTING */}
                {step === "SELECT_EXISTING" && (
                    <CardContent className="py-6 space-y-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" onClick={() => setStep("SOURCE")}><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Button>
                            <h2 className="text-xl font-semibold">Seleccionar Usuarios</h2>
                            <div className="w-[100px]"></div> {/* Spacer */}
                        </div>

                        <div className="flex gap-4">
                            <Input
                                placeholder="Buscar por nombre o correo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                        </div>

                        <div className="border rounded-md flex-1 overflow-visible">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedUserIds.length > 0 && selectedUserIds.length === EXISTING_USERS.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).length}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Empresa Actual</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {EXISTING_USERS.filter(u =>
                                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedUserIds.includes(user.id)}
                                                    onCheckedChange={() => toggleUserSelection(user.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>{user.company}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                            <span className="text-sm font-medium">{selectedUserIds.length} usuarios seleccionados</span>
                            <Button onClick={handleSelectionContinue} disabled={selectedUserIds.length === 0}>
                                Continuar ({selectedUserIds.length}) <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                )}

                {/* STEP 3: VALIDATE */}
                {step === "VALIDATE" && (
                    <CardContent className="py-6 space-y-6 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                            {sourceType === 'CSV' ? <FileSpreadsheet className="h-8 w-8 text-blue-600" /> : <Users className="h-8 w-8 text-green-600" />}
                            <div className="flex-1">
                                <h3 className="font-semibold">{sourceType === 'CSV' ? file?.name : "Selección Manual de Usuarios"}</h3>
                                <p className="text-xs text-muted-foreground">{sourceType === 'CSV' ? `${(file?.size || 0 / 1024).toFixed(2)} KB` : "Desde base de datos"}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={resetFlow} className="text-red-500 hover:bg-red-50">
                                Cancelar
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <div className="text-2xl font-bold text-blue-700">{records.length}</div>
                                <div className="text-xs text-blue-600 font-medium">Registros Listos</div>
                            </div>
                            <div className={`p-4 rounded-lg border ${errors.length > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
                                <div className={`text-2xl font-bold ${errors.length > 0 ? "text-red-700" : "text-green-700"}`}>{errors.length}</div>
                                <div className={`text-xs font-medium ${errors.length > 0 ? "text-red-600" : "text-green-600"}`}>Errores Detectados</div>
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 max-h-[200px] overflow-y-auto">
                                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Detalle de Errores
                                </h4>
                                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                    {errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4 mt-auto">
                            <Button variant="outline" onClick={() => setStep(sourceType === 'CSV' ? "UPLOAD" : "SELECT_EXISTING")}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                            </Button>
                            <Button
                                onClick={() => setStep("CONFIG")}
                                disabled={errors.length > 0}
                            >
                                Configurar Carga <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                )}

                {/* STEP 4: CONFIGURATION */}
                {step === "CONFIG" && (
                    <CardContent className="py-6 space-y-6 flex-1 flex flex-col justify-center">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Configuración de Matrícula</h2>
                            <p className="text-muted-foreground">Define a qué curso y empresa irán estos {records.length} usuarios.</p>
                        </div>

                        <Separator />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <Label>Empresa de Destino</Label>
                                <Select value={globalCompany} onValueChange={setGlobalCompany}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona empresa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">TechCorp Inc.</SelectItem>
                                        <SelectItem value="2">Global Solutions</SelectItem>
                                        <SelectItem value="3">StartupHub</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Rol Asignado</Label>
                                <Select value={globalRole} onValueChange={setGlobalRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT">Estudiante</SelectItem>
                                        <SelectItem value="TEACHER">Profesor</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <Label>Inscribir en Curso (Opcional)</Label>
                                <Select value={globalCourse} onValueChange={setGlobalCourse}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Curso..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Solo registrar usuarios --</SelectItem>
                                        <SelectItem value="101">Liderazgo Efectivo 2024</SelectItem>
                                        <SelectItem value="102">Seguridad Industrial</SelectItem>
                                        <SelectItem value="103">Excel Avanzado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 space-y-3">
                            <Label className="text-yellow-900 font-semibold flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Conflictos
                            </Label>
                            <p className="text-xs text-yellow-800">Si un usuario ya existe en la plataforma:</p>
                            <div className="flex gap-4">
                                <button
                                    className={`flex-1 p-3 rounded border text-sm font-medium transition-all ${duplicateAction === 'SKIP' ? 'bg-white border-yellow-500 text-yellow-700 shadow-sm' : 'border-transparent hover:bg-yellow-100 text-slate-600'}`}
                                    onClick={() => setDuplicateAction("SKIP")}
                                >
                                    Omitir (No hacer nada)
                                </button>
                                <button
                                    className={`flex-1 p-3 rounded border text-sm font-medium transition-all ${duplicateAction === 'UPDATE' ? 'bg-white border-yellow-500 text-yellow-700 shadow-sm' : 'border-transparent hover:bg-yellow-100 text-slate-600'}`}
                                    onClick={() => setDuplicateAction("UPDATE")}
                                >
                                    Actualizar y Matricular
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 mt-auto">
                            <Button variant="ghost" onClick={() => setStep("VALIDATE")}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            <Button onClick={startProcessing} className="bg-green-600 hover:bg-green-700">
                                Iniciar Proceso <Upload className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                )}

                {/* STEP 5: PROCESSING */}
                {step === "PROCESSING" && (
                    <CardContent className="py-12 space-y-8 text-center max-w-md mx-auto flex-1 flex flex-col justify-center">
                        <div className="relative w-20 h-20 mx-auto">
                            <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                                {Math.round((processedCount / records.length) * 100)}%
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Procesando {records.length} Usuarios...</h2>
                            <p className="text-muted-foreground">Por favor no cierres esta ventana.</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                                <span>{processedCount} de {records.length}</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-green-50 p-2 rounded text-green-700 font-medium">
                                ✅ {successCount} Exitosos
                            </div>
                            <div className="bg-red-50 p-2 rounded text-red-700 font-medium">
                                ❌ {failCount} Fallidos
                            </div>
                        </div>
                    </CardContent>
                )}

                {/* STEP 6: RESULTS */}
                {step === "RESULTS" && (
                    <CardContent className="py-10 space-y-8 text-center flex-1 flex flex-col justify-center">
                        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-green-900">¡Proceso Finalizado!</h2>
                            <p className="text-muted-foreground">La operación masiva se ha completado.</p>
                        </div>

                        <div className="flex justify-center gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-slate-900">{records.length}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Total</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600">{successCount}</div>
                                <div className="text-sm text-green-600 uppercase tracking-wider font-semibold">Exitosos</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-red-600">{failCount}</div>
                                <div className="text-sm text-red-600 uppercase tracking-wider font-semibold">Fallidos</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                            <Button variant="outline" onClick={downloadReport}>
                                <Download className="mr-2 h-4 w-4" /> Descargar Reporte
                            </Button>
                            <Button onClick={resetFlow}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Nueva Operación
                            </Button>
                        </div>
                    </CardContent>
                )}

            </Card>
        </div>
    )
}
