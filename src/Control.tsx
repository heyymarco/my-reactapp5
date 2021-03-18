import type * as Css       from './Css';

import
    React, {
    useState
}                          from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

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
    
    defineThemes, defineSizes,

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
export const vars = {...Indicators.vars,
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
};

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
    '&:hover,&.focus,&:focus': {
        extend: [content]
    }
});
export const stateNotHover      = (content: object) => ({
    '&:not(:hover):not(.focus):not(:focus)': {
        extend: [content]
    }
});
export const stateLeaving       = (content: object) =>
    // mouse leave but still focus => not leave
    // blur but mouse  still hover => not leave
    stateNotHover({
        extend:[{'&.leave,&.blur': {
            extend: [content]
        }}]
    });
export const stateNotLeave      = (content: object) => ({
    '&:not(.leave):not(.blur)': {
        extend: [content]
    }
});
export const stateHoverLeave    = (content: object) => ({
    '&:hover,&.focus,&:focus,&.leave,&.blur': {
        extend: [content]
    }
});
export const stateNotHoverLeave = (content: object) => ({
    '&:not(:hover):not(.focus):not(:focus):not(.leave):not(.blur)': {
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
    '&.focus,&:focus,&.blur': {
        extend: [content]
    }
});
export const stateNotFocusBlur  = (content: object) => ({
    '&:not(.focus):not(:focus):not(.blur)': {
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
export const applyStateNoAnimStartup = () =>
    stateNotEnablingDisabling(
        stateNotActivatingPassivating(
            stateNotHoverLeave(
                stateNotFocusBlur({
                    animationDuration: [['0ms'], '!important'],
                })
            )
        )
    );
export const applyStateActive = () => ({
    // apply active (primary) colors:
    [vars.colorIf]          : getVar(vars.colorIfAct),
    [vars.backgIf]          : getVar(vars.backgIfAct),
    [vars.colorOutlineIf]   : getVar(vars.colorOutlineIfAct),
    [vars.boxShadowFocusIf] : colors.primaryTransp,
});



export const themes = {extend:[ Indicators.themes, ]}; // copy Indicator's themes
defineThemes(themes, (theme, Theme, themeProp, themeColor) => ({
    // customize themed box-shadow at focused state:
    [vars.boxShadowFocusTh]: (colors as any)[`${theme}Transp`],
}));

export const sizes  = Indicators.sizes;                // copy Indicator's sizes


export const themesIf = {extend:[ Indicators.themesIf, { // copy Indicator's themesIf
    // define default (secondary) colors:
    [vars.colorIf]                : colors.secondaryText,
    [vars.backgIf]                : `linear-gradient(${colors.secondary},${colors.secondary})`,
    [vars.colorOutlineIf]         : colors.secondary,
    [vars.boxShadowFocusIf]       : colors.secondaryTransp,
}]};
export const fnVars = {extend:[ Elements.fnVars, { // copy Element's fnVars
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
export const states = {extend:[ Elements.states, { // not copy from Indicator's states because Indicator's states are too different than our states - we also overrides some Indicator's state mixins.
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
                applyStateNoAnimStartup(),
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

                extend:[
                    applyStateActive(),
                ],
            }),
            stateFocus({
                [vars.boxShadowFocusBlur] : getVar(vars.boxShadowFocusFn),
                [vars.animFocusBlur]      : cssProps.animFocus,

                extend:[
                    applyStateActive(),
                ],
            }),
        ]}),
        


        stateActivePassive({ // [activating, actived, passivating]
            [vars.filterActivePassive]            : icssProps.filterActive,
        }),
        stateActive({ // [activating, actived]
            [vars.animActivePassive]              : icssProps.animActive,

            extend:[
                applyStateActive(),
            ],
        }),
        statePassivating({ // [passivating]
            [vars.animActivePassive]              : icssProps.animPassive,
        }),
        {
            // [actived]
            '&.actived': // // if activated programmatically (not by user input), disable the animation
                applyStateNoAnimStartup(),
        },



        themesIf,
        fnVars,
    ],
}]};


export const basicStyle = {
    extend: [
        stripOuts.control,          // clear browser's default styles
        Indicators.basicStyle,      // copy basicStyle from Indicator
        filterValidProps(cssProps), // apply our filtered cssProps
    ],
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
    outline: {
        extend:[
            stateNotActive({
                '&:not(:hover):not(:focus), &:disabled,&.disabled':
                    Elements.styles.outline,
            }),
        ],
    },
};
export const useStyles = createUseStyles(styles);



export function useStateLeave(stateEnbDis: {enabled: boolean}) {
    const [hovered, setHovered] = useState(false);
    const [leaving, setLeaving] = useState(false);


    const handleChangeInternal = (newHover: boolean) => {
        if (hovered !== newHover) { // changes detected => apply the changes & start animating
            setHovered(newHover);
    
            if (newHover) {
                setLeaving(false); // stop  leaving anim
            }
            else {
                setLeaving(true);  // start leaving anim
            } // if
        }
    }


    if (!stateEnbDis.enabled && hovered) {
        // loosing hover because of the control has been disabled
        handleChangeInternal(/*newHover =*/false);
    } // if
    

    const handleHover = () => {
        // control disabled => no response
        // onMouseEnter can be triggered by custom control, because it doesn't have "native :disabled" state
        if (!stateEnbDis.enabled) return;

        handleChangeInternal(/*newHover =*/true);
    }
    const handleLeaving = () => {
        // control disabled => no response
        // onMouseLeave can be triggered by custom control, because it doesn't have "native :disabled" state
        if (!stateEnbDis.enabled) return;

        handleChangeInternal(/*newHover =*/false);
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
    const defaultFocused = false; // if [focus] was not specified => the default value is focus=false
    const [focused,  setFocused ] = useState((props.focus ?? defaultFocused) && stateEnbDis.enabled);
    const [blurring, setBlurring] = useState(false);


    const handleChangeInternal = (newFocus: boolean) => {
        if (focused !== newFocus) { // changes detected => apply the changes & start animating
            setFocused(newFocus);
    
            if (newFocus) {
                setBlurring(false); // stop  blurring anim
            }
            else {
                setBlurring(true);  // start blurring anim
            } // if
        }
    }


    if (stateEnbDis.enabled) {
        if (props.focus !== undefined) { // controllable prop => watch the changes
            handleChangeInternal(/*newFocus =*/props.focus);
        }
    }
    else {
        // loosing focus because of the control has been disabled
        handleChangeInternal(/*newFocus =*/false);
    } // if


    const handleFocus = () => {
        if (props.focus !== undefined) return; // controllable prop => let the prop determines the state

        // control disabled => no response
        // onFocus can be triggered by custom control, because it doesn't have "native :disabled" state
        if (!stateEnbDis.enabled) return;
        
        handleChangeInternal(/*newFocus =*/true);
    }
    const handleBlurring = () => {
        if (props.focus !== undefined) return; // controllable prop => let the prop determines the state

        // control disabled => no response
        // onBlur can be triggered by custom control, because it doesn't have "native :disabled" state
        if (!stateEnbDis.enabled) return;
        
        handleChangeInternal(/*newFocus =*/false);
    }
    const handleIdle = () => {
        // clean up expired animations

        if (blurring) setBlurring(false);
    }
    return {
        /**
         * partially/fully focus
        */
        focus  : focused,

        class: blurring ? 'blur' : (focused ? ((props.focus !== undefined) ? 'focus' : null) : null),
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
    // accessibility:
    focus?:   boolean
}
export default function Control(props: Props) {
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     =          useStyles();

    // themes:
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles);
    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    // states:
    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);

    

    return (
        <button className={[
                ctrlStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,

                // states:
                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
            ].join(' ')}

            // accessibility:
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