import { SlidersHorizontal, SquareIcon } from "lucide-react";

export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  comparisonOperators: [
    { label: "Contiene", value: "ilike" as const },
    { label: "No contiene", value: "notIlike" as const },
    { label: "Es", value: "eq" as const },
    { label: "No es", value: "notEq" as const },
    { label: "Empieza con", value: "startsWith" as const },
    { label: "Termina con", value: "endsWith" as const },
    { label: "Está vacío", value: "isNull" as const },
    { label: "No está vacío", value: "isNotNull" as const },
  ],
  selectableOperators: [
    { label: "Es", value: "eq" as const },
    { label: "No es", value: "notEq" as const },
    { label: "Está vacío", value: "isNull" as const },
    { label: "No está vacío", value: "isNotNull" as const },
  ],
  logicalOperators: [
    {
      label: "Y",
      value: "and" as const,
      description: "Todas las condiciones deben cumplirse",
    },
    {
      label: "O",
      value: "or" as const,
      description: "Al menos una condición debe cumplirse",
    },
  ],
  featureFlags: [
    {
      label: "Filtro avanzado",
      value: "advancedFilter" as const,
      icon: SlidersHorizontal,
      tooltipTitle: "Alternar filtro avanzado",
      tooltipDescription:
        "Un concepto similar a un generador de consultas para filtrar filas.",
    },
    {
      label: "Barra flotante",
      value: "floatingBar" as const,
      icon: SquareIcon,
      tooltipTitle: "Alternar barra flotante",
      tooltipDescription:
        "Una barra flotante que se adhiere a la parte superior de la tabla.",
    },
  ],
};
