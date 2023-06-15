import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import useSWR, { SWRConfig } from 'swr'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react"

import { CssBaseline, ThemeProvider } from '@mui/material'

import { lightTheme } from '@/themes'
import { AuthProvider, CartProvider, UiProvider } from '@/context'

const initialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  // currency: "USD",
  // intent: "capture",
  // "data-client-token": "abc123xyz==",
};

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PayPalScriptProvider options={initialOptions}>
        <SWRConfig value={{
          // refreshInterval: 3000,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
