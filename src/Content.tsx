import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Indicator';
import spacers             from './spacers';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
    paddingX              : Css.PaddingXY
    paddingY              : Css.PaddingXY
    paddingXSm            : Css.PaddingXY
    paddingYSm            : Css.PaddingXY
    paddingXLg            : Css.PaddingXY
    paddingYLg            : Css.PaddingXY


    // anim props:

    colorActive           : Css.Color
    backgActive           : Css.Background
    filterActive          : Css.Filter

    '@keyframes active'   : Css.Keyframes
    '@keyframes passive'  : Css.Keyframes
    animActive            : Css.Animation
    animPassive           : Css.Animation
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
    paddingX              : spacers.default as string,
    paddingY              : spacers.default as string,
    paddingXSm            : spacers.sm      as string,
    paddingYSm            : spacers.sm      as string,
    paddingXLg            : spacers.lg      as string,
    paddingYLg            : spacers.lg      as string,


    // anim props:

    colorActive           : ecssProps.color,
    backgActive           : (colors.foregThin as string),
    filterActive          : ecssProps.filterNone,

    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive]],
};



Object.assign(keyframesActive, {
    from: {extend:[ Indicators.keyframesActive.from, { // copy Indicator's keyframes
        color: getVar(vars.colorFn),
        backg: getVar(vars.backgFn),
    }]},
    to: {extend:[ Indicators.keyframesActive.to, { // copy Indicator's keyframes
        color: getVar(vars.colorActiveFn),
        backg: getVar(vars.backgActiveFn),
    }]}
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



const states = {extend:[ Indicators.states, { // copy Indicator's states
    extend:[
        // change the Indicator's behavior when in active state:
        stateActivePassive({
            [vars.filterActivePassive] : cssProps.filterActive, // override Indicator's filter active
        }),
        stateActive({
            [vars.animActivePassive]   : cssProps.animActive,   // override Indicator's anim active
        }),
        statePassive({
            [vars.animActivePassive]   : cssProps.animPassive,  // override Indicator's anim passive
        }),
    ],



    // customize the foreground at active state:
    [vars.colorActiveFn]: cssProps.colorActive,

    // customize the background(s) at active state:
    [vars.backgActiveFn]: cssProps.backgActive,
}]};

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

const cssPropsAny = cssProps as any;
defineSizes(styles, (size, Size, sizeProp) => ({
    extend: [
        // copy the size specific props from Element:
        (Elements.styles as any)[sizeProp],
    ],


    // overwrite the props with the props{Size}:

    '--ct-paddingX' : cssPropsAny[`paddingX${Size}`],
    '--ct-paddingY' : cssPropsAny[`paddingY${Size}`],
}));

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

    const variSize       = Elements.useVariantSize(props, styles);
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
        
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            {props.children}
        </div>
    );
}