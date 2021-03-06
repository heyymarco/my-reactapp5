import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Indicator';
import spacers             from './spacers';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

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
export const vars = {...Indicators.vars,
    /**
     * themed foreground color at active state.
     */
    colorActiveTh : '--ct-colorActiveTh',

    /**
     * final foreground color at active state.
     */
    colorActiveFn : '--ct-colorActiveFn',

    /**
     * themed background color at active state.
     */
    backgActiveTh : '--ct-backgActiveTh',

    /**
     * final composite background(s) at active state.
     */
    backgActiveFn : '--ct-backgActiveFn',
};

// re-defined later, we need to construct varProps first
export const keyframesActive   = { from: undefined, to: undefined } as unknown as Css.Keyframes;
export const keyframesPassive  = { from: undefined, to: undefined } as unknown as Css.Keyframes;
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



export const themes = {}; // create themes from zero, not copy from Indicator's themes
defineThemes(themes, (theme, Theme, themeProp, themeColor) => ({
    // customize the backg & color

    // customize themed foreground color with softer color:
    [vars.colorTh]        : (colors as any)[`${theme}Cont`],

    // customize themed background color with softer color:
    [vars.backgTh]        : `linear-gradient(${(colors as any)[`${theme}Thin`]},${(colors as any)[`${theme}Thin`]})`,
    
    // customize themed foreground color at outlined state:
    [vars.colorOutlineTh] : themeColor,
    

    
    // customize themed foreground color at active state:
    [vars.colorActiveTh]  : (colors as any)[`${theme}Text`],
    
    // customize themed background color at active state:
    [vars.backgActiveTh]  : `linear-gradient(${themeColor},${themeColor})`,
}));

export const sizes = {extend:[ Indicators.sizes, ]}; // copy Indicator's sizes
const cssPropsAny = cssProps as any;
defineSizes(sizes, (size, Size, sizeProp) => ({
    // overwrite the props with the props{Size}:

    '--ct-paddingX' : cssPropsAny[`paddingX${Size}`],
    '--ct-paddingY' : cssPropsAny[`paddingY${Size}`],
}));


export const fnVars = {extend:[ Indicators.fnVars, { // copy Indicator's fnVars
    // customize final foreground color at active state:
    [vars.colorActiveFn] : getVar(
        vars.colorActiveTh, // first  priority
        vars.colorIfAct     // second priority
    ),

    // customize final composite background(s) at active state:
    [vars.backgActiveFn] : [
        getVar(
            vars.backgGradTg,
            vars.backgNo
        ),
        getVar(
            vars.backgActiveTh, // first  priority
            vars.backgIfAct     // second priority
        ),
        ecssProps.backg,
    ],
}]};
export const states = {extend:[ Indicators.states, { // copy Indicator's states
    extend:[
        // change the Indicator's behavior when in active state:
        stateActivePassive({
            [vars.filterActivePassive] : cssProps.filterActive, // override Indicator's filter active
        }),
        stateActive({
            [vars.animActivePassive]   : cssProps.animActive,   // override Indicator's anim active
        }),
        statePassivating({
            [vars.animActivePassive]   : cssProps.animPassive,  // override Indicator's anim passive
        }),



        fnVars,
    ],
}]};


export const basicStyle = {
    extend: [
        Indicators.basicStyle,      // copy basicStyle from Indicator
        filterValidProps(cssProps), // apply our filtered cssProps
    ],
};
export const styles = {
    main: {
        extend: [
            basicStyle, // apply our basicStyle

            // themes:
            themes,     // variant themes
            sizes,      // variant sizes
            
            // states:
            states,     // apply our states
        ],
    },
};
export const useStyles = createUseStyles(styles);



export interface Props
    extends
        Indicators.Props
{
    children?    : React.ReactNode
}
export default function ListGroup(props: Props) {
    const elmStyles      = Elements.useStyles();
    const ctStyles       =          useStyles();

    // themes:
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variSize       = Elements.useVariantSize(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    // states:
    const stateEnbDis    = useStateEnableDisable(props);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);

    
    
    return (
        <div className={[
                ctStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,

                // states:
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