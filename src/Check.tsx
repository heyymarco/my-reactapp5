import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import * as Controls       from './Control';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup as base_stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
import * as Buttons        from './Button';
import * as Icons          from './Icon';
import colors              from './colors';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
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
export const vars = Object.assign({}, Controls.vars, Icons.vars, {
    /**
     * final composite animation(s) at the "icon" element.
     */
    iconAnimFn          : '--chk-iconAnimFn',

    /**
     * foreground color for the label.
     */
    labelColor          : '--chk-labelColor',


    // anim props:

    switchTransfIn      : '--chk-switchTransfIn',
    switchTransfOut     : '--chk-switchTransfOut',

    filterCheckClearIn  : '--chk-filterCheckClearIn',
    filterCheckClearOut : '--chk-filterCheckClearOut',
    animCheckClear      : '--chk-animCheckClear',
});

// re-defined later, we need to construct varProps first
export const keyframesCheck       = { from: undefined, to: undefined };
export const keyframesClear       = { from: undefined, to: undefined };
export const keyframesSwitchCheck = { from: undefined, to: undefined };
export const keyframesSwitchClear = { from: undefined, to: undefined };
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
export const stateClear               = (content: object) => ({
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
export const stateNoAnimStartup = () =>
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
    const defaultChecked = false; // if [checked] was not specified => the default value is checked=false
    const [checked,  setChecked ] = useState(props.checked ?? defaultChecked);
    const [checking, setChecking] = useState(false);
    const [clearing, setClearing] = useState(false);


    const newCheck = props.checked ?? defaultChecked;
    useEffect(() => {
        if (checked !== newCheck) {
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
    }, [checked, newCheck]);

    
    const handleIdle = () => {
        // clean up expired animations

        if (checking) setChecking(false);
        if (clearing) setClearing(false);
    }
    return {
        checked : checked,
        cleared: !checked,
        class: (checking? 'check' : (clearing ? 'clear': null)),
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



const chkElm  = '& >:first-child';
const iconElm = '&::before';
const nextElm = '& >:nth-child(1n+2)';

const childFocusableStates = {extend:[ Controls.states, { // copy Control's states
    [vars.colorTh]             : undefined, // ihnerit from <label>'s theme
    [vars.colorIf]             : undefined, // ihnerit from <label>'s theme
    [vars.colorFn]             : undefined, // ihnerit from <label>'s theme
    [vars.backgTh]             : undefined, // ihnerit from <label>'s theme
    [vars.backgIf]             : undefined, // ihnerit from <label>'s theme
    [vars.backgFn]             : undefined, // ihnerit from <label>'s theme
    [vars.outlineColorTh]      : undefined, // ihnerit from <label>'s theme
    [vars.outlineColorIf]      : undefined, // ihnerit from <label>'s theme
    [vars.outlineColorFn]      : undefined, // ihnerit from <label>'s theme
    [vars.outlineBackgFn]      : undefined, // ihnerit from <label>'s theme

    [vars.colorIfAct]          : undefined, // ihnerit from <label>'s theme
    [vars.backgIfAct]          : undefined, // ihnerit from <label>'s theme

    [vars.boxShadowFocusFn]    : undefined, // ihnerit from <label>'s theme


    [vars.filterEnableDisable] : undefined, // ihnerit from <label>'s enable/disable
    [vars.animEnableDisable]   : undefined, // ihnerit from <label>'s enable/disable

    [vars.filterHoverLeave]    : undefined, // ihnerit from <label>'s hover/leave
    [vars.animHoverLeave]      : undefined, // ihnerit from <label>'s hover/leave

    [vars.filterActivePassive] : undefined, // ihnerit from <label>'s active/passive
    [vars.animActivePassive]   : undefined, // ihnerit from <label>'s active/passive
}]};
const childInheritStates = {extend:[ childFocusableStates, { // copy childFocusableStates
    [vars.boxShadowFocusBlur]  : undefined, // ihnerit from <checkbox>'s focus/blur
    [vars.animFocusBlur]       : undefined, // ihnerit from <checkbox>'s focus/blur
}]};
const chkStates = {extend:[ childFocusableStates, { // copy childFocusableStates
    // specific states:
    extend:[
        // transfers the focus state to the "next" element(s):
        stateFocusBlur({
            '& ~*': {
                [vars.boxShadowFocusBlur] : getVar(vars.boxShadowFocusFn),
            },
        }),
        stateBlur({
            '& ~*': {
                [vars.animFocusBlur]      : ccssProps.animBlur,
            },
        }),
        stateNotDisable({extend:[
            // state focus are possible when enabled
            stateFocus({
                '& ~*': {
                    [vars.animFocusBlur]  : ccssProps.animFocus,
                },
            }),
        ]}),
    ],
}]};
const states = {
    // customize foreground color for the label:
    [vars.labelColor]: ecssProps.color,



    // customize final composite animation(s) at the "icon" element:
    [vars.iconAnimFn]: [
        getVar(vars.animCheckClear),
    ],



    // all initial states are none:

    [vars.filterCheckClearIn]  : cssProps.filterCheck,
    [vars.filterCheckClearOut] : cssProps.filterClear,
    [vars.animCheckClear]      : ecssProps.animNone,

    // specific states:
    extend:[
        stateCheckClear({ // [checking, checked, clearing]
            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.filterActivePassive] : icssProps.filterActive,
            },
        }),
        stateCheck({ // [checking, checked]
            [vars.animCheckClear]          : cssProps.animCheck,

            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.animActivePassive]   : icssProps.animActive,
            },
        }),
        stateClear({ // [clearing]
            [nextElm]: { // transfer the check/clear state to the "next" element(s):
                [vars.animActivePassive]   : icssProps.animPassive,
            },
        }),
        stateNotCheck({ // [not-checking, not-checked] => [clearing, cleared]
            [vars.animCheckClear]          : cssProps.animClear,
        }),
        stateNotCheckingClearing( // [not-checking, not-clearing]
            stateNoAnimStartup()
        ),
        { // [cleared]
            '&.checked,&:checked:not(.check)': { // if ctrl was checked, disable the animation
                [chkElm]: stateNotFocusBlur({ // still transfering the focus state to the "sibling" element(s):
                    // the "sibling" element(s):
                    '&~*': // transfer the checked state to the "sibling" element(s):
                        base_stateNoAnimStartup(),
                }),
            },
        },



        // disable (overwrite) focus state:
        stateNotDisable({extend:[
            stateFocus({
                [vars.animFocusBlur] : undefined,
            }),
            stateBlur({
                [vars.animFocusBlur] : undefined,
            }),
        ]}),
    ],
};

