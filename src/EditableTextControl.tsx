import type * as Css       from './Css';

import React               from 'react';

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

    defineSizes, defineThemes,

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

    defineSizes, defineThemes,

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



export const applyStateDefault = () => ({
    [vars.colorIf]             : colors.secondaryCont,
    [vars.backgIf]             : `linear-gradient(${colors.secondaryThin},${colors.secondaryThin})`,
    // [vars.colorOutlineIf]   : colors.secondary,       // still same as Control's
    // [vars.boxShadowFocusIf] : colors.secondaryTransp, // still same as Control's
});



const iconElm = '&::after';

const fnVars = EditControls.fnVars;
const states = {extend:[ EditControls.states, { // copy EditControl's states
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



        applyStateDefault(),



        fnVars,
    ],
}]};

const styles = {
    basic: {
        extend: [
            EditControls.styles.basic,  // copy styles from EditControl
            filterValidProps(cssProps), // apply our filtered cssProps
        ],


        [iconElm]: {
            extend: [
                Icons.styles.basic,
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
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Control:
        (Controls.styles as any)[themeProp],

        // then overwrite the themes from Content:
        (Contents.styles as any)[themeProp],
    ],
}));

const useStyles = createUseStyles(styles);
export { fnVars, states, styles, useStyles };



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
    const styles          =          useStyles();
    const elmStyles       = Elements.useStyles();

    const variSize        = Elements.useVariantSize(props, elmStyles);
    const variTheme       = Elements.useVariantTheme(props, styles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis     = useStateEnableDisable(props);
    const stateLeave      = useStateLeave(stateEnbDis);
    const stateFocusBlur  = useStateFocusBlur(props, stateEnbDis);
    const nativeValidator = useNativeValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, nativeValidator.validator);

    

    return (
        <textarea className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
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
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
                stateValInval.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<typeof props>)?.children ?? 'Base Edit Text Control'}
        </textarea>
    );
}