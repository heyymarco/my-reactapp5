import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Indicator';
import spacers             from './spacers';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface CssProps {
    paddingX              : Css.PaddingXY
    paddingY              : Css.PaddingXY
    paddingXSm            : Css.PaddingXY
    paddingYSm            : Css.PaddingXY
    paddingXLg            : Css.PaddingXY
    paddingYLg            : Css.PaddingXY


    // anim props:

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
export const vars = Object.assign({}, Indicators.vars, {
    /**
     * themed foreground color at active state.
     */
    activeColorTh : '--ct-activeColorTh',

    /**
     * final foreground color at active state.
     */
    activeColorFn : '--ct-activeColorFn',

    /**
     * themed background color at active state.
     */
    activeBackgTh : '--ct-activeBackgTh',

    /**
     * final composite background(s) at active state.
     */
    activeBackgFn : '--ct-activeBackgFn',
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
        color: getVar(vars.activeColorFn),
        backg: getVar(vars.activeBackgFn),
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



    // customize final foreground color at active state:
    [vars.activeColorFn] : getVar(
        vars.activeColorTh, // first  priority
        vars.colorIfAct     // second priority
    ),

    // customize final composite background(s) at active state:
    [vars.activeBackgFn] : [
        getVar(
            vars.activeBackgTh, // first  priority
            vars.backgIfAct     // second priority
        ),
        ecssProps.backg,
    ],
}]};

const styles = {
    main: {
        extend: [
            Indicators.styles.main,     // copy styles from Indicator, including Indicator's cssProps & Indicator's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
    gradient: {
        extend: [
            // copy the themes from Element:
            Elements.styles.gradient,
        ],

        '&:not(._)': { // force to win conflict with main
            // customize the backg at active state:
            [vars.activeBackgFn] : [
                ecssProps.backgGrad,

                getVar(
                    vars.activeBackgTh, // first  priority
                    vars.backgIfAct     // second priority
                ),
                ecssProps.backg,
            ],
        },
    },
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
    '&:not(._)': { // force to win conflict with states
        // customize the backg & color

        // customize themed foreground color with softer color:
        [vars.colorTh]        : (colors as any)[`${theme}Cont`],

        // customize themed background color with softer color:
        [vars.backgTh]        : `linear-gradient(${(colors as any)[`${theme}Thin`]},${(colors as any)[`${theme}Thin`]})`,
        


        // customize themed foreground color at outlined state:
        [vars.outlineColorTh] : themeColor,
        

        
        // customize themed foreground color at active state:
        [vars.activeColorTh]  : (colors as any)[`${theme}Text`],
        
        // customize themed background color at active state:
        [vars.activeBackgTh]  : `linear-gradient(${themeColor},${themeColor})`,
    },
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

    const stateEnbDis    = useStateEnableDisable(props);
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