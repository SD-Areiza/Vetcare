import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface Medication {
  id: string;
  name: string;
  barcodeId: string;
  shelfLocation: string;
  expirationDate: string;
  status: "In Stock" | "Low Stock" | "Expired";
  quantity: number;
}

const medications: Medication[] = [
  {
    id: "1",
    name: "Amoxicilina 500mg",
    barcodeId: "MED-8472651",
    shelfLocation: "Estante A2",
    expirationDate: "Dic 2026",
    status: "In Stock",
    quantity: 120,
  },
  {
    id: "2",
    name: "Carprofeno 100mg",
    barcodeId: "MED-3829456",
    shelfLocation: "Estante B1",
    expirationDate: "Mar 2026",
    status: "Low Stock",
    quantity: 8,
  },
  {
    id: "3",
    name: "Prednisona 20mg",
    barcodeId: "MED-5639182",
    shelfLocation: "Estante A3",
    expirationDate: "Ago 2026",
    status: "In Stock",
    quantity: 75,
  },
  {
    id: "4",
    name: "Metronidazol 250mg",
    barcodeId: "MED-9284730",
    shelfLocation: "Estante C2",
    expirationDate: "Ene 2026",
    status: "Expired",
    quantity: 42,
  },
  {
    id: "5",
    name: "Gabapentina 300mg",
    barcodeId: "MED-7419263",
    shelfLocation: "Estante B3",
    expirationDate: "May 2026",
    status: "Low Stock",
    quantity: 12,
  },
  {
    id: "6",
    name: "Meloxicam 1.5mg/ml",
    barcodeId: "MED-1937485",
    shelfLocation: "Estante A1",
    expirationDate: "Nov 2026",
    status: "In Stock",
    quantity: 95,
  },
  {
    id: "7",
    name: "Doxiciclina 100mg",
    barcodeId: "MED-4827361",
    shelfLocation: "Estante C1",
    expirationDate: "Feb 2026",
    status: "Expired",
    quantity: 18,
  },
];

const getStatusBadge = (status: Medication["status"]) => {
  switch (status) {
    case "Expired":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Vencido
        </Badge>
      );
    case "Low Stock":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Stock Bajo
        </Badge>
      );
    case "In Stock":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          En Stock
        </Badge>
      );
  }
};

const getRowClassName = (status: Medication["status"]) => {
  switch (status) {
    case "Expired":
      return "bg-red-50 hover:bg-red-100";
    case "Low Stock":
      return "bg-yellow-50 hover:bg-yellow-100";
    default:
      return "hover:bg-gray-50";
  }
};

export function SmartInventory() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventario Inteligente
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Gestión de stock de medicamentos</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Nombre del Medicamento</TableHead>
                <TableHead className="font-semibold">ID de Código de Barras</TableHead>
                <TableHead className="font-semibold">Ubicación en Estante</TableHead>
                <TableHead className="font-semibold">Fecha de Vencimiento</TableHead>
                <TableHead className="font-semibold">Cantidad</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.id} className={getRowClassName(medication.status)}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell className="text-gray-600 font-mono text-sm">
                    {medication.barcodeId}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                      {medication.shelfLocation}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{medication.expirationDate}</TableCell>
                  <TableCell className="text-gray-700">{medication.quantity}</TableCell>
                  <TableCell>{getStatusBadge(medication.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={
                        medication.status === "Low Stock" || medication.status === "Expired"
                          ? "default"
                          : "outline"
                      }
                      className={
                        medication.status === "Low Stock" || medication.status === "Expired"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Reordenar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Vencido: 2 artículos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Stock Bajo: 2 artículos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">En Stock: 3 artículos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}