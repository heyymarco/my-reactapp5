import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
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
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
};



export interface CssProps {
    // anim props:

    '@keyframes valid'     : Css.Keyframes
    '@keyframes unvalid'   : Css.Keyframes
    '@keyframes invalid'   : Css.Keyframes
    '@keyframes uninvalid' : Css.Keyframes
    animValid              : Css.Animation
    animUnvalid            : Css.Animation
    animInvalid            : Css.Animation
    animUninvalid          : Css.Animation
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Object.assign({}, Controls.vars, Icons.vars, {
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
});

// re-defined later, we need to construct varProps first
export const keyframesValid     = { from: undefined, to: undefined };
export const keyframesUnvalid   = { from: undefined, to: undefined };
export const keyframesInvalid   = { from: undefined, to: undefined };
export const keyframesUninvalid = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // anim props:
    
    '@keyframes valid'     : keyframesValid,
    '@keyframes unvalid'   : keyframesUnvalid,
    '@keyframes invalid'   : keyframesInvalid,
    '@keyframes uninvalid' : keyframesUninvalid,
    animValid              : [['500ms',  'ease-out', 'both', keyframesValid    ]],
    animUnvalid            : [['100ms',  'ease-out', 'both', keyframesUnvalid  ]],
    animInvalid            : [['1000ms', 'ease-out', 'both', keyframesInvalid  ]],
    animUninvalid          : [['100ms',  'ease-out', 'both', keyframesUninvalid]],
};



Object.assign(keyframesValid, {
    from: {
        backg: colors.success,
    },
    to: {
        backg: getVar(vars.backgFn),
        //TODO: backg: getVar(vars.backgOutlineFn),
    }
});
Object.assign(keyframesUnvalid, {
    from: {
    },
    to: {
        '--noop': 'unval',
    }
});

Object.assign(keyframesInvalid, {
    from: {
        backg: colors.danger,
    },
    to: {
        backg: getVar(vars.backgFn),
        //TODO: backg: getVar(vars.backgOutlineFn),
    }
});
Object.assign(keyframesUninvalid, {
    from: {
    },
    to: {
        '--noop': 'uninval',
    }
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ectrl'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const stateValidating                = (content: object) => ({
    '&.val': {
        extend: [content]
    }
});
export const stateValid                     = (content: object) => ({
    '&.val,&.vald': {
        extend: [content]
    }
});
export const stateNotValid                  = (content: object) => ({
    '&:not(.val):not(.vald)': {
        extend: [content]
    }
});
export const stateUnvalidating              = (content: object) => ({
    '&.unval': {
        extend: [content]
    }
});
export const stateNotUnvalid                = (content: object) => ({
    '&:not(.unval)': {
        extend: [content]
    }
});
export const stateValidUnvalid              = (content: object) => ({
    '&.val,&.vald,&.unval': {
        extend: [content]
    }
});
export const stateNotValidUnvalid           = (content: object) => ({
    '&:not(.val):not(.vald):not(.unval)': {
        extend: [content]
    }
});
export const stateNotValidatingUnvalidating = (content: object) => ({
    '&:not(.val):not(.unval)': {
        extend: [content]
    }
});

export const stateInvalidating                  = (content: object) => ({
    '&.inv': {
        extend: [content]
    }
});
export const stateInvalid                       = (content: object) => ({
    '&.inv,&.invd': {
        extend: [content]
    }
});
export const stateNotInvalid                    = (content: object) => ({
    '&:not(.inv):not(.invd)': {
        extend: [content]
    }
});
export const stateUninvalidating                = (content: object) => ({
    '&.uninv': {
        extend: [content]
    }
});
export const stateNotUninvalid                  = (content: object) => ({
    '&:not(.uninv)': {
        extend: [content]
    }
});
export const stateInvalidUninvalid              = (content: object) => ({
    '&.inv,&.invd,&.uninv': {
        extend: [content]
    }
});
export const stateNotInvalidUninvalid           = (content: object) => ({
    '&:not(.inv):not(.invd):not(.uninv)': {
        extend: [content]
    }
});
export const stateNotInvalidatingUninvalidating = (content: object) => ({
    '&:not(.inv):not(.uninv)': {
        extend: [content]
    }
});

export const stateUncheck    = (content: object) => ({
    '&.uncheck'       : stateNotValid(stateNotInvalid(content)),
});
export const stateNotUncheck = (content: object) => ({
    '&:not(.uncheck)' : stateNotValid(stateNotInvalid(content)),
});

