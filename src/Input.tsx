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
    stateValidationDisabled, stateValidationEnabled,
    applyStateNoAnimStartup, applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
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
    stateValidationDisabled, stateValidationEnabled,
    applyStateNoAnimStartup, applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
};
export type ValidatorHandler = ETxtControls.ValidatorHandler;



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

export const fnVars = ETxtControls.fnVars; // copy ETxtControl's fnVars
export const states = ETxtControls.states; // copy ETxtControl's states

export const basicStyle = {
    extend: [
        ETxtControls.basicStyle,    // copy basicStyle from ETxtControl
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
};
export const styles = {
    main: {
        extend: [
            basicStyle, // apply our basicStyle
            states,     // apply our states
        ],
    },
    inpOutline: Controls.styles.outline,
};

export const useStyles = createUseStyles(styles);



export type InpStyle = 'outline';
export interface VariantInput {
    inpStyle?: InpStyle
}
export function useVariantInput(props: VariantInput, styles: Record<string, string>) {
    return {
        class: props.inpStyle ? (styles as any)[`inp${pascalCase(props.inpStyle)}`] : null,
    };
}

export interface Props<TElement, TValue>
    extends
        ETxtControls.Props<TElement, TValue>,
        VariantInput
{
    // validations:
    min? : string | number;
    max? : string | number;

    // formats:
    type?         : Css.InputType
    placeholder?  : string
}
export default function Input(props: Props<HTMLInputElement, string>) {
    const elmStyles       = Elements.useStyles();
    const etctrlStyles    = ETxtControls.useStyles();
    const inpStyles       =          useStyles();

    const variSize        = Elements.useVariantSize(props, elmStyles);
    const variTheme       = Elements.useVariantTheme(props, etctrlStyles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);
    const variInput       =          useVariantInput(props, inpStyles);

    const stateEnbDis     = useStateEnableDisable(props);
    const stateLeave      = useStateLeave(stateEnbDis);
    const stateFocusBlur  = useStateFocusBlur(props, stateEnbDis);
    const nativeValidator = useNativeValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, nativeValidator.validator);

    

    return (
        <span className={[
                inpStyles.main,

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
                // accessibility:
                disabled={stateEnbDis.disabled}
                readOnly={props.readonly}

                // values:
                value={props.value}
                defaultValue={props.defaultValue}
                onChange={(e) => {
                    props.onChange?.(e);
                    nativeValidator.handleChange(e);
                }}
                
                // validations:
                required={props.required}
                minLength={props.minLength}
                maxLength={props.maxLength}
                pattern={props.pattern}
                min={props.min}
                max={props.max}
                ref={nativeValidator.handleInit}

                // formats:
                type={props.type ?? 'text'}
                placeholder={props.placeholder}

                onFocus={stateFocusBlur.handleFocus}
                onBlur={stateFocusBlur.handleBlur}
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