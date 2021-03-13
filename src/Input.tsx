import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import * as ETxtControls   from './EditableTextControl';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateValidating, stateValid, stateNotValid, stateUnvalidating, stateNotUnvalid, stateValidUnvalid, stateNotValidUnvalid, stateNotValidatingUnvalidating,
    stateInvalidating, stateInvalid, stateNotInvalid, stateUninvalidating, stateNotUninvalid, stateInvalidUninvalid, stateNotInvalidUninvalid, stateNotInvalidatingUninvalidating,
    stateUncheck, stateNotUncheck,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useStateValidInvalid,
}                          from './EditableTextControl';
import * as stripOuts      from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateValidating, stateValid, stateNotValid, stateUnvalidating, stateNotUnvalid, stateValidUnvalid, stateNotValidUnvalid, stateNotValidatingUnvalidating,
    stateInvalidating, stateInvalid, stateNotInvalid, stateUninvalidating, stateNotUninvalid, stateInvalidUninvalid, stateNotInvalidUninvalid, stateNotInvalidatingUninvalidating,
    stateUncheck, stateNotUncheck,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useStateValidInvalid,
};



export interface CssProps {
    backgGrad : Css.Background
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';
const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = ETxtControls.vars;

const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    backgGrad : [['linear-gradient(180deg, rgba(0,0,0, 0.2), rgba(255,255,255, 0.2))', 'border-box']],
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



const inpElm  = '& >:first-child';

const states = {extend:[ ETxtControls.states, { // copy ETxtControl's states
    // specific states:
    extend:[
        stateNotUncheck({
            [inpElm]: {
                '&:valid': {
                },
            },
        }),
    ],
}]};

const styles = {
    basic: {
        extend: [
            ETxtControls.styles.basic,  // copy styles from ETxtControl
            filterValidProps(cssProps), // apply our filtered cssProps
        ],

        '--elm-backgGrad': cssProps.backgGrad,
        
        // appearance settings:
        display    : 'flex',
        alignItems : center,

        // typo settings:
        verticalAlign  : 'baseline',


        [inpElm]: {
            extend: [
                stripOuts.textbox,
            ],

            // appearance settings:
            display  : inherit,
            marginX  : [['calc(0px -', ecssProps.paddingX, ')']],
            marginY  : [['calc(0px -', ecssProps.paddingY, ')']],
            paddingX : ecssProps.paddingX,
            paddingY : ecssProps.paddingY,


            // strip out prop [size]:
            fallbacks: [
                {width: '-webkit-fill-available'},
                {width: '-moz-available'},
            ],
        },
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
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
        ETxtControls.Props,
        VariantInput
{
    defaultValue? : string | number | ReadonlyArray<string>
    type?         : Css.InputType
}
export default function Input(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const editCtrlStyles = ETxtControls.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, editCtrlStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variInput      =          useVariantInput(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateValInval  = useStateValidInvalid(props);

    

    return (
        <span className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
                variInput.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateLeave.class,
                stateFocusBlur.class ?? (stateFocusBlur.focus ? 'focus' : null),
                stateValInval.class,
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
                stateValInval.handleAnimationEnd(e);
            }}
        >
            <input
                disabled={stateEnbDis.disabled}

                onFocus={stateFocusBlur.handleFocus}
                onBlur={stateFocusBlur.handleBlur}
    
                type={props.type ?? 'text'}
                defaultValue={props.defaultValue}
            />

        </span>
    );
    // return (
    //     <input className={[
    //             styles.main,

    //             variSize.class,
    //             variTheme.class,
    //             variGradient.class,
    //             variInput.class,

    //             stateEnbDis.class,
    //             stateLeave.class,
    //             stateFocusBlur.class,
    //             stateValInval.class,
    //         ].join(' ')}

    //         disabled={stateEnbDis.disabled}

    //         type={props.type ?? 'text'}
    //         defaultValue={props.defaultValue}
        
    //         onMouseEnter={stateLeave.handleMouseEnter}
    //         onMouseLeave={stateLeave.handleMouseLeave}
    //         onFocus={stateFocusBlur.handleFocus}
    //         onBlur={stateFocusBlur.handleBlur}
    //         onAnimationEnd={(e) => {
    //             stateEnbDis.handleAnimationEnd(e);
    //             stateLeave.handleAnimationEnd(e);
    //             stateFocusBlur.handleAnimationEnd(e);
    //             stateValInval.handleAnimationEnd(e);
    //         }}
    //     />
    // );
}