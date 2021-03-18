import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
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
import colors              from './colors';
import * as Icons          from './Icon';

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
export type ValidatorHandler = EditControls.ValidatorHandler;



export interface CssProps {
    cursor       : Css.Cursor


    // anim props:
    backgValid   : Css.Background
    backgInvalid : Css.Background
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = {...EditControls.vars, ...Icons.vars,
    backgValInv       : '--etctrl-backgValInv',
};

const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    cursor       : 'text',


    // anim props:
    backgValid   : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='#000' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/></svg>")}")`,
    backgInvalid : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='#000' d='M7.3,6.31,5,4,7.28,1.71a.7.7,0,1,0-1-1L4,3,1.71.72a.7.7,0,1,0-1,1L3,4,.7,6.31a.7.7,0,0,0,1,1L4,5,6.31,7.3A.7.7,0,0,0,7.3,6.31Z'/></svg>")}")`,
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'etctrl'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const iconElm = '&::after';


export const themes = {extend:[ EditControls.themes, Contents.themes, ]}; // copy EditControl's + Content's themes
export const sizes  =           EditControls.sizes;                       // copy EditControl's sizes


export const themesIf = {
    // define default (secondary) colors:
    [vars.colorIf]              : colors.secondaryCont,
    [vars.backgIf]              : `linear-gradient(${colors.secondaryThin},${colors.secondaryThin})`,
    // [vars.colorOutlineIf]    : colors.secondary,       // still same as Control's
    // [vars.boxShadowFocusIf]  : colors.secondaryTransp, // still same as Control's

    // define active (primary) colors:
    [vars.colorIfAct]           : colors.primaryCont,
    [vars.backgIfAct]           : `linear-gradient(${colors.primaryThin},${colors.primaryThin})`,
    // [vars.colorOutlineIfAct] : colors.primary,         // still same as Control's
    // [vars.boxShadowFocusIf]  : colors.primaryTransp,   // still same as Control's



    // define valid (success) colors:
    [vars.colorIfVal]           : colors.successCont,
    [vars.backgIfVal]           : `linear-gradient(${colors.successThin},${colors.successThin})`,
    // [vars.colorOutlineIfVal]    : colors.success,       // still same as EditControl's
    // [vars.boxShadowFocusIfVal]  : colors.successTransp, // still same as EditControl's

    // define invalid (danger) colors:
    [vars.colorIfInv]           : colors.dangerCont,
    [vars.backgIfInv]           : `linear-gradient(${colors.dangerThin},${colors.dangerThin})`,
    // [vars.colorOutlineIfInv]    : colors.danger,        // still same as EditControl's
    // [vars.boxShadowFocusIfInv]  : colors.dangerTransp,  // still same as EditControl's
};
export const fnVars =           EditControls.fnVars;   // copy EditControl's fnVars
export const states = {extend:[ EditControls.states, { // copy EditControl's states
    // all initial states are none:

    [vars.backgValInv]  : getVar(vars.backgNo),

    // specific states:
    extend:[
        // supress activating by mouse/keyboard (:active)
        // but still responsive activating programatically (.active & .actived)
        stateActive({ // [activating, actived]
            '&:active:not(.active):not(.actived)': {
                [vars.filterActivePassive] : ecssProps.filterNone,
                [vars.animActivePassive]   : ecssProps.animNone,
            },
        }),



        stateValid({
            [vars.backgValInv] : cssProps.backgValid,
        }),
        stateInvalid({
            [vars.backgValInv] : cssProps.backgInvalid,
        }),



        themesIf,
        // fnVars, // no changes
    ],
}]};


export const basicStyle = {
    extend: [
        EditControls.basicStyle,    // copy basicStyle from EditControl
        filterValidProps(cssProps), // apply our filtered cssProps
    ],


    [iconElm]: {
        extend: [
            Icons.basicStyle,
            Icons.styles.img,
        ],

        content : '""',
        display : 'inline-block',

        height                 : '1em',     // follow parent text height
        width                  : '1.25em',  // make sure the icon's image ratio is 1.25 or less
        marginInlineStart      : '-1.25em', // cancel-out icon's width with negative margin, so it doen't take up space
        maskPosition           : 'right',   // align to right
        '-webkit-maskPosition' : 'right',   // align to right
        pointerEvents          : 'none',    // just an overlayed element, no mouse interaction


        [vars.img] : getVar(vars.backgValInv),
        backg      : getVar(vars.colorOutlineFn),
    },
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



export interface Props<TElement, TValue>
    extends
        EditControls.Props<TElement, TValue>
{
    // validations:
    minLength? : number
    maxLength? : number
    pattern?   : string
}
export default function EditableTextControl(props: Props<HTMLTextAreaElement, string>) {
    const elmStyles       = Elements.useStyles();
    const etctrlStyles    =          useStyles();

    // themes:
    const variTheme       = Elements.useVariantTheme(props, etctrlStyles);
    const variSize        = Elements.useVariantSize(props, elmStyles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);

    // states:
    const stateEnbDis     = useStateEnableDisable(props);
    const stateLeave      = useStateLeave(stateEnbDis);
    const stateFocusBlur  = useStateFocusBlur(props, stateEnbDis);
    const stateActPass    = useStateActivePassive(props, stateEnbDis);
    const nativeValidator = useNativeValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, nativeValidator.validator);

    

    return (
        <textarea className={[
                etctrlStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,

                // states:
                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
                stateValInval.class,
            ].join(' ')}

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
            // pattern={props.pattern}
            ref={nativeValidator.handleInit}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateFocusBlur.handleFocus}
            onBlur={stateFocusBlur.handleBlur}
            // onMouseDown={stateActPass.handleMouseDown}
            // onKeyDown={stateActPass.handleKeyDown}
            // onMouseUp={stateActPass.handleMouseUp}
            // onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
                stateValInval.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<typeof props>)?.children ?? 'Base Edit Text Control'}
        </textarea>
    );
}