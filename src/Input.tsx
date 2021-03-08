import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import * as ContControls   from './ContentControl';
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
}                          from './ContentControl';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



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
    backgGrad          : Css.Background
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = ContControls.vars;

// const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    backgGrad         : [['linear-gradient(180deg, rgba(0,0,0, 0.2), rgba(255,255,255, 0.2))', 'border-box']],
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'inp'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = ContControls.states;

const styles = {
    main: {
        extend: [
            ContControls.styles.main,   // copy styles from ContControl, including ContControl's cssProps & ContControl's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],

        '--elm-backgGrad': cssProps.backgGrad,
        
        // appearance settings:
        display        : 'block',
        fallbacks: [
            {width: '-webkit-fill-available'},
            {width: '-moz-available'}
        ],

        // typo settings:
        verticalAlign  : 'baseline',
    },
    inpOutline: Controls.styles.outline,
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export type InpStyle = 'outline';
export interface VariantInput {
    inpStyle?: InpStyle
}
export function useVariantInput(props: VariantInput, styles: Record<string, string>) {
    return {
        class: props.inpStyle ? (styles as any)[`inp${pascalCase(props.inpStyle)}`] : null,
    };
}

export interface Props
    extends
        ContControls.Props,
        VariantInput
{
    defaultValue?        : string
}
export default function Input(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const contCtrlStyles = ContControls.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, contCtrlStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variInput      =          useVariantInput(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);

    

    return (
        <input className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
                variInput.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
            ].join(' ')}

            disabled={stateEnbDis.disabled}

            type='text'
            defaultValue={props.defaultValue}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateFocusBlur.handleFocus}
            onBlur={stateFocusBlur.handleBlur}
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
            }}
        />
    );
}