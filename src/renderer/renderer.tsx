import React from 'react';
import ReactDOM from 'react-dom';
import StatefulApp from './App';
import * as serviceWorker from './serviceWorker';
import '../../public/index.scss';
import { CustomTheme } from './theme/CustomTheme';
import { ClientRequestHandler } from './data/clientRequestHandler';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ClientRequestHandler.initialise();

ReactDOM.render(
    (<Provider store={store}>
        <StatefulApp />
    </Provider>),
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();