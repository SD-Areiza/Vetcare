import { AlertTriangle, Clock, Plus, Calendar, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useState } from "react";

type ServiceType = 
  | "Consulta General"
  | "Medicina Preventiva"
  | "Cirugía"
  | "Diagnóstico"
  | "Odontología"
  | "Hospitalización"
  | "Urgencia 24/7"
  | "Peluquería"
  | "Mascotas Exóticas"
  | "Chequeo"
  | "Estudios de Imagen"
  | "Dermatología"
  | "Cuidados Geriátricos";

interface Appointment {
  id: string;
  time: string;
  duration: number;
  petName: string;
  ownerName: string;
  type: "New Patient" | "Follow-up";
  service: ServiceType;
  conflict?: boolean;
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    time: "09:00",
    duration: 30,
    petName: "Max",
    ownerName: "Juan Pérez",
    type: "Follow-up",
    service: "Consulta General",
  },
  {
    id: "2",
    time: "10:00",
    duration: 20,
    petName: "Bella",
    ownerName: "María González",
    type: "Follow-up",
    service: "Medicina Preventiva",
  },
  {
    id: "3",
    time: "11:00",
    duration: 90,
    petName: "Charlie",
    ownerName: "Carlos Rodríguez",
    type: "New Patient",
    service: "Cirugía",
  },
  {
    id: "4",
    time: "14:00",
    duration: 45,
    petName: "Luna",
    ownerName: "Ana Martínez",
    type: "New Patient",
    service: "Diagnóstico",
  },
  {
    id: "5",
    time: "14:30",
    duration: 30,
    petName: "Rocky",
    ownerName: "Pedro Sánchez",
    type: "Follow-up",
    service: "Odontología",
    conflict: true,
  },
  {
    id: "6",
    time: "16:00",
    duration: 40,
    petName: "Daisy",
    ownerName: "Laura López",
    type: "Follow-up",
    service: "Estudios de Imagen",
  },
  {
    id: "7",
    time: "17:00",
    duration: 25,
    petName: "Milo",
    ownerName: "Roberto Torres",
    type: "Follow-up",
    service: "Peluquería",
  },
  {
    id: "8",
    time: "18:00",
    duration: 50,
    petName: "Kiwi",
    ownerName: "Sofia Vargas",
    type: "New Patient",
    service: "Mascotas Exóticas",
  },
];

// Service durations based on type
const getServiceDuration = (service: ServiceType, patientType: "New Patient" | "Follow-up"): number => {
  const durations: Record<ServiceType, { new: number; followup: number }> = {
    "Consulta General": { new: 60, followup: 30 },
    "Medicina Preventiva": { new: 30, followup: 20 },
    "Cirugía": { new: 120, followup: 90 },
    "Diagnóstico": { new: 60, followup: 45 },
    "Odontología": { new: 45, followup: 30 },
    "Hospitalización": { new: 90, followup: 60 },
    "Urgencia 24/7": { new: 60, followup: 30 },
    "Peluquería": { new: 30, followup: 25 },
    "Mascotas Exóticas": { new: 60, followup: 40 },
    "Chequeo": { new: 45, followup: 30 },
    "Estudios de Imagen": { new: 50, followup: 40 },
    "Dermatología": { new: 45, followup: 30 },
    "Cuidados Geriátricos": { new: 60, followup: 40 },
  };
  
  return patientType === "New Patient" ? durations[service].new : durations[service].followup;
};

// Service colors for badges
const getServiceColor = (service: ServiceType) => {
  const colors: Record<ServiceType, string> = {
    "Consulta General": "bg-blue-100 text-blue-700 hover:bg-blue-100",
    "Medicina Preventiva": "bg-teal-100 text-teal-700 hover:bg-teal-100",
    "Cirugía": "bg-rose-100 text-rose-700 hover:bg-rose-100",
    "Diagnóstico": "bg-amber-100 text-amber-700 hover:bg-amber-100",
    "Odontología": "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
    "Hospitalización": "bg-red-100 text-red-700 hover:bg-red-100",
    "Urgencia 24/7": "bg-red-200 text-red-800 hover:bg-red-200",
    "Peluquería": "bg-pink-100 text-pink-700 hover:bg-pink-100",
    "Mascotas Exóticas": "bg-purple-100 text-purple-700 hover:bg-purple-100",
    "Chequeo": "bg-green-100 text-green-700 hover:bg-green-100",
    "Estudios de Imagen": "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
    "Dermatología": "bg-orange-100 text-orange-700 hover:bg-orange-100",
    "Cuidados Geriátricos": "bg-slate-100 text-slate-700 hover:bg-slate-100",
  };
  return colors[service];
};

