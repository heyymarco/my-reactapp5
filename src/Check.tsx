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
    indicatorImg               : Css.Image
    indicatorSpacing           : Css.Gap
    
    switchIndicatorImg         : Css.Image
    switchBorderRadius         : Css.BorderRadius

    
    // anim props:

    switchIndicatorImgPosCheck : Css.ImagePosition
    switchIndicatorImgPosClear : Css.ImagePosition
    switchIndicatorFilterCheck : Css.Filter
    switchIndicatorFilterClear : Css.Filter

    filterClear                : Css.Filter

    '@keyframes check'         : Css.Keyframes
    '@keyframes clear'         : Css.Keyframes
    animCheck                  : Css.Animation
    animClear                  : Css.Animation
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Controls.vars, Icons.vars, {
    /**
     * a custom css props for manipulating icon's animation(s).
     */
    animIconFn       : '--chk-animIconFn',

    /**
     * a custom css props for manipulating label's text color.
     */
    labelColor       : '--chk-labelColor',


    // anim props:

    filterCheckClear : '--chk-filterCheckClear',
    animCheckClear   : '--chk-animCheckClear',
});

// re-defined later, we need to construct varProps first
export const keyframesCheck = { from: undefined, to: undefined };
export const keyframesClear = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
const ccssProps = Controls.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // forked from Bootstrap 5:
    indicatorImg               : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3 6-6'/></svg>")}")`,
    indicatorSpacing           : '0.3em',
    
    // forked from Bootstrap 5:
    switchIndicatorImg         : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#000'/></svg>")}")`,
    switchBorderRadius         : '0.5em',
    
    
    
    // anim props:

    switchIndicatorImgPosCheck : 'right',
    switchIndicatorImgPosClear : 'left',
    switchIndicatorFilterCheck : [['brightness(100%)']],
    switchIndicatorFilterClear : [['brightness(100%)']],

    filterClear                : [['opacity(0%)']],

    '@keyframes check'         : keyframesCheck,
    '@keyframes clear'         : keyframesClear,
    animCheck                  : [['150ms', 'ease-out', 'both', keyframesCheck]],
    animClear                  : [['150ms', 'ease-out', 'both', keyframesClear]],
};



