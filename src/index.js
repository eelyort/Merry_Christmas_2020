import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import App from "./components/app/App";
import './index.css';
import reportWebVitals from './diagnostics/reportWebVitals';
import HomePage from "./components/homePage/HomePage";

ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route exact path="/">
                    <HomePage/>
                </Route>
                <Route path="/kaguya_pong">
                    <App/>
                </Route>
            </Switch>
        </div>
    </Router>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();