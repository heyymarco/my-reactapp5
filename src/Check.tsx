import type * as Css       from './Css';

import
    React, {
    useState
}                          from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
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
    applyStateNoAnimStartup as base_applyStateNoAnimStartup,
    applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
}                          from './EditableControl';
import * as Buttons        from './Button';
import * as Icons          from './Icon';
import colors              from './colors';

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
    // applyStateNoAnimStartup,
    applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
};



export interface CssProps {
    img                      : Css.Image
    spacing                  : Css.Gap
    
    switchImg                : Css.Image
    switchBorderRadius       : Css.BorderRadius

    
    // anim props:

    filterCheck              : Css.Filter
    filterClear              : Css.Filter

    switchFilterCheck        : Css.Filter
    switchFilterClear        : Css.Filter
    switchTransfCheck        : Css.Transform
    switchTransfClear        : Css.Transform

    '@keyframes check'       : Css.Keyframes
    '@keyframes clear'       : Css.Keyframes
    '@keyframes switchCheck' : Css.Keyframes
    '@keyframes switchClear' : Css.Keyframes
    animCheck                : Css.Animation
    animClear                : Css.Animation
    switchAnimCheck          : Css.Animation
    switchAnimClear          : Css.Animation
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';

// internal css vars:
export const vars = {...EditControls.vars, ...Icons.vars,
    /**
     * final composite animation(s) at the "icon" element.
     */
    animIconFn          : '--chk-animIconFn',



    /**
     * themed foreground color for the label.
     */
    colorLabelTh        : '--chk-colorLabelTh',

    /**
     * conditional foreground color for the label.
     */
    colorLabelIfIf      : '--chk-colorLabelIfIf',

    /**
     * conditional unthemed foreground color for the label.
     */
    colorLabelIf        : '--chk-colorLabelIf',

    /**
     * active unthemed foreground color for the label.
     */
    colorLabelIfAct     : '--chk-colorLabelIfAct',

    /**
     * final foreground color for the label.
     */
    colorLabelFn        : '--chk-colorLabelFn',



    /**
     * valid-state foreground color for the label.
     */
    colorLabelIfVal     : '--chk-colorLabelIfVal',

    /**
     * invalid-state foreground color for the label.
     */
    colorLabelIfInv     : '--chk-colorLabelIfInv',



    // anim props:

    switchTransfIn      : '--chk-switchTransfIn',
    switchTransfOut     : '--chk-switchTransfOut',

    filterCheckClearIn  : '--chk-filterCheckClearIn',
    filterCheckClearOut : '--chk-filterCheckClearOut',
    animCheckClear      : '--chk-animCheckClear',
};

// re-defined later, we need to construct varProps first
export const keyframesCheck       = { from: undefined, to: undefined } as unknown as Css.Keyframes;
export const keyframesClear       = { from: undefined, to: undefined } as unknown as Css.Keyframes;
export const keyframesSwitchCheck = { from: undefined, to: undefined } as unknown as Css.Keyframes;
export const keyframesSwitchClear = { from: undefined, to: undefined } as unknown as Css.Keyframes;
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
const ccssProps = Controls.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // forked from Bootstrap 5:
    img                      : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3 6-6'/></svg>")}")`,
    spacing                  : '0.3em',
    
    // forked from Bootstrap 5:
    switchImg                : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#000'/></svg>")}")`,
    switchBorderRadius       : '0.5em',
    
    
    
    // anim props:

    filterCheck              : [['opacity(100%)']],
    filterClear              : [['opacity(0%)'  ]],

    switchFilterCheck        : [['opacity(100%)']],
    switchFilterClear        : [['opacity(50%)' ]],
    switchTransfCheck        : [['translateX(0.5em)' ]],
    switchTransfClear        : [['translateX(-0.5em)']],

    '@keyframes check'       : keyframesCheck,
    '@keyframes clear'       : keyframesClear,
    '@keyframes switchCheck' : keyframesSwitchCheck,
    '@keyframes switchClear' : keyframesSwitchClear,
    animCheck                : [['150ms', 'ease-out', 'both', keyframesCheck]],
    animClear                : [['150ms', 'ease-out', 'both', keyframesClear]],
    switchAnimCheck          : [['200ms', 'ease-out', 'both', keyframesSwitchCheck]],
    switchAnimClear          : [['200ms', 'ease-out', 'both', keyframesSwitchClear]],
};



