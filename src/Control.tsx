import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Indicator';
import colors              from './colors';
import * as stripOuts      from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,

    filterValidProps, filterPrefixProps,
    
    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface CssProps {
    cursor             : Css.Cursor
    cursorDisable      : Css.Cursor
    
    
    // anim props:

    boxShadowFocus     : Css.BoxShadow

    filterHover        : Css.Filter

    '@keyframes hover' : Css.Keyframes
    '@keyframes leave' : Css.Keyframes
    '@keyframes focus' : Css.Keyframes
    '@keyframes blur'  : Css.Keyframes
    animHover          : Css.Animation
    animLeave          : Css.Animation
    animFocus          : Css.Animation
    animBlur           : Css.Animation
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Object.assign({}, Indicators.vars, {
    /**
     * themed box-shadow at focused state.
     */
    boxShadowFocusTh    : '--ctrl-boxShadowFocusTh',

    /**
     * conditional box-shadow at focused state.
     */
    boxShadowFocusIfIf  : '--ctrl-boxShadowFocusIfIf',

    /**
     * conditional unthemed box-shadow at focused state.
     */
    boxShadowFocusIf    : '--ctrl-boxShadowFocusIf',

    /**
     * final box-shadow at focused state.
     */
    boxShadowFocusFn    : '--ctrl-boxShadowFocusFn',

    
    // anim props:

    // filterHoverLeave : '--ctrl-filterHoverLeave', // already defined in Indicator
    animHoverLeave      : '--ctrl-animHoverLeave',
    
    boxShadowFocusBlur  : '--ctrl-boxShadowFocusBlur',
    animFocusBlur       : '--ctrl-animFocusBlur',
});

// re-defined later, we need to construct varProps first
export const keyframesHover = { from: undefined, to: undefined };
export const keyframesLeave = { from: undefined, to: undefined };
export const keyframesFocus = { from: undefined, to: undefined };
export const keyframesBlur  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    cursor             : 'pointer',
    cursorDisable      : 'not-allowed',


    // anim props:
    
    boxShadowFocus     : [[0, 0, 0, '0.25rem']],

    filterHover        : [['brightness(85%)']],

    '@keyframes hover' : keyframesHover,
    '@keyframes leave' : keyframesLeave,
    '@keyframes focus' : keyframesFocus,
    '@keyframes blur'  : keyframesBlur,
    animHover          : [['150ms', 'ease-out', 'both', keyframesHover]],
    animLeave          : [['300ms', 'ease-out', 'both', keyframesLeave]],
    animFocus          : [['150ms', 'ease-out', 'both', keyframesFocus]],
    animBlur           : [['300ms', 'ease-out', 'both', keyframesBlur ]],
};



Object.assign(keyframesHover, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnableDisable), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            // getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnableDisable), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave),    // first priority, serving smooth responsiveness
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



export const stateHover         = (content: object) => ({
    '&:hover,&:focus': { // hover or focus
        extend: [content]
    }
});
export const stateNotHover      = (content: object) => ({
    '&:not(:hover):not(:focus)': { // not-hover and not-focus
        extend: [content]
    }
});
export const stateLeaving       = (content: object) =>
    stateNotHover({ // not-hover and not-focus and (leave or blur)
        extend:[{'&.leave,&.blur': {
            extend: [content]
        }}]
    });
export const stateNotLeave      = (content: object) => ({
    '&:not(.leave):not(.blur)': { // not-leave and not-blur
        extend: [content]
    }
});
export const stateHoverLeave    = (content: object) => ({
    '&:hover,&:focus,&.leave,&.blur': { // hover or focus or leave or blur
        extend: [content]
    }
});
export const stateNotHoverLeave = (content: object) => ({
    '&:not(:hover):not(:focus):not(.leave):not(.blur)': { // not-hover and not-focus and not-leave and not-blur
        extend: [content]
    }
});