export const applyStateValid = () => ({
    // apply valid (success) colors:
    [vars.colorIfIf]          : getVar(vars.colorIfVal),
    [vars.backgIfIf]          : getVar(vars.backgIfVal),
    [vars.colorOutlineIfIf]   : getVar(vars.colorOutlineIfVal),
    [vars.boxShadowFocusIfIf] : getVar(vars.boxShadowFocusIfVal),
});
export const applyStateInvalid = () => ({
    // apply invalid (danger) colors:
    [vars.colorIfIf]          : getVar(vars.colorIfInv),
    [vars.backgIfIf]          : getVar(vars.backgIfInv),
    [vars.colorOutlineIfIf]   : getVar(vars.colorOutlineIfInv),
    [vars.boxShadowFocusIfIf] : getVar(vars.boxShadowFocusIfInv),
});



const fnVars = {extend:[ Controls.fnVars, { // copy Control's fnVars
    // customize the anim:
    [vars.animFn]: [
        ecssProps.anim,
        getVar(vars.animValUnval),
        getVar(vars.animInvUninv),
        getVar(vars.animEnableDisable), // 1st : ctrl must be enable
        getVar(vars.animHoverLeave),    // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),     // 3rd : ctrl got focused (can interrupt hover/leave)
        getVar(vars.animActivePassive), // 4th : ctrl got pressed (can interrupt focus/blur)
    ],

    '&.active,&.actived': { // if activated programmatically (not by user input)
        // customize the anim:
        [vars.animFn]: [
            ecssProps.anim,
            getVar(vars.animValUnval),
            getVar(vars.animInvUninv),
            getVar(vars.animActivePassive), // 1st : ctrl already pressed, move to the least priority
            getVar(vars.animHoverLeave),    // 2nd : cursor leaved
            getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus (can interrupt hover/leave)
            getVar(vars.animEnableDisable), // 4th : ctrl enable/disable (can interrupt focus/blur)
        ],

        '&.disabled,&:disabled:not(.disable)': { // if ctrl was disabled programatically
            // customize the anim:
            [vars.animFn]: [
                ecssProps.anim,
                getVar(vars.animValUnval),
                getVar(vars.animInvUninv),
                getVar(vars.animEnableDisable), // 1st : ctrl already disabled, move to the least priority
                getVar(vars.animHoverLeave),    // 2nd : cursor leaved, should not happened, move to low priority
                getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus, might happened programaticaly, move to low priority (can interrupt hover/leave)
                getVar(vars.animActivePassive), // 4th : ctrl deactivated programatically, move to moderate priority (can interrupt focus/blur)
            ],
        },
    },
}]};
const states = {extend:[ Controls.states, { // copy Control's states
    // define valid (success) colors:
    [vars.colorIfVal]           : colors.successText,
    [vars.backgIfVal]           : `linear-gradient(${colors.success},${colors.success})`,
    [vars.colorOutlineIfVal]    : colors.success,
    [vars.boxShadowFocusIfVal]  : colors.successTransp,

    // define invalid (danger) colors:
    [vars.colorIfInv]           : colors.dangerText,
    [vars.backgIfInv]           : `linear-gradient(${colors.danger},${colors.danger})`,
    [vars.colorOutlineIfInv]    : colors.danger,
    [vars.boxShadowFocusIfInv]  : colors.dangerTransp,



    // all initial states are none:

    [vars.animValUnval] : ecssProps.animNone,
    [vars.animInvUninv] : ecssProps.animNone,

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



        stateValidating({
            [vars.animValUnval]       : cssProps.animValid,
        }),
        stateValid(applyStateValid()),
        stateUnvalidating({
            [vars.animValUnval]       : cssProps.animUnvalid,
        }),

        stateInvalidating({
            [vars.animInvUninv]       : cssProps.animInvalid,
        }),
        stateInvalid(applyStateInvalid()),
        stateUninvalidating({
            [vars.animInvUninv]       : cssProps.animUninvalid,
        }),



        fnVars,
    ],
}]};

