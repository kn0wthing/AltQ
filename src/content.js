/* eslint-disable no-undef */
import '@webcomponents/custom-elements';
import cardhtml from './cardhtml';

customElements.define('popup-tab-switcher', cardhtml);
const tabSwitcherEl = document.createElement('popup-tab-switcher');
document.body.append(tabSwitcherEl);
