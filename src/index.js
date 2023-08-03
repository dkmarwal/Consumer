import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { Suspense } from "react";
import "~/lib/interceptor";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Wrapper } from '~/Wrapper';
import store from "~/redux";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback="loading">
         <Wrapper />
      </Suspense>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);