Object.assign(keyframesCheck, {
    from: {
        filter: [[
            getVar(vars.filterCheckClearOut),
        ]],
    },
    to: {
        filter: [[
            getVar(vars.filterCheckClearIn),
        ]],
    }
});
Object.assign(keyframesClear, {
    from : keyframesCheck.to,
    to   : keyframesCheck.from
});

Object.assign(keyframesSwitchCheck, {
    from: {
        filter: [[
            getVar(vars.filterCheckClearOut),
        ]],
        transform: [[
            getVar(vars.switchTransfOut),
        ]],
    },
    '75%': {
        transformOrigin: 'left',
        transform: [[
            'scaleX(1.1)',
            getVar(vars.switchTransfIn),
        ]],
    },
    to: {
        filter: [[
            getVar(vars.filterCheckClearIn),
        ]],
        transform: [[
            getVar(vars.switchTransfIn),
        ]],
    },
});
Object.assign(keyframesSwitchClear, keyframesSwitchCheck, {
    from: {
        filter: [[
            getVar(vars.filterCheckClearIn),
        ]],
        transform: [[
            getVar(vars.switchTransfIn),
        ]],
    },
    '75%': {
        transformOrigin: 'right',
        transform: [[
            'scaleX(1.1)',
            getVar(vars.switchTransfOut),
        ]],
    },
    to: {
        filter: [[
            getVar(vars.filterCheckClearOut),
        ]],
        transform: [[
            getVar(vars.switchTransfOut),
        ]],
    },
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'chk'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const stateChecking           = (content: object) => ({
    '&.check': {
        extend: [content]
    }
});
export const stateCheck               = (content: object) => ({
    '&.check,&.checked,&:checked': {
        extend: [content]
    }
});
export const stateNotCheck            = (content: object) => ({
    '&:not(.check):not(.checked):not(:checked)': {
        extend: [content]
    }
});
export const stateClearing           = (content: object) => ({
    '&.clear': {
        extend: [content]
    }
});
export const stateNotClear            = (content: object) => ({
    '&:not(.clear)': {
        extend: [content]
    }
});
export const stateCheckClear          = (content: object) => ({
    '&.check,&.checked,&:checked,&.clear': {
        extend: [content]
    }
});
export const stateNotCheckClear       = (content: object) => ({
    '&:not(.check):not(.checked):not(:checked):not(.clear)': {
        extend: [content]
    }
});
export const stateNotCheckingClearing = (content: object) => ({
    '&:not(.check):not(.clear)': {
        extend: [content]
    }
});

// override base: pseudo + non-pseudo active
export const applyStateNoAnimStartup = () =>
    stateNotCheckingClearing(
        stateNotEnablingDisabling(
            stateNotActivatingPassivating(
                stateNotHoverLeave(
                    stateNotFocusBlur({
                        [chkElm]: {
                            [iconElm]: {
                                animationDuration: [['0ms'], '!important'],
                            },
                        },
                    })
                )
            )
        )
    );



export function useStateCheckClear(props: Props) {
    const defaultChecked = false; // if [checked] and/or [defaultChecked] was not specified => the default value is checked=false
    const [checked,  setChecked ] = useState(props.checked ?? props.defaultChecked ?? defaultChecked);
    const [checking, setChecking] = useState(false);
    const [clearing, setClearing] = useState(false);


    const handleChangeInternal = (newCheck: boolean) => {
        if (checked !== newCheck) { // changes detected => apply the changes & start animating
            setChecked(newCheck);
            
            if (newCheck) {
                setClearing(false);
                setChecking(true);
            }
            else {
                setChecking(false);
                setClearing(true);
            }
        }
    }


    if (props.checked !== undefined) { // controllable prop => watch the changes
        handleChangeInternal(/*newCheck =*/props.checked);
    } // if

    
    const handleChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        if (props.checked !== undefined) return; // controllable prop => let the prop determines the state

        handleChangeInternal(/*newCheck =*/target.checked);
    }
    const handleIdle = () => {
        // clean up expired animations

        if (checking) setChecking(false);
        if (clearing) setClearing(false);
    }
    return {
        checked :  checked,
        cleared : !checked,
        class: (checking? 'check' : (clearing ? 'clear': null)),
        handleChange: handleChange,
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(check|clear)|(?<=[a-z])(Check|Clear))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
        handleAnimationEndPress : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(active|passive)|(?<=[a-z])(Active|Passive))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
    };
}



const chkElm         = '& >:first-child';
const iconElm        = '&::before';
const nextElm        = '& >:nth-child(1n+2)';
const selfAndNextElm = '&,& ~*';


