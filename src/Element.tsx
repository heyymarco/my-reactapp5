import
    React,
    { useState }           from 'react';

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

    boxShadow          : (number|string)[][]

    filterNone         : 'brightness(100%)'
    filter             : string | string[][]
    filterHover        : string | string[][]

    '@keyframes none'  : { }
    '@keyframes hover' : object
    '@keyframes leave' : object
    animNone           : string | (string | object)[][]
    anim               : string | (string | object)[][]
    animHover          : string | (string | object)[][]
    animLeave          : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    backgFn          : '--elm-backgFn',
    backg            : '--elm-backg',
    color            : '--elm-color',


    // anim props:

    filterHoverLeave : '--elm-filterHoverLeave',
    animHoverLeave   : '--elm-animHoverLeave',
};

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesNone  = { };
const keyframesHover = { from: undefined, to: undefined };
const keyframesLeave = { from: undefined, to: undefined };
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

    boxShadow         : [[0, 0, 'transparent']],

    filterNone        : 'brightness(100%)',
    filter            : 'brightness(100%)',
    filterHover       : 'brightness(85%)',

    '@keyframes none' : keyframesNone,
    '@keyframes hover': keyframesHover,
    '@keyframes leave': keyframesLeave,
    animNone          : [[keyframesNone]],
    anim              : [[keyframesNone]],
    animHover         : [['150ms', 'ease-out', 'both', keyframesHover]],
    animLeave         : [['300ms', 'ease-out', 'both', keyframesLeave]],
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



Object.assign(keyframesHover, {
    from: {
        filter: [[
            cssProps.filter,
            // getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            cssProps.filter,
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    }
});
Object.assign(keyframesLeave, {
    from : keyframesHover.to,
    to   : keyframesHover.from
});



export const stateEnabled            = (content: object) => ({
    '&.enable': { // .enable
        extend: [content]
    }
});
export const stateNotEnabled         = (content: object) => ({
    '&:not(.enable)': { // not-.enable
        extend: [content]
    }
});
export const stateDisabled           = (content: object) => ({
    '&:disabled,&.disabled,&.disable': { // :disabled or .disabled or .disable
        extend: [content]
    }
});
export const stateNotDisabled        = (content: object) => ({
    '&:not(:disabled):not(.disabled):not(.disable)': { // not-:disabled and not-.disabled and not-.disable
        extend: [content]
    }
});
export const stateEnabledDisabled    = (content: object) => ({
    '&.enable,&:disabled,&.disabled,&.disable': { // .enable or :disabled or .disabled or .disable
        extend: [content]
    }
});
export const stateNotEnabledDisabled = (content: object) => ({
    '&:not(.enable):not(:disabled):not(.disabled):not(.disable)': { // not-.enable and not-:disabled and not-.disabled and not-.disable
        extend: [content]
    }
});

export const stateHover              = (content: object) => ({
    '&:hover,&:focus': { // hover or focus
        extend: [content]
    }
});
export const stateNotHover           = (content: object) => ({
    '&:not(:hover):not(:focus)': { // not-hover and not-focus
        extend: [content]
    }
});
export const stateLeave              = (content: object) =>
    stateNotHover({ // not-hover and not-focus and (leave or blur)
        extend:[{'&.leave,&.blur': {
            extend: [content]
        }}]
    });
export const stateNotLeave           = (content: object) => ({
    '&:not(.leave):not(.blur)': { // not-leave and not-blur
        extend: [content]
    }
});
export const stateHoverLeave         = (content: object) => ({
    '&:hover,&:focus,&.leave,&.blur': { // hover or focus or leave or blur
        extend: [content]
    }
});
export const stateNotHoverLeave      = (content: object) => ({
    '&:not(:hover):not(:focus):not(.leave):not(.blur)': { // not-hover and not-focus and not-leave and not-blur
        extend: [content]
    }
});

export const filterValidProps = <TVarProps,>(varProps: TVarProps) => {
    const varProps2: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(varProps)) {
        if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|Hover|Leave|Focus|Blur|Active|Passive|Enabled|Disabled|None)$|^(@)|backgGrad|anim/).test(key)) continue;
        varProps2[key] = value;
    }
    return varProps2;
}



const states = {
    [vars.filterHoverLeave]             : cssProps.filterNone,
    [vars.animHoverLeave]               : cssProps.animNone,

    anim: [
        cssProps.anim,
        getVar(vars.animHoverLeave),
    ],


    extend:[
        stateNotDisabled({extend:[
            stateHoverLeave({
                [vars.filterHoverLeave] : cssProps.filterHover,
            }),
            stateHover({
                [vars.animHoverLeave]   : cssProps.animHover,
            }),
            stateLeave({
                [vars.animHoverLeave]   : cssProps.animLeave,
            }),
        ]}),
    ],
};

const styles = {
    main: {
        extend: [
            filterValidProps(cssProps),
            states,
        ],

        [vars.backgFn]: cssProps.backg,
        backg: getVar(vars.backgFn),
    },
    gradient: { '&:not(._)': { // force to win conflict with main
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
const varProps2 = cssProps as any;
defineSizes(styles, (size, Size, sizeProp) => ({
    '--elm-fontSize'     : varProps2[`fontSize${Size}`],
    '--elm-paddingX'     : varProps2[`paddingX${Size}`],
    '--elm-paddingY'     : varProps2[`paddingY${Size}`],
    '--elm-borderRadius' : varProps2[`borderRadius${Size}`],
}));

export function defineThemes(styles: object, handler: ((theme: string, Theme: string, themeProp: string, themeColor: string) => object)) {
    for(const [theme, themeColor] of Object.entries(color.themes)) {
        const Theme = pascalCase(theme);
        const themeProp = `theme${Theme}`;
        (styles as any)[themeProp] = handler(theme, Theme, themeProp, themeColor as string);
    }
}
defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    [vars.backg]: themeColor,
    [vars.color]: (colors as any)[`${theme}Text`],
}));

const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeLg'|'gradient', string>);
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

export function useStateLeave() {
    const [leaving, setLeaving] = useState(false);

    const handleLeaving = () => { if (!leaving) setLeaving(true);  }
    const handleIdle    = () => { if (leaving)  setLeaving(false); }
    return {
        class: leaving ? 'leave': null,
        handleMouseEnter   : handleIdle,
        handleMouseLeave   : handleLeaving,
        handleAnimationEnd : handleIdle,
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

    const stateLeave   = useStateLeave();



    return (
        <div className={[
                styles.main,
                
                variSize.class,
                variTheme.class,
                variGradient.class,

                stateLeave.class,
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onAnimationEnd={stateLeave.handleAnimationEnd}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Element'}
        </div>
    );
};
