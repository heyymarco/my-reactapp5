import JssVarCollection from './JssVarCollection';
import Color from 'color';



type ColorList = { [index: string]: Color };



const basics: ColorList = {
    blue        : Color('#0d6efd'),
    indigo      : Color('#6610f2'),
    purple      : Color('#6f42c1'),
    pink        : Color('#d63384'),
    red         : Color('#dc3545'),
    orange      : Color('#fd7e14'),
    yellow      : Color('#ffc107'),
    green       : Color('#198754'),
    teal        : Color('#20c997'),
    cyan        : Color('#0dcaf0'),

    black       : Color('#000000'),
    white       : Color('#ffffff'),
    gray        : Color('#6c757d'),
    grayDark    : Color('#343a40'),
};

const themes: ColorList = {
    primary   : basics.blue,
    secondary : basics.gray,
    success   : basics.green,
    info      : basics.cyan,
    warning   : basics.yellow,
    danger    : basics.red,
    light     : Color('#f8f9fa'),
    dark      : Color('#212529'),
};

const themesTransp: ColorList = { };
let transpLevel = 0.25;
for (const name in themes) {
    themesTransp[`${name}Transp`] = Color(themes[name]).alpha(transpLevel);
}

const colors = Object.assign({},
    basics,
    themes,
    themesTransp
);



const collection = new JssVarCollection<Color>(
    colors,
    { varPrefix: 'col'},
    (raw)   => Color(raw),
    (color) => (color.alpha() === 1) ? color.hex() : color.toString()
);
const config = collection.config;
const items  = collection.items;
export { config, items as colors };
export default items;