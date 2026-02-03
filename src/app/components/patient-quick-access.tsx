import { Search, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

interface Patient {
  id: string;
  petName: string;
  breed: string;
  age: string;
  weight: string;
  allergies: string[];
  lastLabResult: string;
  labDate: string;
}

const samplePatients: Patient[] = [
  {
    id: "1",
    petName: "Max",
    breed: "Golden Retriever",
    age: "5 años",
    weight: "32 kg",
    allergies: ["Penicilina", "Pollo"],
    lastLabResult: "Hemograma normal, Enzimas hepáticas ligeramente elevadas",
    labDate: "15 Ene 2026",
  },
  {
    id: "2",
    petName: "Bella",
    breed: "Gato Persa",
    age: "3 años",
    weight: "4.5 kg",
    allergies: ["Lácteos"],
    lastLabResult: "Función renal normal, Análisis de orina normal",
    labDate: "28 Ene 2026",
  },
  {
    id: "3",
    petName: "Charlie",
    breed: "Beagle",
    age: "7 años",
    weight: "12 kg",
    allergies: [],
    lastLabResult: "Chequeo anual - Todos los valores dentro del rango normal",
    labDate: "20 Dic 2025",
  },
];

export function PatientQuickAccess() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(samplePatients[0]);

  const filteredPatients = samplePatients.filter((patient) =>
    patient.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Acceso Rápido a Pacientes</CardTitle>
        <p className="text-sm text-gray-600">Eliminando registros en papel</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre de mascota o raza..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery && filteredPatients.length > 0 && (
          <div className="border rounded-lg divide-y max-h-32 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setSelectedPatient(patient);
                  setSearchQuery("");
                }}
              >
                <p className="font-medium">{patient.petName}</p>
                <p className="text-sm text-gray-600">{patient.breed}</p>
              </button>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div className="border rounded-lg p-4 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold">{selectedPatient.petName}</h3>
                <p className="text-sm text-gray-600">{selectedPatient.breed}</p>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Historial Completo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Edad</p>
                <p className="font-medium">{selectedPatient.age}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Peso</p>
                <p className="font-medium">{selectedPatient.weight}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-xs text-gray-500 uppercase font-medium">Alergias</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.allergies.length > 0 ? (
                  selectedPatient.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">Sin alergias conocidas</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-gray-500 uppercase mb-1">Último Resultado de Laboratorio</p>
              <p className="text-sm mb-1">{selectedPatient.lastLabResult}</p>
              <p className="text-xs text-gray-500">{selectedPatient.labDate}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}