export const themes = {extend:[ EditControls.themes, ]}; // copy EditControl's themes
defineThemes(themes, (theme, Theme, themeProp, themeColor) => ({
    // customize the label's text color:
    [vars.colorLabelTh] : (colors as any)[`${theme}Cont`],
}));

export const sizes  =           EditControls.sizes;      // copy EditControl's sizes


const chkThemesIf = {
    // define default (secondary) colors:
    [vars.colorLabelIf]    : colors.secondaryCont,

    // define active (primary) colors:
    [vars.colorLabelIfAct] : colors.primaryCont,



    // define valid (success) colors:
    [vars.colorLabelIfVal] : colors.successCont,

    // define invalid (danger) colors:
    [vars.colorLabelIfInv] : colors.dangerCont,
};
const chkFnVars = EditControls.fnVars; // copy EditControl's fnVars
const chkStates = {
    // specific states:
    extend:[
        // transfers the focus state to the "next" element(s):
        stateBlurring({
            [selfAndNextElm]: {
                [vars.boxShadowFocusBlur]     : getVar(vars.boxShadowFocusFn),
                [vars.animFocusBlur]          : ccssProps.animBlur,
            },
        }),
        stateNotDisable({extend:[
            // state focus are possible when enabled
            stateFocus({
                [selfAndNextElm]: {
                    [vars.boxShadowFocusBlur] : getVar(vars.boxShadowFocusFn),
                    [vars.animFocusBlur]      : ccssProps.animFocus,
                    

                    extend:[
                        applyStateActive(),
                    ],

                    // apply active (primary) color on label:
                    [vars.colorLabelIf]       : getVar(vars.colorLabelIfAct),
                },
            }),
        ]}),
    ],



    // because we redefine the props above target on the [selfAndNextElm] =>
    // we should redefine the fnVars here:
    [selfAndNextElm]: {
        extend: [
            chkThemesIf,
            chkFnVars,
        ],
    },
};


export const fnVars = EditControls.fnVars; // copy EditControl's fnVars
export const states = {extend:[ EditControls.states, { // copy EditControl's states
    [nextElm]: {
        // customize final foreground color for the label:
        [vars.colorLabelFn] : getVar(
            vars.colorLabelIfIf, // first  priority
            vars.colorLabelTh,   // second priority
            vars.colorLabelIf    // third  priority
        ),
    },



    // customize final composite animation(s) at the "icon" element:
    [vars.animIconFn]: [
        getVar(vars.animCheckClear),
    ],



    // all initial states are none:

    [vars.filterCheckClearIn]  : cssProps.filterCheck,
    [vars.filterCheckClearOut] : cssProps.filterClear,
    [vars.animCheckClear]      : ecssProps.animNone,

    // specific states:
    extend:[
        stateNotDisable({extend:[
            stateHover({
                [nextElm]: {
                    // apply active (primary) color for the label:
                    [vars.colorLabelIf] : getVar(vars.colorLabelIfAct),
                },
            }),
        ]}),
        stateActive({ // [activating, actived]
            [nextElm]: {
                // apply active (primary) color for the label:
                [vars.colorLabelIf]     : getVar(vars.colorLabelIfAct),
            },
        }),



        stateValid({
            [nextElm]: {
                [vars.colorLabelIfIf]   : getVar(vars.colorLabelIfVal),
            }
        }),
        stateInvalid({
            [nextElm]: {
                [vars.colorLabelIfIf]   : getVar(vars.colorLabelIfInv),
            }
        }), 



        stateCheckClear({ // [checking, checked, clearing]
            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.filterActivePassive] : icssProps.filterActive,
            },
        }),
        stateCheck({ // [checking, checked]
            [vars.animCheckClear]          : cssProps.animCheck,

            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.animActivePassive]   : icssProps.animActive,


                extend:[
                    applyStateActive(),
                ],
            },
        }),
        stateClearing({ // [clearing]
            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.animActivePassive]   : icssProps.animPassive,
            },
        }),
        stateNotCheck({ // [not-checking, not-checked] => [clearing, cleared]
            [vars.animCheckClear]          : cssProps.animClear,
        }),
        stateNotCheckingClearing( // [not-checking, not-clearing]
            applyStateNoAnimStartup()
        ),
        { // [cleared]
            '&.checked,&:checked:not(.check)': { // if ctrl was checked, disable the animation
                [chkElm]: stateNotFocusBlur({ // still transfering the focus state to the "sibling" element(s):
                    // the "sibling" element(s):
                    '&~*': // transfer the checked state to the "sibling" element(s):
                        base_applyStateNoAnimStartup(),
                }),
            },
        },



        // fnVars, // no changes
    ],
}]};


