import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const reducers = rootReducer();

export default function configureAppStore() {
  const store = configureStore({
    reducer: reducers,
    middleware: [sagaMiddleware],
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer()));
  }
  sagaMiddleware.run(rootSaga);
  return store;
}
