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

    anim               : string | (string | object)[][]
    animNone           : string | (string | object)[][]
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

    color             : typos.color,
    backg             : 'lightblue',//rgba(255, 255, 255, 0)', // transp white, so the foreg color will be black
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
    anim              : [[keyframesNone]],
    animNone          : [[keyframesNone]],
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



const stateHover              = (content: object) => ({
    '&:hover,&:focus': {
        extend: [content]
    }
});
const stateNotHover           = (content: object) => ({
    '&:not(:hover):not(:focus)': {
        extend: [content]
    }
});
const stateLeave              = (content: object) => ({
    '&.leave,&.blur': {
        extend: [content]
    }
});
const stateNotLeave           = (content: object) => ({
    '&:not(.leave):not(.blur)': {
        extend: [content]
    }
});
const stateHoverLeave         = (content: object) => ({
    '&:hover,&:focus,&.leave,&.blur': {
        extend: [content]
    }
});
const stateNotHoverLeave      = (content: object) => ({
    '&:not(:hover):not(:focus):not(.leave):not(.blur)': {
        extend: [content]
    }
});

const stateDisabled           = (content: object) => ({
    '&:disabled,&.disabled': {
        extend: [content]
    }
});
const stateNotDisabled        = (content: object) => ({
    '&:not(:disabled):not(.disabled)': {
        extend: [content]
    }
});
const stateEnabled            = (content: object) => ({
    '&.enabled': {
        extend: [content]
    }
});
const stateNotEnabled         = (content: object) => ({
    '&:not(.enabled)': {
        extend: [content]
    }
});
const stateEnabledDisabled    = (content: object) => ({
    '&.enabled,&:disabled,&.disabled': {
        extend: [content]
    }
});
const stateNotEnabledDisabled = (content: object) => ({
    '&:not(.enabled):not(:disabled):not(.disabled)': {
        extend: [content]
    }
});

const filterValidProps = <TVarProps,>(varProps: TVarProps) => {
    const varProps2: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(varProps)) {
        if ((/(Sm|Lg|Hover|Leave|Focus|Blur|Active|Passive|Enabled|Disabled|None)$|^(@)|backgGrad/).test(key)) continue;
        varProps2[key] = value;
    }
    return varProps2;
}

const mixins = {
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateDisabled, stateNotDisabled, stateEnabled, stateNotEnabled, stateEnabledDisabled, stateNotEnabledDisabled,
    filterValidProps,
};
export {
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateDisabled, stateNotDisabled, stateEnabled, stateNotEnabled, stateEnabledDisabled, stateNotEnabledDisabled,
    filterValidProps,
};
export { mixins };

const states = {
    '--elm-animHoverLeave': [[varProps['@keyframes none']]],
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
    },
    gradient: {
        backg: [
            varProps.backgGrad,
            varProps.backg,
        ],
    }
}
const varProps2 = varProps as any;
for (let size of ['sm', 'lg']) {
    size = pascalCase(size);
    (styles as any)[`size${size}`] = {
        fontSize     : varProps2[`fontSize${size}`],
        paddingX     : varProps2[`paddingX${size}`],
        paddingY     : varProps2[`paddingY${size}`],
        borderRadius : varProps2[`borderRadius${size}`],
    };
}
for (const [theme, value] of Object.entries(color.themes)) {
    const Theme = pascalCase(theme);
    (styles as any)[`theme${Theme}`] = {
        backg: value,
        color: (colors as any)[`${theme}Text`],
    };
}

const styles2 = styles as unknown as Record<'main'|'sizeSm'|'sizeLg'|'gradient', string>;
const useStyles = createUseStyles(styles2);
export { styles2 as styles, useStyles };



export interface VariantSize {
    size?: 'sm' | 'lg',
}
export function useVariantSize(props: VariantSize, styles: Record<string, string>) {
    return {
        class: props.size ? (styles as any)[`size${pascalCase(props.size)}`] : null,
    };
}

export interface VariantTheme {
    theme?: string,
}
export function useVariantTheme(props: VariantTheme, styles: Record<string, string>) {
    return {
        class: props.theme ? (styles as any)[`theme${pascalCase(props.theme)}`] : null,
    };
}

export interface VariantGradient {
    enableGradient?: boolean,
}
export function useVariantGradient(props: VariantGradient, styles: Record<'gradient', string>) {
    return {
        class: props.enableGradient ? styles.gradient : null,
    };
}

export function useStateLeave() {
    const [stateLeave, setStateLeave] = useState<boolean|null>(null);

    return {
        leave: stateLeave,
        class: stateLeave ? 'leave': null,
        handleMouseEnter: () => {
            setStateLeave(false);
        },
        handleMouseLeave: () => {
            setStateLeave(true);
        },
        handleAnimationEnd: () => {
            setStateLeave(false);
        }
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
    const styles      = useStyles();
    const varSize     = useVariantSize(props, styles);
    const varTheme    = useVariantTheme(props, styles);
    const varGradient = useVariantGradient(props, styles);
    const stateLeave  = useStateLeave();

    return (
        <div className={[
                styles.main,
                varSize.class,
                varTheme.class,
                varGradient.class,

                stateLeave.class
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onAnimationEnd={stateLeave.handleAnimationEnd}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Element'}
        </div>
    );
};
