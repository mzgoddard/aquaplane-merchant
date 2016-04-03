import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';

import Board from './board';

render(<Board />, document.querySelector('#root'));
