// jss   (builds css  using javascript):
import type * as Css       from './Css'                // ts defs support for jss
import JssVarCollection    from './jss-var-collection' // stores css props on the :root as global vars
import type { Dictionary } from './jss-var-collection' // ts defs support for jss

// other libs:
import Color               from 'color'                // color utilities



type ColorVal = (Color|string) | Css.Ref;



export let transpLevel = 0.5;
const transpColor = (color: Color) => color.alpha(transpLevel)                       as ColorVal;
const textColor   = (color: Color) => (color.isLight() ? themes.dark : themes.light) as ColorVal;
export let thinLevel = 0.2;
const thinColor   = (color: Color) => color.alpha(thinLevel)                         as ColorVal;
const contColor   = (color: Color) => color.mix(page2.foreg as Color, 0.8)           as ColorVal;



// define default cssProps' value to be stored into css vars:
const basics = {
    blue        : Color('#0d6efd') as ColorVal,
    indigo      : Color('#6610f2') as ColorVal,
    purple      : Color('#6f42c1') as ColorVal,
    pink        : Color('#d63384') as ColorVal,
    red         : Color('#dc3545') as ColorVal,
    orange      : Color('#fd7e14') as ColorVal,
    yellow      : Color('#ffc107') as ColorVal,
    green       : Color('#198754') as ColorVal,
    teal        : Color('#20c997') as ColorVal,
    cyan        : Color('#0dcaf0') as ColorVal,

    black       : Color('#000000') as ColorVal,
    white       : Color('#ffffff') as ColorVal,
    gray        : Color('#6c757d') as ColorVal,
    grayDark    : Color('#343a40') as ColorVal,
};

const themes = {
    primary   : basics.blue,
    secondary : basics.gray,
    success   : basics.green,
    info      : basics.cyan,
    warning   : basics.yellow,
    danger    : basics.red,
    light     : Color('#f8f9fa') as ColorVal,
    dark      : Color('#212529') as ColorVal,
};

const page = {
    backg     : basics.white,
};

const page2 = {
    foreg       : textColor(page.backg as Color),
};
const page3 = {
    backgTransp : transpColor(page.backg as Color),
    backgThin   : thinColor(page.backg as Color),
    backgCont   : contColor(page.backg as Color),

    foregTransp : transpColor(page2.foreg as Color),
    foregThin   : thinColor(page2.foreg as Color),
    foregCont   : contColor(page2.foreg as Color),
};

const themesTransp = {
    primaryTransp   : transpColor(themes.primary   as Color),
    secondaryTransp : transpColor(themes.secondary as Color),
    successTransp   : transpColor(themes.success   as Color),
    infoTransp      : transpColor(themes.info      as Color),
    warningTransp   : transpColor(themes.warning   as Color),
    dangerTransp    : transpColor(themes.danger    as Color),
    lightTransp     : transpColor(themes.light     as Color),
    darkTransp      : transpColor(themes.dark      as Color),
};

const themesText = {
    primaryText   : textColor(themes.primary   as Color),
    secondaryText : textColor(themes.secondary as Color),
    successText   : textColor(themes.success   as Color),
    infoText      : textColor(themes.info      as Color),
    warningText   : textColor(themes.warning   as Color),
    dangerText    : textColor(themes.danger    as Color),
    lightText     : textColor(themes.light     as Color),
    darkText      : textColor(themes.dark      as Color),
};

const themesThin = {
    primaryThin   : thinColor(themes.primary   as Color),
    secondaryThin : thinColor(themes.secondary as Color),
    successThin   : thinColor(themes.success   as Color),
    infoThin      : thinColor(themes.info      as Color),
    warningThin   : thinColor(themes.warning   as Color),
    dangerThin    : thinColor(themes.danger    as Color),
    lightThin     : thinColor(themes.light     as Color),
    darkThin      : thinColor(themes.dark      as Color),
};

const themesCont = {
    primaryCont   : contColor(themes.primary   as Color),
    secondaryCont : contColor(themes.secondary as Color),
    successCont   : contColor(themes.success   as Color),
    infoCont      : contColor(themes.info      as Color),
    warningCont   : contColor(themes.warning   as Color),
    dangerCont    : contColor(themes.danger    as Color),
    lightCont     : contColor(themes.light     as Color),
    darkCont      : contColor(themes.dark      as Color),
};

const props = {
    ...basics,
    ...themes,
    ...page,
    ...page2,
    ...page3,
    ...themesTransp,
    ...themesText,
    ...themesThin,
    ...themesCont,
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*props    :*/ props as { [index: string]: Color},
    /*config   :*/ { varPrefix: 'col'},
    /*parser   :*/ (raw)   => Color(raw),
    /*toString :*/ (color) => (color.alpha() === 1) ? color.hex() : color.toString()
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
const valProps = collection.valProps as typeof props;
// export the configurable props:
export { config, varProps as colors, valProps as colorValues };
export default varProps;



const themesProxy = new Proxy(themes, {
    get: (items, name: string)        => (varProps  as Dictionary<Css.Ref>)[name],
    set: (items, name: string, value) => (varProps  as Dictionary<ColorVal>)[name] = value,
}) as typeof themes;
export { themesProxy as themes };


const themesTextProxy = new Proxy(themesText, {
    get: (items, name: string)        => (varProps  as Dictionary<Css.Ref>)[name],
    set: (items, name: string, value) => (varProps  as Dictionary<ColorVal>)[name] = value,
}) as typeof themesText;
export { themesTextProxy as themesText };