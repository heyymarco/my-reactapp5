// jss   (builds css  using javascript):
import type * as Css       from './Css'             // ts defs support for jss
import CssPropsManager     from './CssPropsManager' // A *css custom property* manager that manages & updates the *css props* stored at specified `rule`.
import type { Dictionary } from './CssPropsManager' // ts defs support for jss

// other libs:
import Color               from 'color'             // color utilities



// jss:

const transpLevel = 0.5
const transpColor = (color: Color) => color.alpha(transpLevel)
const textColor   = (color: Color) => (color.isLight() ? themes.dark : themes.light)
const thinLevel   = 0.2
const thinColor   = (color: Color) => color.alpha(thinLevel)
const contColor   = (color: Color) => color.mix(page2.foreg as Color, 0.8)



//#region define colors by group
const basics = {
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

const themes = {
    primary   : basics.blue,
    secondary : basics.gray,
    success   : basics.green,
    info      : basics.cyan,
    warning   : basics.yellow,
    danger    : basics.red,
    light     : Color('#f8f9fa'),
    dark      : Color('#212529'),
};

const page = {
    backg     : basics.white,
};

const page2 = {
    foreg       : textColor(page.backg),
};
const page3 = {
    backgTransp : transpColor(page.backg),
    backgThin   : thinColor(page.backg),
    backgCont   : contColor(page.backg),

    foregTransp : transpColor(page2.foreg),
    foregThin   : thinColor(page2.foreg),
    foregCont   : contColor(page2.foreg),
};

const themesTransp = {
    primaryTransp   : transpColor(themes.primary),
    secondaryTransp : transpColor(themes.secondary),
    successTransp   : transpColor(themes.success),
    infoTransp      : transpColor(themes.info),
    warningTransp   : transpColor(themes.warning),
    dangerTransp    : transpColor(themes.danger),
    lightTransp     : transpColor(themes.light),
    darkTransp      : transpColor(themes.dark),
};

const themesText = {
    primaryText   : textColor(themes.primary),
    secondaryText : textColor(themes.secondary),
    successText   : textColor(themes.success),
    infoText      : textColor(themes.info),
    warningText   : textColor(themes.warning),
    dangerText    : textColor(themes.danger),
    lightText     : textColor(themes.light),
    darkText      : textColor(themes.dark),
};

const themesThin = {
    primaryThin   : thinColor(themes.primary),
    secondaryThin : thinColor(themes.secondary),
    successThin   : thinColor(themes.success),
    infoThin      : thinColor(themes.info),
    warningThin   : thinColor(themes.warning),
    dangerThin    : thinColor(themes.danger),
    lightThin     : thinColor(themes.light),
    darkThin      : thinColor(themes.dark),
};

const themesCont = {
    primaryCont   : contColor(themes.primary),
    secondaryCont : contColor(themes.secondary),
    successCont   : contColor(themes.success),
    infoCont      : contColor(themes.info),
    warningCont   : contColor(themes.warning),
    dangerCont    : contColor(themes.danger),
    lightCont     : contColor(themes.light),
    darkCont      : contColor(themes.dark),
};

const allColors = {
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
//#endregion define colors by group



/**
 * A *css custom property* manager that manages & updates the *css props* stored at specified `rule`.
 */
const cssPropsManager = new CssPropsManager(() => {
    type ColorList  = typeof allColors;
    type ColorProxy = { [key in keyof ColorList]: Css.Color };
    return new Proxy(allColors as unknown as ColorProxy, {
        get: (t, prop: string) => {
            const color = (allColors as Dictionary<Color>)[prop];
            return (color.alpha() === 1) ? color.hex() : color.toString();
        },
    });
}, /*prefix: */'col');
export const colors  = cssPropsManager.refs;
export default colors;



const createProxy = <TColorGroup extends { [key in keyof TColorGroup]: Color },>(colorGroup: TColorGroup) => new Proxy(colorGroup as unknown as { [key in keyof TColorGroup]: Css.Color }, {
    get: (t, prop: string): (Css.Color|undefined) => {
        if (!(prop in colorGroup)) return undefined; // not found

        return (colors as Dictionary<Css.Color>)[prop];
    },
    set: (t, prop: string, newValue: Css.Color) => {
        if (prop in colorGroup) { // already exists => update
            (colors as Dictionary<Css.Color>)[prop] = newValue;
        }
        else { // create a new one and stored both to colorGroup & colors
            const colorValue = Color(newValue);
            (colorGroup as Dictionary<Color>)[prop] = colorValue;
            (colors as Dictionary<Css.Color>)[prop] = (colorValue.alpha() === 1) ? colorValue.hex() : colorValue.toString();
        } // if
        

        return true;
    },
});

const themesProxy     = createProxy(themes);
const themesTextProxy = createProxy(themesText);

export {
    themesProxy     as themes,
    themesTextProxy as themesText,
}
