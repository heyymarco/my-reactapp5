import type * as Css       from './Css';

import
    React, {
    useState,
    useRef,
    useEffect,
    useContext
}                          from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import * as EditControls   from './EditableControl';
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
}                          from './EditableControl';
import * as ETxtControls   from './EditableTextControl';
import colors              from './colors';
import * as validations    from './validations';
import type * as Val       from './validations';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



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



export interface CssProps {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = {...Controls.vars,
    /**
     * valid-state foreground color.
     */
    colorIfVal          : '--ectrl-colorIfVal',

    /**
     * valid-state background color.
     */
    backgIfVal          : '--ectrl-backgIfVal',

    /**
     * valid-state foreground color at outlined state.
     */
    colorOutlineIfVal   : '--ectrl-colorOutlineIfVal',

    /**
     * valid-state box-shadow at focused state.
     */
    boxShadowFocusIfVal : '--ectrl-boxShadowFocusIfVal',
 
 
    /**
     * invalid-state foreground color.
     */
    colorIfInv          : '--ectrl-colorIfInv',

    /**
     * invalid-state background color.
     */
    backgIfInv          : '--ectrl-backgIfInv',

    /**
     * invalid-state foreground color at outlined state.
     */
    colorOutlineIfInv   : '--ectrl-colorOutlineIfInv',

    /**
     * invalid-state box-shadow at focused state.
     */
    boxShadowFocusIfInv : '--ectrl-boxShadowFocusIfInv',



    // anim props:

    animValUnval        : '--ectrl-animValUnval',
    animInvUninv        : '--ectrl-animInvUninv',
};

const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'form'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const themesIf = {extend:[ ETxtControls.themesIf, { // copy ETxtControl's fnVars
    // define default (secondary) colors:
    [vars.colorIf]              : undefined, // delete
    [vars.backgIf]              : undefined, // delete

    // define active (primary) colors:
    [vars.colorIfAct]           : undefined, // delete
    [vars.backgIfAct]           : undefined, // delete
}]};
const fnVars = {extend:[ Elements.fnVars, EditControls.validationFnVars, { // copy Element's fnVars + EditControl's validationFnVars
}]};
const states = {extend:[ Elements.states, EditControls.validationStates, { // copy Element's states + EditControl's validationStates
    // specific states:
    extend:[
        themesIf,
        fnVars,
    ],



    // undo inherited states to children:
    '& >*': {
        [vars.colorIfIf]          : 'initial',
        [vars.backgIfIf]          : 'initial',
        [vars.colorOutlineIfIf]   : 'initial',
        [vars.boxShadowFocusIfIf] : 'initial',
    },
}]};

const styles = {
    basic: {
        extend: [
            Elements.styles.basic,      // copy styles from Element
            filterValidProps(cssProps), // apply our filtered cssProps
        ],
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
};

const useStyles = createUseStyles(styles);
export { fnVars, states, styles, useStyles };


export type ValidatorHandler = () => Val.Result;
export type CustomValidatorHandler = (isValid: Val.Result) => Val.Result;
export function useFormValidator(customValidator?: CustomValidatorHandler) {
    let [isValid, setIsValid] = useState<Val.Result>(null);


    const handleVals = (target: HTMLFormElement) => {
        const isFormValid = target.matches(':valid');
        isValid = (customValidator ? customValidator(isFormValid) : isFormValid);
        setIsValid(isValid);
    }
    const handleInit = (target: HTMLFormElement | null) => {
        if (target) handleVals(target);
    }
    const handleChange = ({currentTarget}: React.FormEvent<HTMLFormElement>) => {
        handleVals(currentTarget);
    }
    return {
        /**
         * 
         * @returns true = valid, false = invalid, undefined = UI is still loading, validator is not ready to validate
         */
        validator    : ((): Val.Result => isValid) as ValidatorHandler,

        handleInit   : handleInit,
        handleChange : handleChange,
    };
}

export interface Props<TElement, TValue>
    extends
        Controls.Props,
        Val.Validation
{
    // accessibility:
    readonly?        : boolean

    // values:
    value?           : TValue
    defaultValue?    : TValue
    onChange?        : React.ChangeEventHandler<TElement>
    
    // validations:
    customValidator? : CustomValidatorHandler
    // required?        : boolean

    // children:
    children?    : React.ReactNode
}
export default function EditableControl(props: Props<HTMLTextAreaElement, string>) {
    const styles          =          useStyles();
    const elmStyles       = Elements.useStyles();

    const variSize        = Elements.useVariantSize(props, elmStyles);
    const variTheme       = Elements.useVariantTheme(props, elmStyles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);

    const formValidator   = useFormValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, formValidator.validator);

    

    return (
        <form className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                // stateEnbDis.class,
                // stateLeave.class,
                // stateFocusBlur.class,
                // stateActPass.class,
                stateValInval.class,
            ].join(' ')}

            // accessibility:
            // disabled={stateEnbDis.disabled}
            // readOnly={props.readonly}

            // values:
            // value={props.value}
            // defaultValue={props.defaultValue}
            onChange={(e) => {
                // props.onChange?.(e);
                formValidator.handleChange(e);
            }}

            // validations:
            // required={props.required}
            ref={formValidator.handleInit}
        
            // onMouseEnter={stateLeave.handleMouseEnter}
            // onMouseLeave={stateLeave.handleMouseLeave}
            // onFocus={stateFocusBlur.handleFocus}
            // onBlur={stateFocusBlur.handleBlur}
            // onMouseDown={stateActPass.handleMouseDown}
            // onKeyDown={stateActPass.handleKeyDown}
            // onMouseUp={stateActPass.handleMouseUp}
            // onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={(e) => {
                // stateEnbDis.handleAnimationEnd(e);
                // stateLeave.handleAnimationEnd(e);
                // stateFocusBlur.handleAnimationEnd(e);
                // stateActPass.handleAnimationEnd(e);
                stateValInval.handleAnimationEnd(e);
            }}
        >
            {props.children}
        </form>
    );
}