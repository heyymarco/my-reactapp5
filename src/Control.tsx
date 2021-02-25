import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Indicator';
import colors              from './colors';
import stipOuts            from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
    cursor                : Css.Cursor
    cursorDisabled        : Css.Cursor
    
    
    // anim props:

    boxShadowFocus        : Css.BoxShadow

    filterHover           : Css.Filter

    '@keyframes hover'    : Css.Keyframes
    '@keyframes leave'    : Css.Keyframes
    '@keyframes focus'    : Css.Keyframes
    '@keyframes blur'     : Css.Keyframes
    animHover             : Css.Animation
    animLeave             : Css.Animation
    animFocus             : Css.Animation
    animBlur              : Css.Animation
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Indicators.vars, {
    /**
     * a custom css props for manipulating a box-shadow at focused state.
     */
    boxShadowFocusFn    : '--ctrl-boxShadowFocusFn',

    
    // anim props:

    // filterHoverLeave : '--ctrl-filterHoverLeave', // already defined in Indicator
    animHoverLeave      : '--ctrl-animHoverLeave',
    
    boxShadowFocusBlur  : '--ctrl-boxShadowFocusBlur',
    animFocusBlur       : '--ctrl-animFocusBlur',
});

// re-defined later, we need to construct varProps first
export const keyframesHover    = { from: undefined, to: undefined };
export const keyframesLeave    = { from: undefined, to: undefined };
export const keyframesFocus    = { from: undefined, to: undefined };
export const keyframesBlur     = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    cursor                : 'pointer',
    cursorDisabled        : 'not-allowed',


    // anim props:
    
    boxShadowFocus        : [[0, 0, 0, '0.2rem']],

    filterHover           : [['brightness(85%)']],

    '@keyframes hover'    : keyframesHover,
    '@keyframes leave'    : keyframesLeave,
    '@keyframes focus'    : keyframesFocus,
    '@keyframes blur'     : keyframesBlur,
    animHover             : [['150ms', 'ease-out', 'both', keyframesHover   ]],
    animLeave             : [['300ms', 'ease-out', 'both', keyframesLeave   ]],
    animFocus             : [['150ms', 'ease-out', 'both', keyframesFocus   ]],
    animBlur              : [['300ms', 'ease-out', 'both', keyframesBlur    ]],
};



Object.assign(keyframesHover, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            // getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    }
});
Object.assign(keyframesLeave, {
    from : keyframesHover.to,
    to   : keyframesHover.from
});

Object.assign(keyframesFocus, {
    from: {
        boxShadow: [[[
            ecssProps.boxShadow,
            // getVar(vars.boxShadowFocusBlur),
        ]]],
    },
    to: {
        boxShadow: [[[
            ecssProps.boxShadow,
            getVar(vars.boxShadowFocusBlur),
        ]]],
    }
});
Object.assign(keyframesBlur, {
    from : keyframesFocus.to,
    to   : keyframesFocus.from
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ctrl'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const stateHover              = (content: object) => ({
    '&:hover,&:focus': { // hover or focus
        extend: [content]
    }
});
export const stateNotHover           = (content: object) => ({
    '&:not(:hover):not(:focus)': { // not-hover and not-focus
        extend: [content]
    }
});
export const stateLeave              = (content: object) =>
    stateNotHover({ // not-hover and not-focus and (leave or blur)
        extend:[{'&.leave,&.blur': {
            extend: [content]
        }}]
    });
export const stateNotLeave           = (content: object) => ({
    '&:not(.leave):not(.blur)': { // not-leave and not-blur
        extend: [content]
    }
});
export const stateHoverLeave         = (content: object) => ({
    '&:hover,&:focus,&.leave,&.blur': { // hover or focus or leave or blur
        extend: [content]
    }
});
export const stateNotHoverLeave      = (content: object) => ({
    '&:not(:hover):not(:focus):not(.leave):not(.blur)': { // not-hover and not-focus and not-leave and not-blur
        extend: [content]
    }
});

export const stateFocus             = (content: object) => ({
    '&:focus,&.focus': {
        extend: [content]
    }
});
export const stateNotFocus          = (content: object) => ({
    '&:not(:focus):not(.focus)': {
        extend: [content]
    }
});
export const stateBlur              = (content: object) => ({
    '&.blur': {
        extend: [content]
    }
});
export const stateNotBlur           = (content: object) => ({
    '&:not(.blur)': {
        extend: [content]
    }
});
export const stateFocusBlur         = (content: object) => ({
    '&:focus,&.focus,&.blur': {
        extend: [content]
    }
});
export const stateNotFocusBlur      = (content: object) => ({
    '&:not(:focus):not(.focus):not(.blur)': {
        extend: [content]
    }
});

