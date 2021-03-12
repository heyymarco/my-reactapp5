import type * as Css       from './Css';

import React               from 'react';

import
    colors,
    * as color             from './colors';
import
    borders,
    * as border            from './borders';
import spacers             from './spacers';
import typos,
    { base as typoBase }   from './typos/index';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';
import { camelCase }       from 'camel-case';



export function escapeSvg(svg: string) {
    const svgCopy = Array.from(svg);
    const escapeChars: { [key: string]: string } = {
        '<': '%3c',
        '>': '%3e',
        '#': '%23',
        '(': '%28',
        ')': '%29',
    };
    for (const index in svgCopy) {
        const char = svgCopy[index];
        if (char in escapeChars) svgCopy[index] = escapeChars[char];
    }

    return svgCopy.join('');
}



export interface CssProps
    extends typoBase.CssProps {

    fontSizeSm         : Css.FontSize
    fontSizeLg         : Css.FontSize

    color              : Css.Color
    backg              : Css.Background
    backgGrad          : Css.Background

    opacity            : Css.Opacity

    paddingX           : Css.PaddingXY
    paddingY           : Css.PaddingXY
    paddingXSm         : Css.PaddingXY
    paddingYSm         : Css.PaddingXY
    paddingXLg         : Css.PaddingXY
    paddingYLg         : Css.PaddingXY

    border             : Css.Border
    borderRadius       : Css.BorderRadius
    borderRadiusSm     : Css.BorderRadius
    borderRadiusLg     : Css.BorderRadius


    // anim props:

    transition         : Css.Transition

    boxShadowNone      : Css.BoxShadow
    boxShadow          : Css.BoxShadow

    filterNone         : 'brightness(100%)'
    filter             : Css.Filter

    '@keyframes none'  : { }
    animNone           : { }[][]
    anim               : Css.Animation
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// internal css vars:
export const getVar = (name: string, fallback1?: string, fallback2?: string) => fallback1 ? (fallback2 ? `var(${name},var(${fallback1},var(${fallback2})))` : `var(${name},var(${fallback1}))`) : `var(${name})`;
export const vars = {
    /**
     * themed foreground color.
     */
    colorTh     : '--elm-colorTh',

    /**
     * conditional foreground color.
     */
    colorIfIf   : '--elm-colorIfIf',

    /**
     * conditional unthemed foreground color.
     */
    colorIf     : '--elm-colorIf',

    /**
     * final foreground color.
     */
    colorFn     : '--elm-colorFn',

    /**
     * none background.
     */
    backgNo     : '--elm-backgNo',

    /**
     * themed background color.
     */
    backgTh     : '--elm-backgTh',

    /**
     * conditional background color.
     */
    backgIfIf   : '--elm-backgIfIf',

    /**
     * conditional unthemed background color.
     */
    backgIf     : '--elm-backgIf',

    /**
     * final composite background(s).
     */
    backgFn     : '--elm-backgFn',

    /**
     * background gradient.
     */
    backgGradTg : '--elm-backgGradTg',



    /**
     * themed foreground color at outlined state.
     */
    colorOutlineTh   : '--elm-colorOutlineTh',

    /**
     * conditional foreground color at outlined state.
     */
    colorOutlineIfIf : '--elm-colorOutlineIfIf',

    /**
     * conditional unthemed foreground color at outlined state.
     */
    colorOutlineIf   : '--elm-colorOutlineIf',

    /**
     * final foreground color at outlined state.
     */
    colorOutlineFn   : '--elm-colorOutlineFn',

    /**
     * final composite background(s) at outlined state.
     */
    backgOutlineFn   : '--elm-backgOutlineFn',



    /**
     * final composite animation(s).
     */
    animFn    : '--elm-animFn',
};

// re-defined later, we need to construct varProps first
const keyframesNone  = { };
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    fontSize          : typos.fontSizeNm,
    fontSizeSm        : [['calc((', (typos.fontSizeSm as string), '+', (typos.fontSizeNm as string), ')/2)']],
    fontSizeLg        : typos.fontSizeMd,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : 'currentColor',
    backg             : 'transparent',
    backgGrad         : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],

    opacity           : 1,

    paddingX          : [['calc((', (spacers.sm as string), '+', (spacers.md as string), ')/2)']],
    paddingY          : [['calc((', (spacers.xs as string), '+', (spacers.sm as string), ')/2)']],
    paddingXSm        : spacers.sm as string,
    paddingYSm        : spacers.xs as string,
    paddingXLg        : spacers.md as string,
    paddingYLg        : spacers.sm as string,
    border            : borders.default,
    borderRadius      : border.radiuses.md,
    borderRadiusSm    : border.radiuses.sm,
    borderRadiusLg    : border.radiuses.lg,


    // anim props:

    transition        : [
        ['background' , '300ms', 'ease-out'],
        ['color'      , '300ms', 'ease-out'],
        ['border'     , '300ms', 'ease-out'],
        ['font-size'  , '300ms', 'ease-out'],
        ['width'      , '300ms', 'ease-out'],
        ['height'     , '300ms', 'ease-out'],
    ],

    boxShadowNone     : [[0, 0, 'transparent']],
    boxShadow         : [[0, 0, 'transparent']],

    filterNone        : 'brightness(100%)',
    filter            : 'brightness(100%)',

    '@keyframes none' : keyframesNone,
    animNone          : [[keyframesNone]],
    anim              : [[keyframesNone]],
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'elm'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const filterValidProps = <TCssProps,>(cssProps: TCssProps) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(cssProps)) {
        if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|None|Enable|Disable|Active|Passive|Check|Clear|Hover|Leave|Focus|Blur|Valid|Unvalid|Invalid|Uninvalid)$|^(@)|color|backg|backgGrad|anim|orientation|align/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}
