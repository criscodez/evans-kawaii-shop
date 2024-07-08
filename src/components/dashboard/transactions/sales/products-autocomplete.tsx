import {
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
  } from "@/components/ui/command";
  import { Command as CommandPrimitive } from "cmdk";
  import { useState, useRef, useCallback, type KeyboardEvent } from "react";
  
  import { Skeleton } from "@/components/ui/skeleton";
  
  import { Check, Package } from "lucide-react";
  import { cn } from "@/lib/utils";
  import { Producto } from "@/types";
  import { Items } from "./create-sale-form";
  
  type AutoCompleteProps = {
    productosSeleccionados: Items[];
    setProductosSeleccionados: (productos: Items[]) => void;
    productos: Producto[];
    emptyMessage: string;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
  };
  
  export const AutoCompleteProductos = ({
    productosSeleccionados,
    setProductosSeleccionados,
    productos,
    placeholder,
    emptyMessage,
    disabled,
    isLoading = false,
  }: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
  
    const [isOpen, setOpen] = useState(false);
  
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (!input) {
          return;
        }
  
        // Keep the options displayed when the user is typing
        if (!isOpen) {
          setOpen(true);
        }
  
        // This is not a default behaviour of the <input /> field
        if (event.key === "Enter" && input.value !== "") {
          const procutoToAdd = productos.find(
            (producto) => producto.id === input.value
          );
  
          if (procutoToAdd) {
            setProductosSeleccionados([
              ...productosSeleccionados,
              {
                nombre: procutoToAdd.nombre,
                productoId: procutoToAdd.id,
                cantidad: 1,
                precio: procutoToAdd.precio,
                stockTotal: procutoToAdd.stockTotal,
                subtotal: procutoToAdd.precio,
              },
            ]);
          }
        }
  
        if (event.key === "Escape") {
          input.blur();
        }
      },
      [isOpen, productos]
    );
  
    const handleSelectOption = (producto: Producto) => {
      if (
        productosSeleccionados.some((item) => item.productoId === producto.id)
      ) {
        return;
      }
  
      setProductosSeleccionados([
        ...productosSeleccionados,
        {
          nombre: producto.nombre,
          productoId: producto.id,
          stockTotal: producto.stockTotal,
          cantidad: 1,
          subtotal: producto.precio,
          precio: producto.precio,
        },
      ]);
    };
  
    return (
      <CommandPrimitive className="w-full" onKeyDown={handleKeyDown}>
        <div>
          <CommandInput
            ref={inputRef}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <div className="relative mt-1">
          <div
            className={cn(
              "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none",
              isOpen ? "block" : "hidden"
            )}
          >
            <CommandList className="rounded-lg ring-1 ring-slate-200">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {productos.length > 0 && !isLoading ? (
                <CommandGroup>
                  {productos.map((producto) => {
                    const isAdded = productosSeleccionados.some(
                      (item) => item.productoId === producto.id
                    );
                    if (isAdded) {
                      return null;
                    }
                    return (
                      <CommandItem
                        key={producto.id}
                        value={producto.id}
                        disabled={producto.stockTotal === 0}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(producto)}
                        className="flex justify-between px-4 py-2 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Package className="w-5 mr-2" /> {producto.nombre}
                        </div>
                        <div>Precio: S/. {producto.precio}</div>
                        <div>Stock: {producto.stockTotal}</div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        </div>
      </CommandPrimitive>
    );
  };
  