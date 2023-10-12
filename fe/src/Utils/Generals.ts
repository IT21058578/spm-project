import { useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import RoutePaths from "../config";
import { ProductType } from "../components/ProductCart";
import { UserType } from "../types";

export const toggleLinkClass = (
  path: string,
  activeClass: string = active,
  inactiveClass: string = inactive
) => {
  const currentLink = useLocation().pathname;

  return currentLink === path ? activeClass : inactiveClass;
};

export const getItem = (keymane: string) => {
  return localStorage.getItem(keymane);
};

export const setItem = (keyname: string, value: string | Object) => {
  if (typeof value !== "string" && !(value instanceof String)) {
    value = JSON.stringify(value);
  }
  return localStorage.setItem(keyname, value as string);
};

export const removeItem = (keyname: string) => {
  return localStorage.removeItem(keyname);
};

export const getTotal = () => {
  const state = useAppSelector((state) => state.productCart);

  const total = state.reduce((a, b) => a + b.price * (b.quantity || 1), 0);

  return total;
};

// export const link = (url : string) : string => BASE_STORAGE_URL + url;

export const checkLogin = () => {
  const isLogged = localStorage.getItem(RoutePaths.token);
  return !!isLogged;
};

type CheckOut = { [productId: string]: number };

export const buildCheckoutData = () => {
  const products = useAppSelector((state) => state.productCart);
  const isLogged = getItem(RoutePaths.token);
  const user = !isLogged ? null : JSON.parse(getItem("user") || "");

  const checkoutData: CheckOut = {};

  products.forEach((product) => {
    const productId = product._id;
    const quantity = product.quantity || 1;
    
    if (checkoutData[productId]) {
      checkoutData[productId] += quantity;
    } else {
      checkoutData[productId] = quantity;
    }
  });
  
  return { items: checkoutData };
};


export const BASE_URL = "http://localhost:3000"; // BASE URL FOR API FETCHING

const active = "d-block p-3 fd-nav-active"; // WHERE MENU IS ACTIVE CLASS

const inactive = "d-block p-3 text-black"; // WHERE MENU IS NOT ACTIVE CLASS

export const cartKeyName = "fd_shoppingcart"; // CART KEY NAME FOR LOCAL STORAGE

export const wishlistKeyName = "fd_wishlist"; // WISHLIST KEY NAME FOR LOCAL STORAGE
