import JssVarCollection from './JssVarCollection';
import Color from 'color';



// define default props' value to be stored into css vars:
const basics = {
    blue        : Color('#0d6efd') as (Color | string),
    indigo      : Color('#6610f2') as (Color | string),
    purple      : Color('#6f42c1') as (Color | string),
    pink        : Color('#d63384') as (Color | string),
    red         : Color('#dc3545') as (Color | string),
    orange      : Color('#fd7e14') as (Color | string),
    yellow      : Color('#ffc107') as (Color | string),
    green       : Color('#198754') as (Color | string),
    teal        : Color('#20c997') as (Color | string),
    cyan        : Color('#0dcaf0') as (Color | string),

    black       : Color('#000000') as (Color | string),
    white       : Color('#ffffff') as (Color | string),
    gray        : Color('#6c757d') as (Color | string),
    grayDark    : Color('#343a40') as (Color | string),
};

const themes = {
    primary   : basics.blue,
    secondary : basics.gray,
    success   : basics.green,
    info      : basics.cyan,
    warning   : basics.yellow,
    danger    : basics.red,
    light     : Color('#f8f9fa') as (Color | string),
    dark      : Color('#212529') as (Color | string),
};

let transpLevel = 0.25;
const themesTransp = {
    primaryTransp   : (themes.primary   as Color).alpha(transpLevel) as (Color | string),
    secondaryTransp : (themes.secondary as Color).alpha(transpLevel) as (Color | string),
    successTransp   : (themes.success   as Color).alpha(transpLevel) as (Color | string),
    infoTransp      : (themes.info      as Color).alpha(transpLevel) as (Color | string),
    warningTransp   : (themes.warning   as Color).alpha(transpLevel) as (Color | string),
    dangerTransp    : (themes.danger    as Color).alpha(transpLevel) as (Color | string),
    lightTransp     : (themes.light     as Color).alpha(transpLevel) as (Color | string),
    darkTransp      : (themes.dark      as Color).alpha(transpLevel) as (Color | string),
};
// const themesTransp = { };
// for (const name in themes) {
//     themesTransp[`${name}Transp`] = Color(themes[name]).alpha(transpLevel);
// }

const props = Object.assign({},
    basics,
    themes,
    themesTransp
);



// convert props => varProps:
const collection = new JssVarCollection(
    /*props    :*/ props as { [index: string]: Color},
    /*config   :*/ { varPrefix: 'col'},
    /*parser   :*/ (raw)   => Color(raw),
    /*toString :*/ (color) => (color.alpha() === 1) ? color.hex() : color.toString()
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as colors };
export default varProps;