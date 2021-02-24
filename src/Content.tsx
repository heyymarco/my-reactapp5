import React               from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Indicator';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
    // anim props:

    colorActive           : string
    backgActive           : string | string[][] | object
    filterActive          : string | string[][]

    '@keyframes active'   : object
    '@keyframes passive'  : object
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Indicators.vars, {
    /**
     * a custom css props for manipulating foreground at active state.
     */
    colorActiveFn      : '--ct-colorActiveFn',

    /**
     * a custom css props for manipulating background(s) at active state.
     */
    backgActiveFn      : '--ct-backgActiveFn',
});

// re-defined later, we need to construct varProps first
export const keyframesActive   = { from: undefined, to: undefined };
export const keyframesPassive  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // anim props:

    colorActive           : ecssProps.color,
    backgActive           : colors.foregThin,
    filterActive          : ecssProps.filterNone,

    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive]],
};



Object.assign(keyframesActive, {
    from: Object.assign({}, Indicators.keyframesActive.from, {
        color: getVar(vars.colorFn),
        backg: getVar(vars.backgFn),
    }),
    to: Object.assign({}, Indicators.keyframesActive.to, {
        color: getVar(vars.colorActiveFn),
        backg: getVar(vars.backgActiveFn),
    })
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ct'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = Object.assign({}, Indicators.states, {
    // change the Indicator's behavior when in active state:
    '--indi-filterActive' : cssProps.filterActive, // override Indicator's filter active
    '--indi-animActive'   : cssProps.animActive,   // override Indicator's anim active
    '--indi-animPassive'  : cssProps.animPassive,  // override Indicator's anim passive



    // customize the foreground at active state:
    [vars.colorActiveFn]: cssProps.colorActive,

    // customize the background(s) at active state:
    [vars.backgActiveFn]: cssProps.backgActive,
});

const styles = {
    main: {
        extend: [
            Indicators.styles.main,     // copy styles from Indicator, including Indicator's cssProps & Indicator's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
    gradient: { '&:not(._)': { // force to win conflict with main
        extend: [
            // copy the themes from Element:
            Elements.styles.gradient,
        ],

        // customize the backg at active state:
        [vars.backgActiveFn]: [ // active background with gradient
            ecssProps.backgGrad,
            cssProps.backgActive,
        ],
    }},
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    // overwrite the backg & color props
    // we ignore the backg & color if the theme applied

    '--elm-color' : (colors as any)[`${theme}Cont`],
    '--elm-backg' : (colors as any)[`${theme}Thin`],


    // customize the backg & color at active state:
    '--ct-colorActive' : (colors as any)[`${theme}Text`],
    '--ct-backgActive' : themeColor,
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface Props
    extends
        Indicators.Props
{
    children?    : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, styles);

    const stateEnbDis    = useStateEnabledDisabled(props);
    const stateActPass   = useStateActivePassive(props);

    
    
    return (
        <div className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            {props.children}
        </div>
    );
}