Object.assign(keyframesClear, {
    from: {
        filter: none,
    },
    to: {
        filter: [[
            getVar(vars.filterCheckClear),
        ]],
    }
});
Object.assign(keyframesCheck, {
    from : keyframesClear.to,
    to   : keyframesClear.from
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
                        // the main "icon" element:
                        '& >:first-child::before': {
                            animationDuration: [['0ms'], '!important'],
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

function escapeSvg(svg: string) {
    const svgCopy = Array.from(svg);
    const escapeChars: { [key: string]: string } = {
        '<': '%3c',
        '>': '%3e',
        '#': '%23',
        '(': '%28',
        ')': '%29',
    };
    for (const index in svgCopy) {
        const char = svgCopy[index];
        if (char in escapeChars) svgCopy[index] = escapeChars[char];
    }

    return svgCopy.join('');
}



const states = {extend:[ Controls.states, { // copy Control's states

    [vars.filterEnableDisable] : undefined, // ihnerit from <label>'s enable/disable
    [vars.animEnableDisable]   : undefined, // ihnerit from <label>'s enable/disable

    [vars.filterHoverLeave]    : undefined, // ihnerit from <label>'s hover/leave
    [vars.animHoverLeave]      : undefined, // ihnerit from <label>'s hover/leave

    [vars.filterActivePassive] : undefined, // ihnerit from <label>'s active/passive
    [vars.animActivePassive]   : undefined, // ihnerit from <label>'s active/passive



    // customize the icon's anim:
    [vars.animIconFn]: [
        getVar(vars.animCheckClear),
    ],

    // specific states:
    extend:[
        // transfers the focus state to the "sibling" element(s):
        stateNotDisable({extend:[
            stateFocusBlur({
                '& ~*': {
                    [vars.boxShadowFocusBlur] : getVar(vars.boxShadowFocusFn),
                },
            }),
            stateFocus({
                '& ~*': {
                    [vars.animFocusBlur]      : ccssProps.animFocus,
                },
            }),
            stateBlur({
                '& ~*': {
                    [vars.animFocusBlur]      : ccssProps.animBlur,
                },
            }),
        ]}),
    ],
}]};

const labelStates = {
    // customize the label's text color:
    [vars.labelColor]: ecssProps.color,



    // all initial states are none:

    [vars.filterCheckClear] : ecssProps.filterNone,
    [vars.animCheckClear]   : ecssProps.animNone,

    // specific states:
    extend:[
        stateCheckClear({
            [vars.filterCheckClear]        : cssProps.filterClear,

            '& :nth-child(1n+2)': { // transfer the check/clear state to the "sibling" element(s):
                [vars.filterActivePassive] : icssProps.filterActive,
            },
        }),
        stateCheck({
            [vars.animCheckClear]          : cssProps.animCheck,

            '& :nth-child(1n+2)': { // transfer the check/clear state to the "sibling" element(s):
                [vars.animActivePassive]   : icssProps.animActive,
            },
        }),
        stateClear({
            [vars.animCheckClear]          : cssProps.animClear,

            '& :nth-child(1n+2)': { // transfer the check/clear state to the "sibling" element(s):
                [vars.animActivePassive]   : icssProps.animPassive,
            },
        }),
        stateNotCheckClear({ // hides the check if not [checking, checked, clearing]
            // the main "icon" element:
            '& >:first-child::before': {
                display: none,
            },
        }),
        {
            '&.checked,&:checked:not(.check)': {extend:[ // if ctrl was checked, disable the animation
                stateNoAnimStartup(),

                {
                    // the main "checkbox" element:
                    '& >:first-child': stateNotFocusBlur({
                        // the "sibling" element(s):
                        '&~*': {extend:[ // transfer the checked state to the "sibling" element(s):
                            base_stateNoAnimStartup(),
                        ]},
                    }),
                }
            ]},
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

const styleCheckbox = {
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
        states,                     // apply our states
    ],

    indicatorImg               : undefined, // delete
    indicatorSpacing           : undefined, // delete

    switchIndicatorImg         : undefined, // delete
    switchIndicatorImgPosCheck : undefined, // delete
    switchIndicatorImgPosClear : undefined, // delete
    switchBorderRadius         : undefined, // delete
    switchIndicatorFilterCheck : undefined, // delete
    switchIndicatorFilterClear : undefined, // delete

    display   : 'inline-block',

    // sizings:
    width     : '1em',
    height    : '1em',
    boxSizing : 'border-box',
    paddingX: 0, paddingY: 0,

    // typo settings:
    verticalAlign  : 'baseline', // button's text should aligned with sibling text, so the button behave like <span> wrapper

    '&:not(:last-child)': {
        marginInlineEnd: cssProps.indicatorSpacing,
    },



    overflow: 'hidden',
    '&::before': { // the main "icon" element:
        extend: [
            Icons.styles.main,
            Icons.styles.img,
        ],

        content : '""',
        display : 'block',
        height  : '100%',
        width   : '100%',

        transition    : ecssProps.transition,

        verticalAlign : undefined, // delete
        
        [vars.img]: cssProps.indicatorImg,
        
        
        
        // a custom css props for manipulating icon's animation(s):
        anim: getVar(vars.animIconFn), // apply prop
    },

};
const styleChkBtn = {
    verticalAlign : 'baseline',



    // the main "checkbox" element:
    '& >:first-child': {
        // display: none, // hide the checkbox // causes focus doesn't work anymore

        // hiding the checkbox while still preserving focus working
        opacity: 0,
        width: 0, height: 0, border: 0,
        marginInlineEnd: 0,

        // turn off animations:
        // anim: none, // still needed the anim focus/blur
        '&::before': { // the main "icon" element:
            anim: none,
        },
    },

    // the "sibling" element(s):
    '& >:nth-child(1n+2)': {
        extend: [
            Buttons.styles.main, // copy styles from Button, including Button's cssProps & Button's states.
            states,
        ],
    },
};
const styles = {
    main: {
        extend: [
            Controls.styles.main, // copy styles from Control, including Control's cssProps & Control's states.
            labelStates,
        ],

        // layout:
        display       : 'inline-flex',
        verticalAlign : 'text-bottom',
        alignItems    : center,
        flexWrap      : 'wrap',



        // a custom css props for manipulating label's text color.
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



        // the main "checkbox" element:
        '& >:first-child': styleCheckbox,
    },

    chkBtn: { '&:not(._)': { // force to win conflict with main
        extend: [
            styleChkBtn,
        ],
    }},

    chkBtnOutline: { '&:not(._)': { // force to win conflict with main
        extend: [
            styleChkBtn,
            stateNotCheck({
                // the "sibling" element(s):
                '& >:nth-child(1n+2)': {
                    extend: [
                        Buttons.styles.btnOutline,
                    ],
                },
            }),
        ],
    }},

    chkSwitch: { '&:not(._)': { // force to win conflict with main
        // the main "checkbox" element:
        '& >:first-child': {
            width        : '2em',
            borderRadius : cssProps.switchBorderRadius,



            '&::before': { // the main "icon" element:
                [vars.img]: cssProps.switchIndicatorImg,
            },
        },



        // specific states:
        extend:[
            stateCheck({
                [vars.filterCheckClear] : cssProps.switchIndicatorFilterCheck,

                // the main "icon" element:
                '& >:first-child::before': {
                    maskPosition        : cssProps.switchIndicatorImgPosCheck,
                    WebkitMaskPosition  : cssProps.switchIndicatorImgPosCheck,
                },
            }),
            stateNotCheck({
                [vars.filterCheckClear] : cssProps.switchIndicatorFilterClear,

                // the main "icon" element:
                '& >:first-child::before': {
                    maskPosition        : cssProps.switchIndicatorImgPosClear,
                    WebkitMaskPosition  : cssProps.switchIndicatorImgPosClear,
                },
            }),
            stateNotCheckClear({ // hides the check if not [checking, checked, clearing]
                // the main "icon" element:
                '& >:first-child::before': {
                    display: 'block',
                },
            }),
        ],
    }}, 

    gradient: { '&:not(._)': { // force to win conflict with main
        // the main "checkbox" element & "label" element:
        '& >*': {
            extend: [
                // copy the themes from Button:
                Buttons.styles.gradient,
            ],
        },
    }},
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Control:
        (Controls.styles as any)[themeProp],
    ],


    // customize the label's text color:
    [vars.labelColor] : (colors as any)[`${theme}Cont`],


    // transfers the theme to the "sibling" element(s):
    '& ~*': {
        extend: [
            // copy the themes from Control:
            (Controls.styles as any)[themeProp],
        ],
    },
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



type ChkStyle = 'switch' | 'btn' | 'btnOutline';
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
}
export default function Button(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, styles, variThemeDef);
    const variGradient   = Elements.useVariantGradient(props, styles);
    const variCheck      =          useVariantCheck(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);
    const stateChkClr    = useStateCheckClear(props);

    

    const isBtnStyle = props.chkStyle?.startsWith('btn') || undefined;
    return (
        <label className={[
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

                type='checkbox'

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