const inheritStyles = {
    fontSize           : undefined, // inherit
    fontFamily         : undefined, // inherit
    fontWeight         : undefined, // inherit
    fontStyle          : undefined, // inherit
    textDecoration     : undefined, // inherit
    lineHeight         : undefined, // inherit

    opacity            : undefined, // inherit
    transition         : 'inherit',
    filter             : undefined, // inherit
    color              : 'inherit',

    cursor             : 'inherit',
};
const chkStyles = {
    extend: [
        EditControls.basicStyle,    // copy basicStyle from EditControl
        inheritStyles,              // force some props inherited from parent
        filterValidProps(cssProps), // apply our filtered cssProps
    ],

    img                : undefined, // delete
    spacing            : undefined, // delete

    switchImg          : undefined, // delete
    switchBorderRadius : undefined, // delete

    // layout:
    display       : 'inline-block',
    verticalAlign : 'baseline',

    // sizings:
    width     : '1em',
    height    : '1em',
    boxSizing : 'border-box',
    paddingX: 0, paddingY: 0,

    // spacings:
    '&:not(:last-child)': {
        marginInlineEnd: cssProps.spacing,
    },



    overflow: 'hidden', // clip the icon at borderRadius

    [iconElm]: {
        extend: [
            Icons.basicStyle,
            Icons.styles.img,
        ],

        content : '""',
        display : 'block',
        height  : '100%',
        width   : '100%',

        verticalAlign : undefined, // delete
        
        [vars.img]: cssProps.img,
        
        
        
        // apply final composite animation(s) at the "icon" element:
        anim: getVar(vars.animIconFn),
    },

};
export const basicStyle = {
    extend: [
        EditControls.basicStyle, // copy basicStyle from EditControl
    ],

    backg         : undefined, // delete
    paddingX      : undefined, // delete
    paddingY      : undefined, // delete
    border        : undefined, // delete
    borderRadius  : undefined, // delete
    boxShadow     : undefined, // delete
    anim          : undefined, // delete

    // layout:
    display       : 'inline-flex',
    verticalAlign : 'text-bottom',
    alignItems    : center,
    flexWrap      : 'wrap',



    // the dummy text content, for making height as tall as line-height
    '&::before': {
        content    : '"\xa0"', // &nbsp;
        display    : 'inline',
        
        width      : 0,
        overflow   : 'hidden',
        visibility : 'hidden',
    },



    [chkElm]: chkStyles,

    [nextElm]: {
        // apply final foreground color for the label:
        color : getVar(vars.colorLabelFn),
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

        [chkElm]: chkStates,
    },
    chkOutline: {
        [chkElm]: Controls.styles.outline,
    },
    chkBtn: {
        '&:not(._)': { // force to win conflict with states
            verticalAlign : 'baseline',
        },
    
    
    
        [chkElm]: {
            '&:not(._)': { // force to win conflict with states
                // display: none, // hide the checkbox // causes focus doesn't work anymore
        
                // hiding the checkbox while still preserving focus working
                opacity: 0,
                width: 0, height: 0, border: 0,
                marginInlineEnd: 0,
    
                // turn off animations:
                // anim: none, // still needed the anim focus/blur
            },
    
            
            [iconElm]: {
                '&:not(._)': { // force to win conflict with states
                    // turn off animations:
                    anim: none,
                },
            },
        },
    
    
        [nextElm]: {
            extend: [
                Buttons.basicStyle, // copy basicStyle from Button
                inheritStyles,      // force some props inherited from parent
            ],
        },
    },
    chkBtnOutline: {
        extend: [
            'chkBtn',

            stateNotCheck({
                [nextElm]: Controls.styles.outline,
            }),
        ],
    },
    chkSwitch: {
        '&:not(._)': { // force to win conflict with states
            // overwrite default animation:
            [vars.filterCheckClearIn]     : cssProps.switchFilterCheck,
            [vars.filterCheckClearOut]    : cssProps.switchFilterClear,
    
            [vars.switchTransfIn]         : cssProps.switchTransfCheck,
            [vars.switchTransfOut]        : cssProps.switchTransfClear,
    
            // specific states:
            extend:[
                stateCheck({ // [checking, checked]
                    [vars.animCheckClear] : cssProps.switchAnimCheck,
                }),
                stateNotCheck({ // [not-checking, not-checked] => [clearing, cleared]
                    [vars.animCheckClear] : cssProps.switchAnimClear,
                }),
            ],
        },
    
    
        [chkElm]: {
            '&:not(._)': { // force to win conflict with states
                width        : '2em',
                borderRadius : cssProps.switchBorderRadius,
    
    
                [iconElm]: { // force to win conflict with states, :not(._) after pseudo-elm is invalid, so we use parent's :not(._)
                    [vars.img]: cssProps.switchImg,
                },
            },
        },
    },
    chkSwitchOutline: {
        extend: [
            'chkSwitch',
        ],

        [chkElm]: Controls.styles.outline,
    },
};
export const useStyles = createUseStyles(styles);