export const filterPrefixProps = <TCssProps,>(cssProps: TCssProps, prefix: string) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(cssProps)) {
        if (!key.startsWith(prefix)) continue;
        cssPropsCopy[camelCase(key.substr(prefix.length))] = value;
    }
    return cssPropsCopy;
}

const states = {
    // customize conditional unthemed foreground color:
    [vars.colorIf] : cssProps.color,

    // customize final foreground color:
    [vars.colorFn] : getVar(
        vars.colorIfIf, // first  priority
        vars.colorTh,   // second priority
        vars.colorIf    // third  priority
    ),

    // customize none background.
    [vars.backgNo] : 'linear-gradient(transparent,transparent)',

    // customize conditional unthemed background color:
    [vars.backgIf] : getVar(vars.backgNo),

    // customize final composite background(s):
    [vars.backgFn] : [
        getVar(
            vars.backgGradTg,
            vars.backgNo
        ),
        getVar(
            vars.backgIfIf, // first  priority
            vars.backgTh,   // second priority
            vars.backgIf    // third  priority
        ),
        cssProps.backg,
    ],



    // customize conditional unthemed foreground color at outlined state:
    [vars.colorOutlineIf] : cssProps.color,

    // customize final foreground color at outlined state:
    [vars.colorOutlineFn] : getVar(
        vars.colorOutlineIfIf, // first  priority
        vars.colorOutlineTh,   // second priority
        vars.colorOutlineIf    // third  priority
    ),

    // customize final composite background(s) at outlined state:
    [vars.backgOutlineFn] : getVar(
        vars.backgGradTg,
        vars.backgNo
    ),



    // customize final composite animation(s):
    [vars.animFn]  : [
        cssProps.anim,
    ],
};

const styles = {
    basic: {
        extend: [
            filterValidProps(cssProps), // apply our filtered cssProps
        ],



        // apply final foreground color:
        color : getVar(vars.colorFn),

        // apply final composite background(s):
        backg : getVar(vars.backgFn),

        // apply final composite animation(s):
        anim  : getVar(vars.animFn),
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
    outline: {
        '&:not(._)': { // force to win conflict with main
            // apply final foreground color at outlined state:
            color       : getVar(vars.colorOutlineFn),
    
            // apply final composite background(s) at outlined state:
            backg       : getVar(vars.backgOutlineFn),
    
            // set border color = text-color:
            borderColor : getVar(vars.colorOutlineFn),
        },
    },
    gradient: {
        // customize background gradient:
        [vars.backgGradTg]: cssProps.backgGrad,
    },
};

export function defineSizes(styles: object, handler: ((size: string, Size: string, sizeProp: string) => object), sizes = ['sm', 'lg']) {
    for(const size of sizes) {
        const Size = pascalCase(size);
        const sizeProp = `size${Size}`;
        (styles as any)[sizeProp] = handler(size, Size, sizeProp);
    }
}
const cssPropsAny = cssProps as any;
defineSizes(styles, (size, Size, sizeProp) => ({
    // overwrite the props with the props{Size}:

    '--elm-fontSize'     : cssPropsAny[`fontSize${Size}`],
    '--elm-paddingX'     : cssPropsAny[`paddingX${Size}`],
    '--elm-paddingY'     : cssPropsAny[`paddingY${Size}`],
    '--elm-borderRadius' : cssPropsAny[`borderRadius${Size}`],
}));

export function defineThemes(styles: object, handler: ((theme: string, Theme: string, themeProp: string, themeColor: string) => object)) {
    for(const [theme, themeColor] of Object.entries(color.themes)) {
        const Theme = pascalCase(theme);
        const themeProp = `theme${Theme}`;
        (styles as any)[themeProp] = handler(theme, Theme, themeProp, themeColor as string);
    }
}
defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    // customize the backg & color

    // customize themed foreground color:
    [vars.colorTh]        : (colors as any)[`${theme}Text`],

    // customize themed background color:
    [vars.backgTh]        : `linear-gradient(${themeColor},${themeColor})`,

    // customize themed foreground color at outlined state:
    [vars.colorOutlineTh] : themeColor,
}));

const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeLg', object>);
const useStyles = createUseStyles(styles2);
export { states, styles2 as styles, useStyles };



export interface VariantSize {
    size?: 'sm' | 'lg' | string
}
export function useVariantSize(props: VariantSize, styles: Record<string, string>) {
    return {
        class: props.size ? (styles as any)[`size${pascalCase(props.size)}`] : null,
    };
}

export interface VariantTheme {
    theme?: string
}
export function useVariantTheme(props: VariantTheme, styles: Record<string, string>, themeDefault?: () => (string|undefined)) {
    const theme = props.theme ?? themeDefault?.();
    return {
        class: theme ? (styles as any)[`theme${pascalCase(theme)}`] : null,
    };
}

export interface VariantGradient {
    enableGradient?: boolean
}
export function useVariantGradient(props: VariantGradient, styles: Record<'gradient', string>) {
    return {
        class: props.enableGradient ? styles.gradient : null,
    };
}

export interface Props
    extends
        VariantSize,
        VariantTheme,
        VariantGradient
{
}
export default function Element(props: Props) {
    const styles       = useStyles();

    const variSize     = useVariantSize(props, styles);
    const variTheme    = useVariantTheme(props, styles);
    const variGradient = useVariantGradient(props, styles);



    return (
        <div className={[
                styles.main,
                
                variSize.class,
                variTheme.class,
                variGradient.class,
            ].join(' ')}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Element'}
        </div>
    );
};