const styles = {
    basic: {
        extend: [
            Controls.styles.basic,      // copy styles from Control
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



type EditableControlElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;
export function useNativeValidator() {
    const [valid, setValid] = useState<boolean|undefined>(undefined);


    const handleInit = (target: EditableControlElement | null) => {
        if (target) {
            const valid = target.validity.valid;
            setValid(valid);
        } // if
    }
    const handleChange = ({target}: React.ChangeEvent<EditableControlElement>) => {
        setValid(target.validity.valid);
    }
    return {
        /**
         * 
         * @returns true = valid, false = invalid, undefined = UI is still loading, validator is not ready to validate
         */
        validator    : () => valid,
        handleInit   : handleInit,
        handleChange : handleChange,
    };
}
export type ValidatorHandler = () => (boolean|null|undefined);
export function useStateValidInvalid<TElement, TValue>(props: Props<TElement, TValue>, validator?: ValidatorHandler) {
    const defaultValided: (boolean|null)  = null; // if [isValid] was not specified => the default value is isValid=null (unverified)
    const getIsValid = () => (props.isValid!==undefined) ? props.isValid : (validator ? validator() : defaultValided);
    const [valided,      setValided     ] = useState(getIsValid());
    const [succeeding,   setSucceeding  ] = useState(false);
    const [unsucceeding, setUnsucceeding] = useState(false);
    const [erroring,     setErroring    ] = useState(false);
    const [unerroring,   setUnerroring  ] = useState(false);

    
    const newValid = getIsValid();
    useEffect(() => {
        if (valided !== newValid) {
            setValided(newValid);

            if ((valided === undefined) || (newValid === undefined)) {
                // UI is still loading, validator is not ready to validate
            }
            else if (newValid === null) { // neither success nor error
                if (valided === true) { // if was success
                    // fade out success mark:
                    setSucceeding(false);
                    setUnsucceeding(true);
                } // if

                if (valided === false) { // if was error
                    // fade out error mark:
                    setErroring(false);
                    setUnerroring(true);
                } // if
            }
            else if (newValid) { // success
                if (valided === false) { // if was error
                    // fade out error mark:
                    setErroring(false);
                    setUnerroring(true);
                } // if

                // fade in success mark:
                setUnsucceeding(false);
                setSucceeding(true);
            }
            else { // error
                if (valided === true) { // if was success
                    // fade out success mark:
                    setSucceeding(false);
                    setUnsucceeding(true);
                } // if

                // fade in error mark:
                setUnerroring(false);
                setErroring(true);
            } // if
        }
    }, [valided, newValid]);

    
    const handleIdleSucc = () => {
        // clean up expired animations

        if (succeeding)   setSucceeding(false);
        if (unsucceeding) setUnsucceeding(false);
    }
    const handleIdleErr = () => {
        // clean up expired animations

        if (erroring)     setErroring(false);
        if (unerroring)   setUnerroring(false);
    }
    return {
        /**
         * being/was valid or being/was invalid
        */
        valid: valided,
        class: [
            (succeeding ? 'val' : (unsucceeding ? 'unval' : ((valided===true)  ? 'vald'                                           : null))),
            (erroring   ? 'inv' : (unerroring   ? 'uninv' : ((valided===false) ? 'invd'                                           : null))),
                                                            ((valided===null)  ? ((props.isValid===undefined) ? null : 'uncheck') : null),
        ].join(' '),
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling

            if (/((?<![a-z])(valid|unvalid)|(?<=[a-z])(Valid|Unvalid))(?![a-z])/.test(e.animationName)) {
                handleIdleSucc();
            }
            else if (/((?<![a-z])(invalid|uninvalid)|(?<=[a-z])(Invalid|Uninvalid))(?![a-z])/.test(e.animationName)) {
                handleIdleErr();
            }
        },
    };
}

export interface Props<TElement, TValue>
    extends
        Controls.Props
{
    required?     : boolean
    readonly?     : boolean
    value?        : TValue
    defaultValue? : TValue
    isValid?      : boolean | null
    onChange?     : React.ChangeEventHandler<TElement>
}
export default function EditableControl(props: Props<HTMLTextAreaElement, string>) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     = Controls.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);
    const stateValInval  = useStateValidInvalid(props);

    

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
                stateValInval.class,
            ].join(' ')}

            disabled={stateEnbDis.disabled}
            required={props.required}
            readOnly={props.readonly}
            value={props.value}
            defaultValue={props.defaultValue}
        
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
                stateValInval.handleAnimationEnd(e);
            }}
            onChange={props.onChange}
        >
            {(props as React.PropsWithChildren<typeof props>)?.children ?? 'Base Edit Control'}
        </textarea>
    );
}