// override base: pseudo + non-pseudo active
export const stateActive            = (content: object) => ({
    '&:active,&.active,&.actived': {
        extend: [content]
    }
});
export const stateNotActive         = (content: object) => ({
    '&:not(:active):not(.active):not(.actived)': {
        extend: [content]
    }
});
export const statePassive           = (content: object) => ({
    '&.passive': {
        extend: [content]
    }
});
export const stateNotPassive        = (content: object) => ({
    '&:not(.passive)': {
        extend: [content]
    }
});
export const stateActivePassive     = (content: object) => ({
    '&:active,&.active,&.actived,&.passive': {
        extend: [content]
    }
});
export const stateNotActivePassive  = (content: object) => ({
    '&:not(:active):not(.active):not(.actived):not(.passive)': {
        extend: [content]
    }
});
export const stateNotActivatingPassivating  = (content: object) => ({
    '&:not(:active):not(.active):not(.passive)': {
        extend: [content]
    }
});

// override base: pseudo + non-pseudo active
export const stateNoAnimStartup     = () =>
    stateNotEnablingDisabling(
        stateNotActivatingPassivating(
            stateNotHoverLeave(
                stateNotFocusBlur({
                    animationDuration: [['0ms'], '!important'],
                })
            )
        )
    );



export const filterValidProps = <TCssProps,>(cssProps: TCssProps) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(Indicators.filterValidProps(cssProps))) {
        if ((/(Hover|Leave|Focus|Blur)$/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}

const states = Object.assign({}, Elements.states, { // not copy from Indicators.states because the state*** are too much different
    // TODO: activate this code:
    // a custom css props for manipulating a box-shadow at focused state:
    // [vars.boxShadowFocusFn]: [[ // set default value
    //     cssProps.boxShadowFocus,
    //     'rgba(128, 128, 128, 0.5)',
    // ]],
    // boxShadow: getVar(vars.boxShadowFocusFn), // not apply yet



    // customize the anim:
    [vars.animFn]: [
        ecssProps.anim,
        getVar(vars.animEnabledDisabled), // 1st : ctrl must be enabled
        getVar(vars.animHoverLeave),      // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),       // 3rd : ctrl got focused (can interrupt hover/leave)
        getVar(vars.animActivePassive),   // 4th : ctrl got pressed (can interrupt focus/blur)
    ],



    // all initial states are none:

    [vars.filterEnabledDisabled] : ecssProps.filterNone,
    [vars.animEnabledDisabled]   : ecssProps.animNone,

    [vars.filterHoverLeave]      : ecssProps.filterNone,
    [vars.animHoverLeave]        : ecssProps.animNone,

    [vars.boxShadowFocusBlur]    : ecssProps.boxShadowNone,
    [vars.animFocusBlur]         : ecssProps.animNone,

    [vars.filterActivePassive]   : ecssProps.filterNone,
    [vars.animActivePassive]     : ecssProps.animNone,

    // specific states:
    extend:[
        stateEnabledDisabled({
            [vars.filterEnabledDisabled]          : icssProps.filterDisabled,
        }),
        stateEnabled({
            [vars.animEnabledDisabled]            : icssProps.animEnabled,
        }),
        stateDisabled({
            [vars.animEnabledDisabled]            : icssProps.animDisabled,
            cursor: cssProps.cursorDisabled,
        }),
        {
            '&:disabled:not(.disable),&.disabled': // if ctrl was disabled programatically, disable first animation
                stateNoAnimStartup(),
        },


        stateNotDisabled({extend:[
            stateHoverLeave({
                [vars.filterHoverLeave]           : cssProps.filterHover,
            }),
            stateHover({
                [vars.animHoverLeave]             : cssProps.animHover,
            }),
            stateLeave({
                [vars.animHoverLeave]             : cssProps.animLeave,
            }),


            stateFocusBlur({
                [vars.boxShadowFocusBlur]         : getVar(vars.boxShadowFocusFn),
            }),
            stateFocus({
                [vars.animFocusBlur]              : cssProps.animFocus,
            }),
            stateBlur({
                [vars.animFocusBlur]              : cssProps.animBlur,
            }),
        ]}),


        stateActivePassive({
            [vars.filterActivePassive]            : icssProps.filterActive,
        }),
        stateActive({
            [vars.animActivePassive]              : icssProps.animActive,
        }),
        statePassive({
            [vars.animActivePassive]              : icssProps.animPassive,
        }),
        {
            '&.active,&.actived': { // if activated programmatically (not by user input)
                // customize the anim:
                [vars.animFn]: [
                    ecssProps.anim,
                    getVar(vars.animActivePassive),   // 1st : ctrl already pressed, move to the least priority
                    getVar(vars.animHoverLeave),      // 2nd : cursor leaved
                    getVar(vars.animFocusBlur),       // 3rd : ctrl lost focus (can interrupt hover/leave)
                    getVar(vars.animEnabledDisabled), // 4th : ctrl enabled/disabled (can interrupt focus/blur)
                ],

                '&:disabled:not(.disable),&.disabled': { // if ctrl was disabled programatically
                    // customize the anim:
                    [vars.animFn]: [
                        ecssProps.anim,
                        getVar(vars.animEnabledDisabled), // 1st : ctrl already disabled, move to the least priority
                        getVar(vars.animHoverLeave),      // 2nd : cursor leaved, should not happened, move to low priority
                        getVar(vars.animFocusBlur),       // 3rd : ctrl lost focus, might happened programaticaly, move to low priority (can interrupt hover/leave)
                        getVar(vars.animActivePassive),   // 4th : ctrl deactivated programatically, move to moderate priority (can interrupt focus/blur)
                    ],
                },
            },
            '&.actived': {extend:[ // if ctrl was activated programatically, disable the animation
                stateNoAnimStartup(),
            ]},
        },
        stateDisabled({ '&:active:not(.active):not(.actived)': { // if disabled => cannot be activated by mouse/keyboard (but can be activated programatically)
            [vars.filterActivePassive]            : ecssProps.filterNone,
            [vars.animActivePassive]              : ecssProps.animNone,
        }}),
    ],
});

const styles = {
    main: {
        extend: [
            stipOuts.control,           // clear browser's default styles
            Elements.styles.main,       // copy styles from Element, including Element's cssProps & Element's states. NOT copy from Indicators.styles.main because Indicator's states are too different than our states - we also overrides some Indicator's state mixins.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Element:
        (Elements.styles as any)[themeProp],
    ],


    // customize the box-shadow at focused state:
    [vars.boxShadowFocusFn]: [[
        cssProps.boxShadowFocus,
        (colors as any)[`${theme}Transp`],
    ]],
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export function useStateLeave(stateEnabledDisabled: {enabled:boolean}) {
    const [hasHover, setHasHover] = useState(false);
    const [leaving,  setLeaving ] = useState(false);


    useEffect(() => {
        if (hasHover && (!stateEnabledDisabled.enabled)) {
            // loosing hover because of the control has been disabled

            setHasHover(false); // mark has leave
            setLeaving(true);   // start leaving anim
        } // if
    }, [hasHover, stateEnabledDisabled.enabled]);
    

    const handleHover = () => {
        if (hasHover) return; // already has hover => action is not required

        if (leaving) setLeaving(false); // stop leaving anim
        setHasHover(true);              // mark has hover
    }
    const handleLeaving = () => {
        if (leaving) return; // already being leaving => action is not required

        if (hasHover) setHasHover(false); // mark has leave
        setLeaving(true);                 // start leaving anim
    }
    const handleIdle = () => {
        // clean up expired animations

        if (leaving) setLeaving(false);
    }
    return {
        class: leaving ? 'leave': null,
        handleMouseEnter   : handleHover,
        handleMouseLeave   : handleLeaving,
        handleAnimationEnd : handleIdle,
    };
}

export function useStateFocusBlur(props: Props, stateEnabledDisabled: {enabled:boolean}) {
    const defaultManualFocused = false; // if [focus] was not specified => the default value is focus=false
    const [focused,  setFocused ] = useState((props.focus ?? defaultManualFocused) && stateEnabledDisabled.enabled);
    const [hasFocus, setHasFocus] = useState(false);
    const [blurring, setBlurring] = useState(false);


    const newFocus = (props.focus ?? defaultManualFocused) && stateEnabledDisabled.enabled;
    useEffect(() => {
        if (focused !== newFocus) {
            setFocused(newFocus);

            if (newFocus) { // has got focus
                setBlurring(false); // stop blurring anim
                setHasFocus(true);  // mark has focus
            }
            else { // has lost focus
                setHasFocus(false); // mark has blur
                setBlurring(true);  // start blurring anim
            } // if
        }
        else if (hasFocus && (!stateEnabledDisabled.enabled)) {
            // loosing focus because of the control has been disabled

            setHasFocus(false); // mark has blur
            setBlurring(true);  // start blurring anim
        } // if
    }, [focused, newFocus, hasFocus, stateEnabledDisabled.enabled]);


    const handleFocus = () => {
        if (focused) return; // already beed focused programatically => cannot be blurred by mouse/keyboard
        if (hasFocus) return; // already has focus => action is not required

        if (blurring) setBlurring(false); // stop blurring anim
        setHasFocus(true);                // mark has focus
    }
    const handleBlurring = () => {
        if (focused) return; // already beed focused programatically => cannot be blurred by mouse/keyboard
        if (blurring) return; // already being blurring => action is not required

        if (hasFocus) setHasFocus(false); // mark has blur
        setBlurring(true);                // start blurring anim
    }
    const handleIdle = () => {
        // clean up expired animations

        if (blurring) setBlurring(false);
    }
    return {
        class: blurring ? 'blur' : ((focused && stateEnabledDisabled.enabled) ? 'focus' : null),
        handleFocus        : handleFocus,
        handleBlur         : handleBlurring,
        handleAnimationEnd : handleIdle,
    };
}

export interface Props
    extends
        Indicators.Props
{
    focus?:   boolean
}
export default function Control(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis    = useStateEnabledDisabled(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);

    

    return (
        <button className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
            ].join(' ')}

            disabled={stateEnbDis.disabled}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateFocusBlur.handleFocus}
            onBlur={stateFocusBlur.handleBlur}
            onMouseDown={stateActPass.handleMouseDown}
            onKeyDown={stateActPass.handleKeyDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateLeave.handleAnimationEnd();
                stateFocusBlur.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Control'}
        </button>
    );
}