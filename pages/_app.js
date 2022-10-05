const { default: AbortController } = require("abort-controller");
const { default: fetch, Headers, Request, Response } = require("node-fetch");

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  AbortController,
});

import { Provider } from "react-redux"
import "../styles/global.css"
import { PersistGate } from "redux-persist/integration/react"

const { wrapper } = require("../lib/store");

export function App({ Component, ...rest }) {

  const { store, props: wrappedProps } = wrapper.useWrappedStore(rest)

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
        <PersistGate loading={null} persistor={store.__persistor}>
            <Component {...pageProps} />
        </PersistGate>
      </Provider>
  )

}

export default wrapper.withRedux(App);
