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
import
    Element,
    * as Elements          from './Element';
import {
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateDisabled, stateNotDisabled, stateEnabled, stateNotEnabled, stateEnabledDisabled, stateNotEnabledDisabled,
    filterValidProps,
}                          from './Element';
import stipOuts            from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface CssProps {
    boxShadowFocus : (number|string)[][]

    cursorEnabled  : string
    cursorDisabled : string

    filterActive   : string | string[][]
    filterDisabled : string | string[][]

    
    '@keyframes hover'    : object
    '@keyframes leave'    : object
    '@keyframes focus'    : object
    '@keyframes blur'     : object
    '@keyframes active'   : object
    '@keyframes passive'  : object
    '@keyframes enabled'  : object
    '@keyframes disabled' : object

    animHover             : string | (string | object)[][]
    animLeave             : string | (string | object)[][]
    animFocus             : string | (string | object)[][]
    animBlur              : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
    animEnabled           : string | (string | object)[][]
    animDisabled          : string | (string | object)[][]
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesHover    = { from: undefined, to: undefined };
const keyframesLeave    = { from: undefined, to: undefined };
const keyframesFocus    = { from: undefined, to: undefined };
const keyframesBlur     = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const keyframesEnabled  = { from: undefined, to: undefined };
const keyframesDisabled = { from: undefined, to: undefined };
const cssProps: CssProps = {
    boxShadowFocus        : [[0, 0, 0, '0.2rem']],

    cursorEnabled         : 'pointer',
    cursorDisabled        : 'not-allowed',

    filterActive          : [['brightness(65%)', 'contrast(150%)']],
    filterDisabled        : [['grayscale(50%)',  'opacity(50%)']],

    '@keyframes hover'    : keyframesHover,
    '@keyframes leave'    : keyframesLeave,
    '@keyframes focus'    : keyframesFocus,
    '@keyframes blur'     : keyframesBlur,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    '@keyframes enabled'  : keyframesEnabled,
    '@keyframes disabled' : keyframesDisabled,
    animHover             : [['150ms', 'ease-out', 'both', keyframesHover   ]],
    animLeave             : [['300ms', 'ease-out', 'both', keyframesLeave   ]],
    animFocus             : [['150ms', 'ease-out', 'both', keyframesFocus   ]],
    animBlur              : [['300ms', 'ease-out', 'both', keyframesBlur    ]],
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive ]],
    animEnabled           : [['150ms', 'ease-out', 'both', keyframesEnabled ]],
    animDisabled          : [['300ms', 'ease-out', 'both', keyframesDisabled]],
};
Object.assign(keyframesHover, {
    from: {
        filter: [[
            Elements.cssProps.filter,
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            'var(--ctrl-filterHoverLeave)',
        ]],
    }
});
Object.assign(keyframesLeave, {
    from : keyframesHover.to,
    to   : keyframesHover.from
});

Object.assign(keyframesFocus, {
    from: {
        boxShadow: [[[
            Elements.cssProps.boxShadow,
        ]]],
    },
    to: {
        boxShadow: [[[
            Elements.cssProps.boxShadow,
            'var(--ctrl-boxShadowFocusBlur)',
        ]]],
    }
});
Object.assign(keyframesBlur, {
    from : keyframesFocus.to,
    to   : keyframesFocus.from
});



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ctrl'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const stateFocus              = (content: object) => ({
    '&:focus': {
        extend: [content]
    }
});
const stateNotFocus           = (content: object) => ({
    '&:not(:focus)': {
        extend: [content]
    }
});
const stateBlur              = (content: object) => ({
    '&.blur': {
        extend: [content]
    }
});
const stateNotBlur           = (content: object) => ({
    '&:not(.blur)': {
        extend: [content]
    }
});
const stateFocusBlur         = (content: object) => ({
    '&:focus,&.blur': {
        extend: [content]
    }
});
const stateNotFocusBlur      = (content: object) => ({
    '&:not(:focus):not(.blur)': {
        extend: [content]
    }
});

const mixins = {
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
};
export {
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
};
export { mixins };



const states = {
    '--ctrl-filterHoverLeave'   : Elements.cssProps.filterNone,
    '--ctrl-animHoverLeave'     : Elements.cssProps.animNone,

    '--ctrl-boxShadowFocusBlur' : none,
    '--ctrl-animFocusBlur'      : Elements.cssProps.animNone,
    anim: [
        Elements.cssProps.anim,
        'var(--ctrl-animHoverLeave)',
        'var(--ctrl-animFocusBlur)',
    ],


    extend:[
        stateNotDisabled({extend:[
            stateHoverLeave({
                '--ctrl-filterHoverLeave': Elements.cssProps.filterHover,
            }),
            stateHover({
                '--ctrl-animHoverLeave': varProps.animHover,
            }),
            stateLeave({
                '--ctrl-animHoverLeave': varProps.animLeave,
            }),


            stateFocusBlur({
                '--ctrl-boxShadowFocusBlur': 'var(--ctrl-boxShadowFocus-theme)',
            }),
            stateFocus({
                '--ctrl-animFocusBlur': varProps.animFocus,
            }),
            stateBlur({
                '--ctrl-animFocusBlur': varProps.animBlur,
            }),
        ]}),
    ],
};

const styles = {
    main: {
        extend: [
            stipOuts.control,
            Elements.styles.main,
            filterValidProps(varProps),
            states,
        ],
    },
};
for (const [theme, value] of Object.entries(color.themes)) {
    const Theme = pascalCase(theme);
    const themeProp = `theme${Theme}`;
    (styles as any)[themeProp] = {
        extend: [
            (Elements.styles as any)[themeProp],
        ],
        '--ctrl-boxShadowFocus-theme': [[varProps.boxShadowFocus, (colors as any)[`${theme}Transp`]]],
    };
}

const useStyles = createUseStyles(styles);
export { styles, useStyles };



export function useStateBlur() {
    const [stateBlur, setStateBlur] = useState<boolean|null>(null);

    return {
        blur : stateBlur,
        class: stateBlur ? 'blur': null,
        handleFocus: () => {
            setStateBlur(false);
        },
        handleBlur: () => {
            setStateBlur(true);
        },
        handleAnimationEnd: () => {
            setStateBlur(false);
        }
    };
}

export interface Props
    extends
        Elements.Props
{
}
export default function Control(props: Props) {
    const styles        = useStyles();
    const elmStyles     = Elements.useStyles();
    const varSize       = Elements.useVariantSize(props, elmStyles);
    const varTheme      = Elements.useVariantTheme(props, styles);
    const varGradient   = Elements.useVariantGradient(props, elmStyles);
    const stateLeave    = Elements.useStateLeave();
    const stateBlur     = useStateBlur();

    return (
        <input className={[
                styles.main,
                varSize.class,
                varTheme.class,
                varGradient.class,

                stateLeave.class,
                stateBlur.class,
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateBlur.handleFocus}
            onBlur={stateBlur.handleBlur}
            onAnimationEnd={() => {stateLeave.handleAnimationEnd(); stateBlur.handleAnimationEnd();}}

            placeholder='Base Control'
        />
    );
}