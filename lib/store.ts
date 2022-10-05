import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { createWrapper } from "next-redux-wrapper";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer, persistStore } from "redux-persist"
import { counterSlice } from "./counter_slice"
import { pokemonApi } from "./pokemonApi";
import { storage } from "./storage"

const isServer = typeof window === "undefined"

const rootReducer = combineReducers({
    counter: counterSlice.reducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer
})

const disableSerializeCheck = {
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
}



export const makeStore = () => {
    if (isServer) {
        // If it's on server side, create a store
        return configureStore({
            reducer: rootReducer,
            middleware: (gDM) => {
                const middlewares = gDM().concat(pokemonApi.middleware)

                if (process.env.NODE_ENV === "development") {
                    // middlewares.push(logger)
                }

                return middlewares
            },
        })
    }

    const persistConfig = {
        key: "root",
        version: 1,
        storage,
        whitelist: ["counter"],
    }

    const persistedReducer = persistReducer(persistConfig, rootReducer)

    const store = configureStore({
        reducer: persistedReducer,
        middleware: (gDM) => {
            const middlewares = gDM(disableSerializeCheck).concat(pokemonApi.middleware)
            if (process.env.NODE_ENV === "development") {
                // middlewares.push(logger)
            }

            return middlewares
        },
    })

    setupListeners(store.dispatch)

    return { ...store, __persistor: persistStore(store) }
}
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