export const stateFocus         = (content: object) => ({
    '&.focus,&:focus': {
        extend: [content]
    }
});
export const stateNotFocus      = (content: object) => ({
    '&:not(.focus):not(:focus)': {
        extend: [content]
    }
});
export const stateBlurring      = (content: object) => ({
    '&.blur': {
        extend: [content]
    }
});
export const stateNotBlur       = (content: object) => ({
    '&:not(.blur)': {
        extend: [content]
    }
});
export const stateFocusBlur     = (content: object) => ({
    '&:focus,&.focus,&.blur': {
        extend: [content]
    }
});
export const stateNotFocusBlur  = (content: object) => ({
    '&:not(:focus):not(.focus):not(.blur)': {
        extend: [content]
    }
});

// override base: non-pseudo + pseudo active
export const stateActivating               = (content: object) => ({
    '&.active': {
        extend: [content]
    }
});
export const stateActive                   = (content: object) => ({
    '&.active,&.actived,&:active:not(.disable):not(.disabled):not(:disabled)': {
        extend: [content]
    }
});
export const stateNotActive                = (content: object) => ({
    '&:not(.active):not(.actived):not(:active), &:not(.active):not(.actived).disable, &:not(.active):not(.actived).disabled, &:not(.active):not(.actived):disabled': {
        extend: [content]
    }
});
export const statePassivating              = (content: object) => ({
    '&.passive': {
        extend: [content]
    }
});
export const stateNotPassive               = (content: object) => ({
    '&:not(.passive)': {
        extend: [content]
    }
});
export const stateActivePassive            = (content: object) => ({
    '&.active,&.actived,&:active:not(.disable):not(.disabled):not(:disabled),&.passive': {
        extend: [content]
    }
});
export const stateNotActivePassive         = (content: object) => ({
    '&:not(.active):not(.actived):not(:active):not(.passive), &:not(.active):not(.actived).disable:not(.passive), &:not(.active):not(.actived).disabled:not(.passive), &:not(.active):not(.actived):disabled:not(.passive)': {
        extend: [content]
    }
});
export const stateNotActivatingPassivating = (content: object) => ({
    '&:not(.active):not(.passive)': {
        extend: [content]
    }
});

// override base: pseudo + non-pseudo active
export const stateNoAnimStartup = () =>
    stateNotEnablingDisabling(
        stateNotActivatingPassivating(
            stateNotHoverLeave(
                stateNotFocusBlur({
                    animationDuration: [['0ms'], '!important'],
                })
            )
        )
    );