export type ChkStyle = 'outline' | 'switch' | 'switchOutline' | 'btn' | 'btnOutline';
export interface VariantCheck {
    chkStyle?: ChkStyle
}
export function useVariantCheck(props: VariantCheck, styles: Record<string, string>) {
    return {
        class: props.chkStyle ? (styles as any)[`chk${pascalCase(props.chkStyle)}`] : null,
    };
}



export interface Props
    extends
        EditControls.Props<HTMLInputElement, string|number>,
        VariantCheck
{
    // values:
    checked?        : boolean
    defaultChecked? : boolean

    // labels:
    text?    : string
}
export function CheckBase(styleMain: string | null, props: Props, inputType: string) {
    const elmStyles       = Elements.useStyles();
    const chkStyles       =          useStyles();

    // themes:
    const variTheme       = Elements.useVariantTheme(props, chkStyles);
    const variSize        = Elements.useVariantSize(props, elmStyles);
    const variGradient    = Elements.useVariantGradient(props, elmStyles);
    const variCheck       =          useVariantCheck(props, chkStyles);

    // states:
    const stateEnbDis     = useStateEnableDisable(props);
    const stateLeave      = useStateLeave(stateEnbDis);
    const stateFocusBlur  = useStateFocusBlur(props, stateEnbDis);
    const stateActPass    = useStateActivePassive(props, stateEnbDis);
    const nativeValidator = useNativeValidator(props.customValidator);
    const stateValInval   = useStateValidInvalid(props, nativeValidator.validator);
    const stateChkClr     = useStateCheckClear(props);

    

    const isBtnStyle = props.chkStyle?.startsWith('btn') || undefined;
    return (
        <label className={[
                styleMain,
                chkStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,
                variCheck.class,

                // states:
                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateLeave.class,
                // stateFocusBlur.class,
                stateActPass.class,
                stateValInval.class,
                stateChkClr.class ?? (stateChkClr.checked ? 'checked' : null),
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            // onFocus={stateFocusBlur.handleFocus}
            // onBlur={stateFocusBlur.handleBlur}
            onMouseDown={stateActPass.handleMouseDown}
            onKeyDown={stateActPass.handleKeyDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyUp={stateActPass.handleKeyUp}

            // no anim on <label>
            // onAnimationEnd={(e) => {
            //     stateEnbDis.handleAnimationEnd(e);
            //     stateLeave.handleAnimationEnd(e);
            //     // stateFocusBlur.handleAnimationEnd(e);
            //     stateActPass.handleAnimationEnd(e);
            // }}
        >
            <input className={[
                    // themes:
                    // variTheme.class,
                    // variSize.class,
                    // variGradient.class,

                    // states:
                    // stateEnbDis.class,
                    // stateLeave.class,
                    stateFocusBlur.class,
                    // stateActPass.class,
                ].join(' ')}

                // accessibility:
                disabled={stateEnbDis.disabled}
                readOnly={props.readonly}

                // values:
                value={props.value}
                defaultValue={props.defaultValue}
                checked={props.checked}
                defaultChecked={props.defaultChecked}
                onChange={(e) => {
                    props.onChange?.(e);
                    nativeValidator.handleChange(e);
                    stateChkClr.handleChange(e);
                }}

                // validations:
                required={props.required}
                ref={nativeValidator.handleInit}

                // formats:
                type={inputType}

                // labels:
                aria-hidden={isBtnStyle}
            
                // onMouseEnter={stateLeave.handleMouseEnter}
                // onMouseLeave={stateLeave.handleMouseLeave}
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
                    stateChkClr.handleAnimationEnd(e);
                }}
            />
            {props.text ? <span onAnimationEnd={stateChkClr.handleAnimationEndPress}>{props.text}</span> : undefined}
        </label>
    );
}
export default function Check(props: Props) {
    return CheckBase(null, props, 'checkbox');
}