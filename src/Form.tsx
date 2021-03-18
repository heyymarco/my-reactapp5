import type * as Css       from './Css';

import
    React, {
    useState,
    useRef,
    useEffect,
    useContext
}                          from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
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

    defineThemes, defineSizes,

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

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
};



export interface CssProps {
}
const initial = 'initial';
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



export const themes = Contents.themes; // copy Content's themes
export const sizes  = Contents.sizes;  // copy Content's sizes


export const themesIf = {extend:[ ETxtControls.themesIf, { // copy ETxtControl's fnVars
    // define default (secondary) colors:
    [vars.colorIf]              : undefined, // delete
    [vars.backgIf]              : undefined, // delete

    // define active (primary) colors:
    [vars.colorIfAct]           : undefined, // delete
    [vars.backgIfAct]           : undefined, // delete
}]};
export const fnVars = {extend:[ Elements.fnVars, EditControls.validationFnVars, { // copy Element's fnVars + EditControl's validationFnVars
}]};
export const states = {extend:[ Elements.states, EditControls.validationStates, { // copy Element's states + EditControl's validationStates
    // specific states:
    extend:[
        themesIf,
        fnVars,
    ],



    // undo inherited states to children:
    '& >*': {
        [vars.colorTh]            : initial,
        [vars.backgTh]            : initial,
        [vars.colorOutlineTh]     : initial,

        [vars.colorIfIf]          : initial,
        [vars.backgIfIf]          : initial,
        [vars.colorOutlineIfIf]   : initial,
        [vars.boxShadowFocusIfIf] : initial,

        // [vars.colorIf]            : initial,
        // [vars.backgIf]            : initial,
        // [vars.colorOutlineIf]     : initial,
        // [vars.boxShadowFocusIf]   : initial,
    },
}]};


export const basicStyle = {
    extend: [
        Elements.basicStyle,        // copy basicStyle from Element
        filterValidProps(cssProps), // apply our filtered cssProps
    ],
};
export const styles = {
    main: {
        extend: [
            basicStyle, // apply basic styles

            // themes:
            themes,     // variant themes
            sizes,      // variant sizes
            
            // states:
            states,     // apply our states
        ],
    },
};
export const useStyles = createUseStyles(styles);



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
    const elmStyles       = Elements.useStyles();
    const formStyles      =          useStyles();

    // themes:
    const variTheme       = Elements.useVariantTheme(props, formStyles);
    const variSize        = Elements.useVariantSize(props, formStyles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);

    // states:
    const formValidator   = useFormValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, formValidator.validator);

    

    return (
        <form className={[
                formStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,

                // states:
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