const fnVars = {extend:[ Elements.fnVars, { // copy Element's fnVars
    // customize final box-shadow at focused state:
    [vars.boxShadowFocusFn]: [[
        cssProps.boxShadowFocus,
        getVar(
            vars.boxShadowFocusIfIf, // first  priority
            vars.boxShadowFocusTh,   // second priority
            vars.boxShadowFocusIf    // third  priority
        )
    ]],



    // customize the anim:
    [vars.animFn]: [
        ecssProps.anim,
        getVar(vars.animEnableDisable), // 1st : ctrl must be enable
        getVar(vars.animHoverLeave),    // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),     // 3rd : ctrl got focused (can interrupt hover/leave)
        getVar(vars.animActivePassive), // 4th : ctrl got pressed (can interrupt focus/blur)
    ],

    '&.active,&.actived': { // if activated programmatically (not by user input)
        // customize the anim:
        [vars.animFn]: [
            ecssProps.anim,
            getVar(vars.animActivePassive), // 1st : ctrl already pressed, move to the least priority
            getVar(vars.animHoverLeave),    // 2nd : cursor leaved
            getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus (can interrupt hover/leave)
            getVar(vars.animEnableDisable), // 4th : ctrl enable/disable (can interrupt focus/blur)
        ],

        '&.disabled,&:disabled:not(.disable)': { // if ctrl was disabled programatically
            // customize the anim:
            [vars.animFn]: [
                ecssProps.anim,
                getVar(vars.animEnableDisable), // 1st : ctrl already disabled, move to the least priority
                getVar(vars.animHoverLeave),    // 2nd : cursor leaved, should not happened, move to low priority
                getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus, might happened programaticaly, move to low priority (can interrupt hover/leave)
                getVar(vars.animActivePassive), // 4th : ctrl deactivated programatically, move to moderate priority (can interrupt focus/blur)
            ],
        },
    },
}]};
const states = {extend:[ Elements.states, { // not copy from Indicator's states because Indicator's states are too different than our states - we also overrides some Indicator's state mixins.
    // apply inactive (secondary) colors:
    [vars.colorIf]             : colors.secondaryText,
    [vars.backgIf]             : `linear-gradient(${colors.secondary},${colors.secondary})`,
    [vars.colorOutlineIf]      : colors.secondary,
    // [vars.boxShadowFocusIf] : colors.secondaryTransp, // focus boxShadow never reach inactive (secondary) color

    // define active (primary) colors:
    [vars.colorIfAct]          : colors.primaryText,
    [vars.backgIfAct]          : `linear-gradient(${colors.primary},${colors.primary})`,
    [vars.colorOutlineIfAct]   : colors.primary,
    [vars.boxShadowFocusIf]    : colors.primaryTransp,



    // all initial states are none:

    [vars.filterEnableDisable] : ecssProps.filterNone,
    [vars.animEnableDisable]   : ecssProps.animNone,

    [vars.filterHoverLeave]    : ecssProps.filterNone,
    [vars.animHoverLeave]      : ecssProps.animNone,

    [vars.boxShadowFocusBlur]  : ecssProps.boxShadowNone,
    [vars.animFocusBlur]       : ecssProps.animNone,

    [vars.filterActivePassive] : ecssProps.filterNone,
    [vars.animActivePassive]   : ecssProps.animNone,

    // specific states:
    extend:[
        stateEnableDisable({ // [enabling, disabling, disabled]
            [vars.filterEnableDisable]            : icssProps.filterDisable,
        }),
        stateEnable({ // [enabling]
            [vars.animEnableDisable]              : icssProps.animEnable,
        }),
        stateDisable({ // [disabling, disabled]
            [vars.animEnableDisable]              : icssProps.animDisable,
            cursor     : cssProps.cursorDisable,
            userSelect : none,
        }),
        { // [disabled]
            '&.disabled,&:disabled:not(.disable)' : // if ctrl was disabled programatically, disable first animation
                stateNoAnimStartup(),
        },


        stateLeaving({
            [vars.filterHoverLeave]       : cssProps.filterHover,
            [vars.animHoverLeave]         : cssProps.animLeave,
        }),
        stateBlurring({
            [vars.boxShadowFocusBlur]     : getVar(vars.boxShadowFocusFn),
            [vars.animFocusBlur]          : cssProps.animBlur,
        }),
        stateNotDisable({extend:[
            // state hover & focus are possible when enabled
            stateHover({
                [vars.filterHoverLeave]   : cssProps.filterHover,
                [vars.animHoverLeave]     : cssProps.animHover,

                // apply active (primary) colors:
                [vars.colorIf]            : getVar(vars.colorIfAct),
                [vars.backgIf]            : getVar(vars.backgIfAct),
                [vars.colorOutlineIf]     : getVar(vars.colorOutlineIfAct),
            }),
            stateFocus({
                [vars.boxShadowFocusBlur] : getVar(vars.boxShadowFocusFn),
                [vars.animFocusBlur]      : cssProps.animFocus,

                // apply active (primary) colors:
                [vars.colorIf]            : getVar(vars.colorIfAct),
                [vars.backgIf]            : getVar(vars.backgIfAct),
                [vars.colorOutlineIf]     : getVar(vars.colorOutlineIfAct),
            }),
        ]}),
        


        stateActivePassive({ // [activating, actived, passivating]
            [vars.filterActivePassive]            : icssProps.filterActive,
        }),
        stateActive({ // [activating, actived]
            [vars.animActivePassive]              : icssProps.animActive,

            // apply active (primary) colors:
            [vars.colorIf]        : getVar(vars.colorIfAct),
            [vars.backgIf]        : getVar(vars.backgIfAct),
            [vars.colorOutlineIf] : getVar(vars.colorOutlineIfAct),
        }),
        statePassivating({ // [passivating]
            [vars.animActivePassive]              : icssProps.animPassive,
        }),
        {
            // [actived]
            '&.actived': // // if activated programmatically (not by user input), disable the animation
                stateNoAnimStartup(),
        },



        fnVars,
    ],
}]};