const chkStyles = {
    extend: [
        Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
        {
            // fontSize       : undefined, // still needed for determining checkbox's size
            fontFamily     : undefined,
            fontWeight     : undefined,
            fontStyle      : undefined,
            textDecoration : undefined,
            lineHeight     : undefined,
        },
        filterValidProps(cssProps), // apply our filtered cssProps
        chkStates,                  // apply our states
    ],

    img                : undefined, // delete
    spacing            : undefined, // delete

    switchImg          : undefined, // delete
    switchBorderRadius : undefined, // delete

    display   : 'inline-block',

    // sizings:
    width     : '1em',
    height    : '1em',
    boxSizing : 'border-box',
    paddingX: 0, paddingY: 0,

    // typo settings:
    verticalAlign  : 'baseline', // button's text should aligned with sibling text, so the button behave like <span> wrapper

    '&:not(:last-child)': {
        marginInlineEnd: cssProps.spacing,
    },



    overflow: 'hidden',

    [iconElm]: {
        extend: [
            Icons.styles.main,
            Icons.styles.img,
        ],

        content : '""',
        display : 'block',
        height  : '100%',
        width   : '100%',

        verticalAlign : undefined, // delete
        
        [vars.img]: cssProps.img,
        
        
        
        // apply final composite animation(s) at the "icon" element:
        anim: getVar(vars.iconAnimFn),
    },

};
const chkBtnStyles = {
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
            Buttons.styles.main, // copy styles from Button, including Button's cssProps & Button's states.
            childInheritStates,
        ],
    },
};
const chkSwitchStyles = {
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
};
const styles = {
    main: {
        extend: [
            Controls.styles.main, // copy styles from Control, including Control's cssProps & Control's states.
            states,
        ],

        // layout:
        display       : 'inline-flex',
        verticalAlign : 'text-bottom',
        alignItems    : center,
        flexWrap      : 'wrap',



        // apply foreground color for the label:
        color : getVar(vars.labelColor),



        // removed:

        // not needed a background:
        backg        : undefined,

        // not needed paddings & borders:
        paddingX     : undefined,
        paddingY     : undefined,
        border       : undefined,
        borderRadius : undefined,



        // the dummy text content, for making height as line-height
        '&::before': {
            content    : '"\xa0"', // &nbsp;
            display    : 'inline',
            
            width      : 0,
            overflow   : 'hidden',
            visibility : 'hidden',
        },



        [chkElm]: chkStyles,
    },

    chkBtn: chkBtnStyles,

    chkBtnOutline: {
        extend: [
            chkBtnStyles,

            stateNotCheck({
                [nextElm]: Buttons.styles.btnOutline,
            }),
        ],
    },

    chkSwitch: chkSwitchStyles,
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Control:
        (Controls.styles as any)[themeProp],
    ],


    '&:not(._)': { // force to win conflict with states
        // customize the label's text color:
        [vars.labelColor] : (colors as any)[`${theme}Cont`],
    },
}));