// Calculate gaps between appointments
const hasGapBefore = (currentTime: string, prevAppointment?: Appointment) => {
  if (!prevAppointment) return false;
  
  const [prevHour, prevMin] = prevAppointment.time.split(":").map(Number);
  const [currHour, currMin] = currentTime.split(":").map(Number);
  
  const prevEnd = prevHour * 60 + prevMin + prevAppointment.duration;
  const currStart = currHour * 60 + currMin;
  
  return currStart - prevEnd >= 60; // Gap of 60 minutes or more
};

// Check for conflicts
const checkConflict = (newAppointment: Appointment, existingAppointments: Appointment[]): boolean => {
  const [newHour, newMin] = newAppointment.time.split(":").map(Number);
  const newStart = newHour * 60 + newMin;
  const newEnd = newStart + newAppointment.duration;

  return existingAppointments.some((apt) => {
    if (apt.id === newAppointment.id) return false; // Skip self
    const [hour, min] = apt.time.split(":").map(Number);
    const start = hour * 60 + min;
    const end = start + apt.duration;

    // Check if time ranges overlap
    return (newStart < end && newEnd > start);
  });
};

export function SmartAgenda() {
  const [activeTab, setActiveTab] = useState<"agenda" | "procedure">("agenda");
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    petName: "",
    ownerName: "",
    time: "",
    patientType: "Follow-up" as "New Patient" | "Follow-up",
    service: "Consulta General" as ServiceType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = getServiceDuration(formData.service, formData.patientType);
    
    const newAppointment: Appointment = {
      id: String(Date.now()),
      time: formData.time,
      duration,
      petName: formData.petName,
      ownerName: formData.ownerName,
      type: formData.patientType,
      service: formData.service,
    };

    // Check for conflicts
    const hasConflict = checkConflict(newAppointment, appointments);
    newAppointment.conflict = hasConflict;

    // Add appointment and sort by time
    const updatedAppointments = [...appointments, newAppointment].sort((a, b) => {
      const [aHour, aMin] = a.time.split(":").map(Number);
      const [bHour, bMin] = b.time.split(":").map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    });

    setAppointments(updatedAppointments);
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      petName: "",
      ownerName: "",
      time: "",
      patientType: "Follow-up",
      service: "Consulta General",
    });
  };

  const calculatedDuration = getServiceDuration(formData.service, formData.patientType);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Agenda Inteligente</CardTitle>
          
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar Cita
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4 border-b">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "agenda"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Vista de Agenda
          </button>
          <button
            onClick={() => setActiveTab("procedure")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "procedure"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Procedimiento
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === "agenda" ? (
          <>
            <div className="space-y-1">
              {appointments.map((appointment, index) => {
                const hasGap = hasGapBefore(appointment.time, appointments[index - 1]);
                
                return (
                  <div key={appointment.id}>
                    {hasGap && (
                      <div className="flex items-center gap-2 py-2 px-3 my-1 bg-blue-50 border border-blue-200 rounded-md">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Espacio Detectado - Horario Disponible</span>
                      </div>
                    )}
                    
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        appointment.conflict
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center w-16 shrink-0">
                        <span className="text-sm font-semibold">{appointment.time}</span>
                        <span className="text-xs text-gray-500">{appointment.duration}m</span>
                      </div>
                      
                      <div className="h-12 w-px bg-gray-200" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium truncate">{appointment.petName}</p>
                          <Badge
                            variant={appointment.type === "New Patient" ? "default" : "secondary"}
                            className={
                              appointment.type === "New Patient"
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                : "bg-green-100 text-green-700 hover:bg-green-100"
                            }
                          >
                            {appointment.type === "New Patient" ? "Paciente Nuevo" : "Seguimiento"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getServiceColor(appointment.service)}
                          >
                            {appointment.service}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{appointment.ownerName}</p>
                      </div>
                      
                      {appointment.conflict && (
                        <div className="flex items-center gap-1 text-red-600 shrink-0">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="text-sm font-medium">Conflicto</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600">Paciente Nuevo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Seguimiento</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-2">Servicios disponibles:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                    <span>• Consultas Generales</span>
                    <span>• Medicina Preventiva</span>
                    <span>• Cirugías</span>
                    <span>• Diagnósticos</span>
                    <span>• Odontología</span>
                    <span>• Hospitalización</span>
                    <span>• Urgencias 24/7</span>
                    <span>• Peluquería</span>
                    <span>• Mascotas Exóticas</span>
                    <span>• Chequeos</span>
                    <span>• Estudios de Imagen</span>
                    <span>• Dermatología</span>
                    <span>• Cuidados Geriátricos</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Procedimiento para Agendar Citas</h3>
              <p className="text-sm text-blue-700">
                Sigue estos pasos para programar una cita de manera eficiente y evitar conflictos.
              </p>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Verificar Información del Cliente</h4>
                  <p className="text-sm text-gray-600">
                    Confirmar nombre del dueño, nombre de la mascota, número de contacto y correo electrónico.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Determinar Tipo de Servicio</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Identificar el servicio requerido para asignar la duración correcta:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Paciente Nuevo:</strong> 60-90 minutos (incluye historial completo)</li>
                    <li>• <strong>Seguimiento:</strong> 20-30 minutos (revisiones y chequeos)</li>
                    <li>• <strong>Cirugías:</strong> 90-120 minutos</li>
                    <li>• <strong>Diagnósticos:</strong> 45-60 minutos</li>
                    <li>• <strong>Servicios Rápidos:</strong> 15-25 minutos (peluquería, vacunas)</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Revisar Espacios Disponibles</h4>
                  <p className="text-sm text-gray-600">
                    Consultar la agenda diaria para identificar espacios libres. El sistema detecta automáticamente 
                    huecos de 60 minutos o más y los marca como "Espacio Detectado".
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Verificar Conflictos</h4>
                  <p className="text-sm text-gray-600">
                    El sistema alerta automáticamente sobre citas superpuestas o conflictos de horario con un 
                    indicador rojo. Resolver antes de confirmar.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Registrar la Cita</h4>
                  <p className="text-sm text-gray-600">
                    Ingresar todos los datos en el sistema: hora, duración, tipo de paciente, servicio, y 
                    cualquier nota especial (alergias, requerimientos especiales).
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Confirmar con el Cliente</h4>
                  <p className="text-sm text-gray-600">
                    Repetir la fecha, hora y servicio al cliente. Enviar confirmación por SMS o correo 
                    electrónico con recordatorios 24 horas antes.
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  7
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Preparar Materiales</h4>
                  <p className="text-sm text-gray-600">
                    Para cirugías y procedimientos especiales, asegurar que el equipo y materiales estén 
                    listos con anticipación. Coordinar con el equipo médico.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Notas Importantes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Las urgencias tienen prioridad y pueden requerir usar "Agendar Cita"</li>
                <li>• Dejar al menos 15 minutos entre citas para limpieza y preparación</li>
                <li>• Cirugías deben programarse en horarios matutinos cuando sea posible</li>
                <li>• Mascotas exóticas requieren veterinario especializado - verificar disponibilidad</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Dialog for scheduling appointments */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendar Nueva Cita</DialogTitle>
            <DialogDescription>
              Complete los datos del paciente y seleccione el tipo de servicio requerido.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nombre del Dueño</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Ej: María García"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petName">Nombre de la Mascota</Label>
              <Input
                id="petName"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                placeholder="Ej: Max"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora de la Cita</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientType">Tipo de Paciente</Label>
              <Select
                value={formData.patientType}
                onValueChange={(value) => setFormData({ ...formData, patientType: value as "New Patient" | "Follow-up" })}
              >
                <SelectTrigger id="patientType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Follow-up">Seguimiento</SelectItem>
                  <SelectItem value="New Patient">Paciente Nuevo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Tipo de Servicio</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => setFormData({ ...formData, service: value as ServiceType })}
              >
                <SelectTrigger id="service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta General">Consulta General</SelectItem>
                  <SelectItem value="Medicina Preventiva">Medicina Preventiva (Vacunas, Desparasitación)</SelectItem>
                  <SelectItem value="Cirugía">Cirugía</SelectItem>
                  <SelectItem value="Diagnóstico">Diagnóstico (Laboratorio, Rayos X, Ecografías)</SelectItem>
                  <SelectItem value="Odontología">Odontología</SelectItem>
                  <SelectItem value="Hospitalización">Hospitalización</SelectItem>
                  <SelectItem value="Urgencia 24/7">Urgencia 24/7</SelectItem>
                  <SelectItem value="Peluquería">Peluquería</SelectItem>
                  <SelectItem value="Mascotas Exóticas">Atención a Mascotas Exóticas</SelectItem>
                  <SelectItem value="Chequeo">Chequeo General</SelectItem>
                  <SelectItem value="Estudios de Imagen">Estudios de Imagen</SelectItem>
                  <SelectItem value="Dermatología">Dermatología</SelectItem>
                  <SelectItem value="Cuidados Geriátricos">Cuidados Geriátricos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Duración estimada:</span>
                <span className="text-blue-900 font-semibold">{calculatedDuration} minutos</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agendar Cita</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}