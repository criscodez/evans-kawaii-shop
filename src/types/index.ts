import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithTitle {
  title?: string;
  items: NavItem[];
}

export interface BreadCrumb {
  title: string;
  link: string;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  placeholder?: string
  options?: Option[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  utilidad: number;
  costo: number;
  unidadMayor: string;
  unidadMenor: string;
  cantidadMenor: number;
  stockMayor: number;
  stockMenor: number;
  stockTotal: number;
  stockMinimo: number;
  estado: string;
  categoria: Categoria;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cliente {
  id: string;
  tipo: string;
  dni?: string;
  apellidos?: string;
  nombres?: string;
  telefono?: string;
  nombre?: string;
  ruc?: string;
  email?: string;
  direccion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Empleado {
  id: string;
  dni: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: Date;
  sexo: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Proveedor {
  id: string;
  ruc: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  username: string;
  image?: string;
  empleado: Empleado;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrdenCompra {
  id: string;
  fecha: Date;
  empleado: Empleado;
  proveedor: Proveedor;
  total: number;
  IGV: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Venta {
  id: string;
  numVenta: string;
  fecha: Date;
  empleado: Empleado;
  cliente?: Cliente;
  total: number;
  IGV: number;
  comprobante: string;
  createdAt?: Date;
  updatedAt?: Date;
}