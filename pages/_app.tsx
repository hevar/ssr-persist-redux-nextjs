const { default: AbortController } = require("abort-controller");
const { default: fetch, Headers, Request, Response } = require("node-fetch");

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  AbortController,
});

import { AppProps } from "next/app"
import { Provider } from "react-redux"
import "../styles/global.css"
import { Persistor } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { AppStore } from "../lib/store"

const { wrapper } = require("../lib/store");

export function App({ Component, ...rest }: AppProps) {

  const { store, props: wrappedProps } = wrapper.useWrappedStore(rest)
  const inferredStore = store as AppStore & { __persistor: Persistor }

  const { pageProps } = wrappedProps

  const isServer = typeof window === "undefined"

  if (isServer) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
  }

  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={inferredStore.__persistor}>
            <Component {...pageProps} />
        </PersistGate>
      </Provider>
  )

}

export default App;
