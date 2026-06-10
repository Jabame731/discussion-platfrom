import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { repositories } from "../repositories";
import type { IProtocolRepository, IAuthRepository } from "../models";
import protocolReducer from "./reducers/protocol.reducer";
import authReducer from "./reducers/auth.reducer";
import commentReducer from "./reducers/comment.reducer";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

const rootReducer = combineReducers({
  protocols: protocolReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  comments: commentReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: repositories },
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Typed ThunkApi — single source of truth, import this in all effect files
export interface ThunkApi {
  dispatch: AppDispatch;
  extra: {
    protocolRepository: IProtocolRepository;
    authRepository: IAuthRepository;
  };
}

// Typed hooks — use these everywhere instead of plain useDispatch/useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
