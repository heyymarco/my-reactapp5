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

    boxShadow          : (number|string)[][]

    transition         : string | string[][]

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

// define default cssProps' value to be stored into css vars:
const keyframesNone  = { };
// re-defined later, we need to construct varProps first
const keyframesHover = { from: undefined, to: undefined };
const keyframesLeave = { from: undefined, to: undefined };
const cssProps: CssProps = {
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

    boxShadow         : [[0, 0, 'transparent']],

    transition        : [
        ['background', '300ms', 'ease-out'],
        ['color'     , '300ms', 'ease-out'],
        ['border'    , '300ms', 'ease-out'],
    ],

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
Object.assign(keyframesHover, {
    from: {
        filter: [[
            cssProps.filter,
        ]],
    },
    to: {
        filter: [[
            cssProps.filter,
            cssProps.filterHover,
        ]],
    }
});
Object.assign(keyframesLeave, {
    from : keyframesHover.to,
    to   : keyframesHover.from
});



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'elm'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const stateEnabled            = (content: object) => ({
    '&.enabled': { // .enabled
        extend: [content]
    }
});
const stateNotEnabled         = (content: object) => ({
    '&:not(.enabled)': { // not-.enabled
        extend: [content]
    }
});
const stateDisabled           = (content: object) => ({
    '&:disabled,&.disabled': { // :disabled or .disabled
        extend: [content]
    }
});
const stateNotDisabled        = (content: object) => ({
    '&:not(:disabled):not(.disabled)': { // not-:disabled and not-.disabled
        extend: [content]
    }
});
const stateEnabledDisabled    = (content: object) => ({
    '&.enabled,&:disabled,&.disabled': { // .enabled or :disabled or .disabled
        extend: [content]
    }
});
const stateNotEnabledDisabled = (content: object) => ({
    '&:not(.enabled):not(:disabled):not(.disabled)': { // not-.enabled and not-:disabled and not-.disabled
        extend: [content]
    }
});

const stateHover              = (content: object) => ({
    '&:hover,&:focus': { // hover or focus
        extend: [content]
    }
});
const stateNotHover           = (content: object) => ({
    '&:not(:hover):not(:focus)': { // not-hover and not-focus
        extend: [content]
    }
});
const stateLeave              = (content: object) =>
    stateNotHover({ // not-hover and not-focus and (leave or blur)
        extend:[{'&.leave,&.blur': {
            extend: [content]
        }}]
    });
const stateNotLeave           = (content: object) => ({
    '&:not(.leave):not(.blur)': { // not-leave and not-blur
        extend: [content]
    }
});
const stateHoverLeave         = (content: object) => ({
    '&:hover,&:focus,&.leave,&.blur': { // hover or focus or leave or blur
        extend: [content]
    }
});
const stateNotHoverLeave      = (content: object) => ({
    '&:not(:hover):not(:focus):not(.leave):not(.blur)': { // not-hover and not-focus and not-leave and not-blur
        extend: [content]
    }
});

const filterValidProps = <TVarProps,>(varProps: TVarProps) => {
    const varProps2: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(varProps)) {
        if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|Hover|Leave|Focus|Blur|Active|Passive|Enabled|Disabled|None)$|^(@)|backgGrad/).test(key)) continue;
        varProps2[key] = value;
    }
    return varProps2;
}

const mixins = {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    filterValidProps,
};
export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    filterValidProps,
};
export { mixins };

const states = {
    '--elm-animHoverLeave': varProps.animNone,
    anim: [
        varProps.anim,
        'var(--elm-animHoverLeave)',
    ],


    extend:[
        stateNotDisabled({extend:[
            stateHover({
                '--elm-animHoverLeave': varProps.animHover,
            }),
            stateLeave({
                '--elm-animHoverLeave': varProps.animLeave,
            }),
        ]}),
    ],
};

const styles = {
    main: {
        extend: [
            filterValidProps(varProps),
            states,
        ],

        '--elm-backgFn': varProps.backg,
        backg: `var(--elm-backgFn)`,
    },
    gradient: { '&:not(._)': { // force to win conflict with main
        '--elm-backgFn': [
            varProps.backgGrad,
            varProps.backg,
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
const varProps2 = varProps as any;
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
    '--elm-backg': themeColor,
    '--elm-color': (colors as any)[`${theme}Text`],
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