const useStyles = createUseStyles(styles);
export { childInheritStates, chkStates, states, chkStyles, chkBtnStyles, styles, useStyles };



export type ChkStyle = 'switch' | 'btn' | 'btnOutline';
export interface VariantCheck {
    chkStyle?: ChkStyle
}
export function useVariantCheck(props: VariantCheck, styles: Record<string, string>) {
    return {
        class: props.chkStyle ? (styles as any)[`chk${pascalCase(props.chkStyle)}`] : null,
    };
}

export const themeDefaults: {[btnStyle: string]: (string|undefined)} = {
    default    : 'primary',
    switch     : 'primary',
    btn        : 'primary',
    btnOutline : 'primary',
};
export function useVariantThemeDefault(props: VariantCheck) {
    return () => {
        return themeDefaults?.[props.chkStyle ?? 'default'] ?? undefined;
    };
}

export interface Props
    extends
        Controls.Props,
        VariantCheck
{
    text?     : string

    checked?  : boolean
    onChange? : React.ChangeEventHandler<HTMLInputElement>

    value?    : string | ReadonlyArray<string> | number
}
export function CheckBase(styleMain: string | null, props: Props, inputType: string) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, styles, variThemeDef);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variCheck      =          useVariantCheck(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);
    const stateChkClr    = useStateCheckClear(props);

    

    const isBtnStyle = props.chkStyle?.startsWith('btn') || undefined;
    return (
        <label className={[
                styleMain,
                styles.main,

                variSize.class,
                (props.theme ? variTheme.class : null), // if uses default theme => dont apply theme on the <label>
                variGradient.class,
                variCheck.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateLeave.class,
                // stateFocusBlur.class,
                stateActPass.class,
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
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                // stateFocusBlur.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            <input className={[
                    // variSize.class,
                    (!props.theme ? variTheme.class : null), // if use theme, inherit theme from <label>, otherwise define default theme here
                    // variGradient.class,

                    // stateEnbDis.class,
                    // stateLeave.class,
                    stateFocusBlur.class,
                    // stateActPass.class,
                ].join(' ')}

                type={inputType}
                value={props.value}

                disabled={stateEnbDis.disabled}
                checked={stateChkClr.checked}
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
                    // stateEnbDis.handleAnimationEnd(e);
                    // stateLeave.handleAnimationEnd(e);
                    stateFocusBlur.handleAnimationEnd(e);
                    // stateActPass.handleAnimationEnd(e);
                    stateChkClr.handleAnimationEnd(e);
                }}
                onChange={props.onChange}
            />
            {props.text ? <span onAnimationEnd={stateChkClr.handleAnimationEndPress}>{props.text}</span> : undefined}
        </label>
    );
}
export default function Check(props: Props) {
    return CheckBase(null, props, 'checkbox');
}