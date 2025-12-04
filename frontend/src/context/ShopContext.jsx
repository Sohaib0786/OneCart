import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { authDataContext } from "./authContext";
import { userDataContext } from "./UserContext";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const currency = "₹";
  const delivery_fee = 40;

  // ----------------------------
  // Fetch All Products
  // ----------------------------
  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product/list`);
      setProducts(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  // ----------------------------
  // Add Item to Cart
  // ----------------------------
  const addtoCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a product size");
      return;
    }

    let cartData = structuredClone(cartItem);

    // Update frontend cart instantly
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setCartItem(cartData);

    // Sync with backend
    if (userData) {
      try {
        setLoading(true);
        await axios.post(
          `${serverUrl}/api/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );
        toast.success("Product added to cart");
      } catch (error) {
        console.log(error);
        toast.error("Unable to add to cart");
      } finally {
        setLoading(false);
      }
    }
  };

  // ----------------------------
  // Fetch User Cart
  // ----------------------------
  const getUserCart = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/cart/get`,
        {},
        { withCredentials: true }
      );
      setCartItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------------
  // Update Quantity
  // ----------------------------
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await axios.post(
          `${serverUrl}/api/cart/update`,
          { itemId, size, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ----------------------------
  // Total Cart Count
  // ----------------------------
  const getCartCount = () => {
    let total = 0;
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const qty = cartItem[productId][size];
        if (qty > 0) total += qty;
      }
    }
    return total;
  };

  // ----------------------------
  // Total Cart Amount
  // ----------------------------
  const getCartAmount = () => {
    let amount = 0;

    for (const id in cartItem) {
      const itemInfo = products.find((p) => p._id === id);
      if (!itemInfo) continue;

      for (const size in cartItem[id]) {
        const qty = cartItem[id][size];
        if (qty > 0) {
          amount += itemInfo.price * qty;
        }
      }
    }

    return amount;
  };

  // ----------------------------
  // Effects
  // ----------------------------
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getUserCart();
  }, [userData]); // Fetch when user logs in

  // ----------------------------
  // Context Value
  // ----------------------------
  const value = {
    products,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtoCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
    loading,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
