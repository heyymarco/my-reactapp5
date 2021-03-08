import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
};



export interface CssProps {
    cursor             : Css.Cursor

    backg              : Css.Background
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Controls.vars;

const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    cursor            : 'text',

    backg             : colors.backg as string,
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'cctrl'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = {extend:[ Controls.states, { // copy Control's states
    // supress activating by mouse/keyboard (:active)
    // but still responsive activating programatically (.active & .actived)
    '&:active:not(.active):not(.actived)': {
        [vars.filterActivePassive] : ecssProps.filterNone,
        [vars.animActivePassive]   : ecssProps.animNone,
    },



    // overwrite from Control (replace with softer inactive (secondary) color):

    // customize conditional unthemed foreground color:
    [vars.colorIf]    : colors.secondaryCont,

    // customize conditional unthemed background color:
    [vars.backgIf] : `linear-gradient(${colors.secondaryThin},${colors.secondaryThin})`,



    // overwrite from Control (replace with softer active (primary) color):

    // customize active unthemed foreground color:
    [vars.colorIfAct] : colors.primaryCont,

    // customize active unthemed background color:
    [vars.backgIfAct] : `linear-gradient(${colors.primaryThin},${colors.primaryThin})`,
}]};

const styles = {
    main: {
        extend: [
            Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Control:
        (Controls.styles as any)[themeProp],
    ],


    '&:not(._)': { // force to win conflict with states
        // customize the backg & color

        // customize final foreground color with softer color:
        [vars.colorTh]       : (colors as any)[`${theme}Cont`],

        // customize themed background color with softer color:
        [vars.backgTh]       : `linear-gradient(${(colors as any)[`${theme}Thin`]},${(colors as any)[`${theme}Thin`]})`,
    },
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface Props
    extends
        Controls.Props
{
}
export default function ContentControl(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);

    

    return (
        <textarea className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
            ].join(' ')}

            disabled={stateEnbDis.disabled}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateFocusBlur.handleFocus}
            onBlur={stateFocusBlur.handleBlur}
            onMouseDown={stateActPass.handleMouseDown}
            onKeyDown={stateActPass.handleKeyDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Content Control'}
        </textarea>
    );
}