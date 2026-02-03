import { SmartAgenda } from "@/app/components/smart-agenda";
import { PatientQuickAccess } from "@/app/components/patient-quick-access";
import { SmartInventory } from "@/app/components/smart-inventory";
import { Activity } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestión VetCare</h1>
          </div>
          <p className="text-gray-600">
            Programación optimizada, registros de pacientes y gestión de inventario
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Widget 1: Smart Agenda - Full height on left */}
          <div className="xl:row-span-2">
            <SmartAgenda />
          </div>

          {/* Widget 2: Patient Quick Access - Top right */}
          <div>
            <PatientQuickAccess />
          </div>

          {/* Widget 3: Smart Inventory - Bottom right, spans full width on mobile */}
          <div className="xl:col-span-1">
            <SmartInventory />
          </div>
        </div>
      </div>
    </div>
  );
}