"use client";

import { Product } from "@prisma/client";
import { createContext, useState } from "react";
import { ReactNode } from "react";

interface CartProduct extends Pick<Product, "id" | "name" | "price"> {
    quantity: number;
  
}

export interface ICartContext{
    isOpen: boolean;
    products: CartProduct[];    
    toggleCart: () => void;
    addProduct: (product: CartProduct) => void;
}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    toggleCart: () => {},
    addProduct: () => {}
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState<CartProduct[]>([]);
    const toggleCart = () => setIsOpen((prev) => !prev);

    const addProduct = (product: CartProduct) => {
        // Verifica se o produto já está no carrinho
        // se estiver, aumenta a sua quantidade
        // se não estiver, adiciona o produto ao carrinho
        const productIsAlreadyOnTheCart = products.some(
            (prevProduct) => prevProduct.id === product.id,
          );
          if (!productIsAlreadyOnTheCart) {
            return setProducts((prev) => [...prev, product]);
          }
          setProducts((prevProducts) => {
            return prevProducts.map((prevProduct) => {
              if (prevProduct.id === product.id) {
                return {
                  ...prevProduct,
                  quantity: prevProduct.quantity + product.quantity,
                };
              }
              return prevProduct;
            });
          });
        };
    return (
        <CartContext.Provider
            value={{
                isOpen: isOpen,
                products: products,
                toggleCart: toggleCart,
                addProduct: addProduct
            }}
        >
            {children}
        </CartContext.Provider>
    );
};