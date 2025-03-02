"use client";

import { Product } from "@prisma/client";
import { createContext, useState } from "react";
import { ReactNode } from "react";

export interface CartProduct extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;

}

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProduct: (productId: string) => void;
}


export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => { },
  addProduct: () => { },
  decreaseProductQuantity: () => { },
  increaseProductQuantity: () => { },
  removeProduct: () => { },
});


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

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.id !== productId) {
          return prevProduct;
        }
        if (prevProduct.quantity === 1) {
          return prevProduct;
        }
        return {
          ...prevProduct, quantity: prevProduct.quantity - 1
        };
      })
    })
  };

  const increaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((prevProduct) =>
        prevProduct.id === productId
          ? { ...prevProduct, quantity: prevProduct.quantity + 1 }
          : prevProduct
      )
    );
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((prevProduct) => prevProduct.id !== productId)
    );
  };


  return (
    <CartContext.Provider
      value={{
        isOpen: isOpen,
        products: products,
        toggleCart: toggleCart,
        addProduct: addProduct,
        decreaseProductQuantity: decreaseProductQuantity,
        increaseProductQuantity: increaseProductQuantity,
        removeProduct: removeProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};