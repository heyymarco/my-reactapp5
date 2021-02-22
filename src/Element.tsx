import React               from 'react';

import
    colors,
    * as color             from './colors';
import
    borders,
    * as border            from './borders';
import spacers             from './spacers';
import
    typos,
    { base as typoBase }   from './typos/index';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface CssProps
    extends typoBase.CssProps {

    fontSizeSm         : string | number | typoBase.Expression
    fontSizeLg         : string | number | typoBase.Expression

    color              : string
    backg              : string | string[][] | object
    backgGrad          : string | string[][]

    paddingX           : string | number | typoBase.Expression
    paddingY           : string | number | typoBase.Expression
    paddingXSm         : string | number | typoBase.Expression
    paddingYSm         : string | number | typoBase.Expression
    paddingXLg         : string | number | typoBase.Expression
    paddingYLg         : string | number | typoBase.Expression

    border             : string | string[][]
    borderRadius       : string | number
    borderRadiusSm     : string | number
    borderRadiusLg     : string | number


    // anim props:

    transition         : string | string[][]

    boxShadowNone      : (number|string)[][]
    boxShadow          : (number|string)[][]

    filterNone         : 'brightness(100%)'
    filter             : string | string[][]

    '@keyframes none'  : { }
    animNone           : string | (string | object)[][]
    anim               : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    /**
     * a custom css props for manipulating foreground.
     */
    colorFn : '--elm-colorFn',

    /**
     * a custom css props for manipulating background(s).
     */
    backgFn : '--elm-backgFn',

    /**
     * custom css props for manipulating animation(s).
     */
    animFn  : '--elm-animFn',
};

// re-defined later, we need to construct varProps first
const keyframesNone  = { };
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    fontSize          : typos.fontSizeNm,
    fontSizeSm        : [['calc((', typos.fontSizeSm, '+', typos.fontSizeNm, ')/2)']],
    fontSizeLg        : typos.fontSizeMd,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : 'currentColor',
    backg             : 'rgba(255, 255, 255, 0)', // transp white, so the foreg color will be black
    backgGrad         : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],

    paddingX          : [['calc((', spacers.sm as string, '+', spacers.md as string, ')/2)']],
    paddingY          : [['calc((', spacers.xs as string, '+', spacers.sm as string, ')/2)']],
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
        ['background', '300ms', 'ease-out'],
        ['color'     , '300ms', 'ease-out'],
        ['border'    , '300ms', 'ease-out'],
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
        if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|None)$|^(@)|backgGrad|anim/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}

const states = { };

const styles = {
    main: {
        extend: [
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],



        // we have 3 custom css props [colorFn, backgFn, animFn]
        // set the default value of them:

        // a custom css props for manipulating foreground:
        [vars.colorFn]: cssProps.color, // set default value
        color: getVar(vars.colorFn),    // apply prop

        // a custom css props for manipulating background(s):
        [vars.backgFn]: cssProps.backg, // set default value
        backg: getVar(vars.backgFn),    // apply prop

        // a custom css props for manipulating animation(s):
        [vars.animFn]: cssProps.anim,   // set default value
        anim: getVar(vars.animFn),      // apply prop
    },
    gradient: { '&:not(._)': { // force to win conflict with main
        // customize the backg:
        [vars.backgFn]: [
            cssProps.backgGrad,
            cssProps.backg,
        ],
    }},
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
    // overwrite the backg & color props
    // we ignore the backg & color if the theme applied

    '--elm-backg' : themeColor,
    '--elm-color' : (colors as any)[`${theme}Text`],
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
export function useVariantTheme(props: VariantTheme, styles: Record<string, string>, themeDefault?: () => string) {
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
