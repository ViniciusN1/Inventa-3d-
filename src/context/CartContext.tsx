"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (
    product: Omit<CartItem, "quantity">
  ) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;

  totalItems: number;

  isOpen: boolean;

  setIsOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const CartContext = createContext<CartContextType>(
  {} as CartContextType
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  function getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  }

  async function loadCart() {
    const token = getToken();

    if (!token) {
      const stored =
        localStorage.getItem("cart");

      if (stored) {
        setCart(JSON.parse(stored));
      }

      setLoaded(true);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (
        data.success &&
        Array.isArray(data.cart)
      ) {
        setCart(data.cart);
      } else {
        const stored =
          localStorage.getItem("cart");

        if (stored) {
          setCart(JSON.parse(stored));
        }
      }
    } catch (error) {
      const stored =
        localStorage.getItem("cart");

      if (stored) {
        setCart(JSON.parse(stored));
      }
    } finally {
      setLoaded(true);
    }
  }

  async function saveCart(
    currentCart: CartItem[]
  ) {
    const token = getToken();

    localStorage.setItem(
      "cart",
      JSON.stringify(currentCart)
    );

    if (!token) return;

    try {
      await fetch("/api/cart", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          cart: currentCart,
        }),
      });
    } catch (error) {
      console.log(
        "Erro ao salvar carrinho:",
        error
      );
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    saveCart(cart);
  }, [cart, loaded]);

  function addToCart(
    product: Omit<CartItem, "quantity">
  ) {
    setCart((prev) => {
      const exists = prev.find(
        (item) => item._id === product._id
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setIsOpen(true);
  }

  function removeFromCart(id: string) {
    setCart((prev) =>
      prev.filter(
        (item) => item._id !== id
      )
    );
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  const totalItems = cart.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  );
  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}