require('./bootstrap');
require('moment');

import React from 'react';
import { render } from 'react-dom';
import { App } from '@inertiajs/inertia-react';

const appElement = document.getElementById('app');

render(
    <React.StrictMode>
        <App
            initialPage={JSON.parse(appElement.dataset.page)}
            resolveComponent={name => require(`./Pages/${name}.js`).default}
        />
    </React.StrictMode>,
    appElement
);