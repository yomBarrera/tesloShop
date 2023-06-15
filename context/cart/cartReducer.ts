import { CartState } from './';
import { ICartProduct, ShippingAddress } from '@/interfaces';


type CartActionType =
// | { type: '[Cart] - Add Product', payload:ICartProduct[] }
  | { type: '[Cart] - LoadCart from Cookies | storage', payload:ICartProduct[] }
  | { type: '[Cart] - Update Products in cart', payload:ICartProduct[] }
  | { type: '[Cart] - Change ProductCart Quantity', payload:ICartProduct }
  | { type: '[Cart] - Remove Product in cart', payload:ICartProduct }
  | { type: '[Cart] - LoadAddress from Cookies', payload: ShippingAddress }
  | { type: '[Cart] - Update Address', payload: ShippingAddress }
  | { type: '[Cart] - Update order summary', payload:{
                                                      numbersOfItems: number;
                                                      subTotal: number;
                                                      tax: number;
                                                      total: number;
                                                  }}
  | { type: '[Cart] - Order complete' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

  switch (action.type) {
    case '[Cart] - LoadCart from Cookies | storage':
      return { ...state, isLoaded: true, cart: [...action.payload] }

    // case '[Cart] - Add Product':
    //   return { ...state, cart: action.payload }

    case '[Cart] - Update Products in cart':
      return { ...state, cart: action.payload }//es iguala a [...action.payload] por que el provider ya lo destructura

    case '[Cart] - Change ProductCart Quantity':
      return { ...state, 
        cart: state.cart.map(p => {
          if (p._id !== action.payload._id) return p
          if (p.size !== action.payload.size) return p
          return action.payload
        })
      }

    case '[Cart] - Remove Product in cart':
      return { ...state, 
        cart: state.cart.filter(p => !(p._id === action.payload._id && p.size === action.payload.size))
      }

    case '[Cart] - Update order summary':
      return { ...state, ...action.payload }

    case '[Cart] - Update Address':
    case '[Cart] - LoadAddress from Cookies':
        return {
          ...state,
          shippingAddress: action.payload
        }
    case '[Cart] - Order complete':
         return {
            ...state,
            cart: [],
            numbersOfItems: 0,
            subTotal: 0,
            tax: 0,
            total: 0
         }
    default:
      return state;
  }
}