const styles = {
    basic: {
        extend: [
            stripOuts.control,          // clear browser's default styles
            Indicators.styles.basic,    // copy styles from Indicator
            filterValidProps(cssProps), // apply our filtered cssProps
        ],
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
    outline: {
        extend:[
            stateNotActive({
                '&:not(:hover):not(:focus), &:disabled,&.disabled':
                    Elements.styles.outline,
            }),
        ],
    },
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Element:
        (Elements.styles as any)[themeProp],
    ],


    // customize themed box-shadow at focused state:
    [vars.boxShadowFocusTh]: (colors as any)[`${theme}Transp`],
}));

const useStyles = createUseStyles(styles);
export { fnVars, states, styles, useStyles };



export function useStateLeave(stateEnbDis: {enabled: boolean}) {
    const [hasHover, setHasHover] = useState(false);
    const [leaving,  setLeaving ] = useState(false);


    useEffect(() => {
        if (hasHover && (!stateEnbDis.enabled)) {
            // loosing hover because of the control has been disabled

            setHasHover(false); // mark has leave
            setLeaving(true);   // start leaving anim
        } // if
    }, [hasHover, stateEnbDis.enabled]);
    

    const handleHover = () => {
        if (!stateEnbDis.enabled) return; // control disabled => no response
        if (hasHover) return; // already has hover => action is not required

        if (leaving) setLeaving(false); // stop leaving anim

        setHasHover(true); // mark has hover
    }
    const handleLeaving = () => {
        if (!stateEnbDis.enabled) return; // control disabled => no response
        if (leaving) return; // already being leaving => action is not required

        if (hasHover) {
            setHasHover(false); // mark has leave

            // leaving only possible if was hovered:
            setLeaving(true); // start leaving anim
        } // if
    }
    const handleIdle = () => {
        // clean up expired animations

        if (leaving) setLeaving(false);
    }
    return {
        class: leaving ? 'leave': null,
        handleMouseEnter   : handleHover,
        handleMouseLeave   : handleLeaving,
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(leave)|(?<=[a-z])(Leave))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
    };
}

export function useStateFocusBlur(props: Props, stateEnbDis: {enabled: boolean}) {
    const defaultManualFocused = false; // if [focus] was not specified => the default value is focus=false
    const [focused,  setFocused ] = useState((props.focus ?? defaultManualFocused) && stateEnbDis.enabled);
    const [hasFocus, setHasFocus] = useState(false);
    const [blurring, setBlurring] = useState(false);


    const newFocus = (props.focus ?? defaultManualFocused) && stateEnbDis.enabled;
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
        else if (hasFocus && (!stateEnbDis.enabled)) {
            // loosing focus because of the control has been disabled

            setHasFocus(false); // mark has blur
            setBlurring(true);  // start blurring anim
        } // if
    }, [focused, newFocus, hasFocus, stateEnbDis.enabled]);


    const handleFocus = () => {
        if (!stateEnbDis.enabled) return; // control disabled => no response
        if (focused) return; // already beed focused programatically => cannot be blurred by mouse/keyboard
        if (hasFocus) return; // already has focus => action is not required

        if (blurring) setBlurring(false); // stop blurring anim

        setHasFocus(true); // mark has focus
    }
    const handleBlurring = () => {
        if (!stateEnbDis.enabled) return; // control disabled => no response
        if (focused) return; // already beed focused programatically => cannot be blurred by mouse/keyboard
        if (blurring) return; // already being blurring => action is not required

        if (hasFocus) {
            setHasFocus(false); // mark has blur

            // blurring only possible if was focused:
            setBlurring(true); // start blurring anim
        } // if
    }
    const handleIdle = () => {
        // clean up expired animations

        if (blurring) setBlurring(false);
    }
    return {
        /**
         * partially/fully focus
        */
        focus  : hasFocus,

        class: blurring ? 'blur' : ((focused && stateEnbDis.enabled) ? 'focus' : null),
        handleFocus        : handleFocus,
        handleBlur         : handleBlurring,
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(blur)|(?<=[a-z])(Blur))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
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

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);

    

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
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateLeave.handleAnimationEnd(e);
                stateFocusBlur.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Control'}
        </button>
    );
}