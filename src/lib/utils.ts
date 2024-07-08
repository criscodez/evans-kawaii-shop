import { EstadoInventario } from "@prisma/client"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { type ClassValue, clsx } from "clsx"
import { CheckCircle, CircleIcon, CircleX } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductStatusIcon(status: EstadoInventario) {
  const statusIcons = {
    LIMITADO: InfoCircledIcon,
    EN_STOCK: CheckCircle,
    AGOTADO: CircleX
  }

  return statusIcons[status] || CircleIcon
}