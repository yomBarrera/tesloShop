import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from "js-cookie";
import axios from 'axios';

import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '@/axiosApi';

export interface CartState {
  isLoaded: boolean,
  cart: ICartProduct[]
  numbersOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numbersOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,

  shippingAddress: undefined
}

interface Props {
  children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    try {
      let cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - LoadCart from Cookies | storage', payload: cookieProducts })
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from Cookies | storage', payload: [] })
    }

  }, [])

  useEffect(() => {

    if (Cookie.get('firstName')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      }

      dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
    }
  }, [])

  useEffect(() => {
    if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
    // Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {

    const numbersOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
    const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      numbersOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })

  }, [state.cart])


  const addProductToCart = (product: ICartProduct) => {
    //! nivel 1
    // dispatch({ type: '[Cart] - Add Product', payload: product })
    //! nivel 2
    // const productsInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size)
    // dispatch({ type: '[Cart] - Add Product', payload: [...productsInCart, product] })
    //* nivel 3 final
    const productInCart = state.cart.some(p => p._id === product._id);
    if (!productInCart) return dispatch({ type: '[Cart] - Update Products in cart', payload: [...state.cart, product] })

    const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size)
    if (!productInCartButDifferentSize) return dispatch({ type: '[Cart] - Update Products in cart', payload: [...state.cart, product] })
    //acumular
    const updatedProducts = state.cart.map(p => {
      if (p._id !== product._id) return p
      if (p.size !== product.size) return p
      //actualizar la cantidad
      p.quantity += product.quantity
      return p
    })
    dispatch({ type: '[Cart] - Update Products in cart', payload: updatedProducts })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change ProductCart Quantity', payload: product })
  }
  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove Product in cart', payload: product })
  }
  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);

    dispatch({ type: '[Cart] - Update Address', payload: address });
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

    if (!state.shippingAddress) {
      throw new Error('No hay dirección de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map(p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numbersOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }


    try {

      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: '[Cart] - Order complete' });
      Cookie.set('cart', JSON.stringify(state.cart))

      return {
        hasError: false,
        message: data._id!
      }


    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }

  }



  return (
    <CartContext.Provider value={{ ...state, addProductToCart, updateCartQuantity, removeCartProduct, updateAddress, createOrder }}>
      {children}
    </CartContext.Provider>
  )
}