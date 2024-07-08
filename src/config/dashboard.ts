import { NavItemWithTitle } from "@/types";

/* Rutas:
    - /dashboard/catalog/categories
    - /dashboard/catalog/products
    - /dashboard/catalog/products/new
    - /dashboard/customers/companies
    - /dashboard/customers/persons
    - /dashboard/home
    - /dashboard/organization/employees
    - /dashboard/organization/suppliers
    - /dashboard/organization/users
    - /dashboard/transactions/sales
    - /dashboard/transactions/sales/new
    - /dashboard/transactions/sales/history
    - /dashboard/warehouse/purchases
    - /dashboard/warehouse/purchases/new
*/
export const permissions = [
  {
    path: "/dashboard/home",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_VENTAS", "EMPLEADO_DE_INVENTARIO"],
  },
  {
    path: "/dashboard/catalog/categories",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/catalog/products",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/catalog/products/new",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/customers/companies",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/customers/persons",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/organization/employees",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/organization/suppliers",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/organization/users",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/transactions/sales",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_VENTAS"],
  },
  {
    path: "/dashboard/transactions/sales/new",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_VENTAS"],
  },
  {
    path: "/dashboard/transactions/sales/history",
    roles: ["ADMIN", "GERENTE"],
  },
  {
    path: "/dashboard/warehouse/purchases",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_INVENTARIO"],
  },
  {
    path: "/dashboard/warehouse/purchases/new",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_INVENTARIO"],
  },
  {
    path: "/dashboard/warehouse/movements",
    roles: ["ADMIN", "GERENTE", "EMPLEADO_DE_INVENTARIO"],
  },
];

export const navItems: NavItemWithTitle[] = [
  {
    items: [
      {
        title: "Home",
        icon: "home",
        href: "/dashboard/home",
      },
    ],
  },
  {
    title: "Almacén",
    items: [
      {
        title: "Ordenes de Compra",
        icon: "shoppingCart",
        href: "/dashboard/warehouse/purchases",
      },
      {
        title: "Historial de Movimientos",
        icon: "history",
        href: "/dashboard/warehouse/movements",
      },
    ],
  },
  {
    title: "Transacciones",
    items: [
      {
        title: "Mis Ventas",
        icon: "sales",
        href: "/dashboard/transactions/sales",
      },
      {
        title: "Nueva Venta",
        icon: "newSale",
        href: "/dashboard/transactions/sales/new",
      },
      {
        title: "Historial de Ventas",
        icon: "salesHistory",
        href: "/dashboard/transactions/sales/history",
      },
    ],
  },
  {
    title: "Catalogo",
    items: [
      {
        title: "Productos",
        icon: "product",
        href: "/dashboard/catalog/products",
      },
      {
        title: "Categorias",
        icon: "category",
        href: "/dashboard/catalog/categories",
      },
    ],
  },
  {
    title: "Clientes",
    items: [
      {
        title: "Personas",
        icon: "customers",
        href: "/dashboard/customers/persons",
      },
      {
        title: "Empresas",
        icon: "company",
        href: "/dashboard/customers/companies",
      },
    ],
  },
  {
    title: "Organización",
    items: [
      {
        title: "Empleados",
        icon: "employees",
        href: "/dashboard/organization/employees",
      },
      {
        title: "Proveedores",
        icon: "suppliers",
        href: "/dashboard/organization/suppliers",
      },
      {
        title: "Usuarios",
        icon: "users",
        href: "/dashboard/organization/users",
      },
    ],
  },
];
