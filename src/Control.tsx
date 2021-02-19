import
    React, {
    useState,
    useEffect }            from 'react';

import
    * as Elements          from './Element';
import {
    stateEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled,
    stateHover, stateLeave, stateHoverLeave,
    filterValidProps,
}                          from './Element';
import colors              from './colors';
import stipOuts            from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export interface CssProps {
    boxShadowFocus        : (number|string)[][]

    cursor                : string
    cursorDisabled        : string

    filterDisabled        : string | string[][]
    filterHover           : string | string[][]
    filterActive          : string | string[][]

    '@keyframes enabled'  : object
    '@keyframes disabled' : object
    '@keyframes hover'    : object
    '@keyframes leave'    : object
    '@keyframes focus'    : object
    '@keyframes blur'     : object
    '@keyframes active'   : object
    '@keyframes passive'  : object

    animEnabled           : string | (string | object)[][]
    animDisabled          : string | (string | object)[][]
    animHover             : string | (string | object)[][]
    animLeave             : string | (string | object)[][]
    animFocus             : string | (string | object)[][]
    animBlur              : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    filterEnabledDisabled : '--ctrl-filterEnabledDisabled',
    filterHoverLeave      : '--ctrl-filterHoverLeave',
    filterActivePassive   : '--ctrl-filterActivePassive',
    boxShadowFocusTheme   : '--ctrl-boxShadowFocus-theme',
    animEnabledDisabled   : '--ctrl-animEnabledDisabled',
    animHoverLeave        : '--ctrl-animHoverLeave',
    animFocusBlur         : '--ctrl-animFocusBlur',
    animActivePassive     : '--ctrl-animActivePassive',
};

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesEnabled  = { from: undefined, to: undefined };
const keyframesDisabled = { from: undefined, to: undefined };
const keyframesHover    = { from: undefined, to: undefined };
const keyframesLeave    = { from: undefined, to: undefined };
const keyframesFocus    = { from: undefined, to: undefined };
const keyframesBlur     = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const cssProps: CssProps = {
    boxShadowFocus        : [[0, 0, 0, '0.2rem']],

    cursor                : 'pointer',
    cursorDisabled        : 'not-allowed',

    filterDisabled        : [['grayscale(50%)',  'opacity(50%)'  ]],
    filterHover           : Elements.cssProps.filterHover,
    filterActive          : [['brightness(65%)', 'contrast(150%)']],

    '@keyframes enabled'  : keyframesEnabled,
    '@keyframes disabled' : keyframesDisabled,
    '@keyframes hover'    : keyframesHover,
    '@keyframes leave'    : keyframesLeave,
    '@keyframes focus'    : keyframesFocus,
    '@keyframes blur'     : keyframesBlur,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animEnabled           : [['300ms', 'ease-out', 'both', keyframesEnabled ]],
    animDisabled          : [['300ms', 'ease-out', 'both', keyframesDisabled]],
    animHover             : [['150ms', 'ease-out', 'both', keyframesHover   ]],
    animLeave             : [['300ms', 'ease-out', 'both', keyframesLeave   ]],
    animFocus             : [['150ms', 'ease-out', 'both', keyframesFocus   ]],
    animBlur              : [['300ms', 'ease-out', 'both', keyframesBlur    ]],
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive ]],
};

Object.assign(keyframesDisabled, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, but now become the second priority
            // getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, but now become the second priority
            getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
        ]],
    }
});
Object.assign(keyframesEnabled, {
    from : keyframesDisabled.to,
    to   : keyframesDisabled.from
});

Object.assign(keyframesHover, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            // getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
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
            Elements.cssProps.boxShadow,
            // getVar(vars.boxShadowFocusTheme),
        ]]],
    },
    to: {
        boxShadow: [[[
            Elements.cssProps.boxShadow,
            getVar(vars.boxShadowFocusTheme),
        ]]],
    }
});
Object.assign(keyframesBlur, {
    from : keyframesFocus.to,
    to   : keyframesFocus.from
});

Object.assign(keyframesActive, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            // getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    }
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ctrl'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const stateFocus              = (content: object) => ({
    '&:focus,&.focus': {
        extend: [content]
    }
});
const stateNotFocus           = (content: object) => ({
    '&:not(:focus):not(.focus)': {
        extend: [content]
    }
});
const stateBlur              = (content: object) => ({
    '&.blur': {
        extend: [content]
    }
});
const stateNotBlur           = (content: object) => ({
    '&:not(.blur)': {
        extend: [content]
    }
});
const stateFocusBlur         = (content: object) => ({
    '&:focus,&.focus,&.blur': {
        extend: [content]
    }
});
const stateNotFocusBlur      = (content: object) => ({
    '&:not(:focus):not(.focus):not(.blur)': {
        extend: [content]
    }
});

const stateActive            = (content: object) => ({
    '&:active,&.active,&.actived': {
        extend: [content]
    }
});
const stateNotActive         = (content: object) => ({
    '&:not(:active):not(.active):not(.actived)': {
        extend: [content]
    }
});
const statePassive           = (content: object) => ({
    '&.passive': {
        extend: [content]
    }
});
const stateNotPassive        = (content: object) => ({
    '&:not(.passive)': {
        extend: [content]
    }
});
const stateActivePassive     = (content: object) => ({
    '&:active,&.active,&.actived,&.passive': {
        extend: [content]
    }
});
const stateNotActivePassive  = (content: object) => ({
    '&:not(:active):not(.active):not(.actived):not(.passive)': {
        extend: [content]
    }
});

const stateNoAnimStartup  = () =>
    Elements.stateNotEnabled/*Disabled*/({extend:[
        Elements.stateNotHoverLeave({extend:[
            stateNotFocusBlur({
                animationDuration: [['0ms'], '!important'],
            }),
        ]}),
    ]});

const mixins = {
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive,
    stateNoAnimStartup,
};
export {
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive,
    stateNoAnimStartup,
};
export { mixins };



const states = {
    [vars.filterEnabledDisabled]   : Elements.cssProps.filterNone,
    [vars.filterHoverLeave]        : Elements.cssProps.filterNone,
    [vars.filterActivePassive]     : Elements.cssProps.filterNone,

    [vars.animEnabledDisabled]     : Elements.cssProps.animNone,
    [Elements.vars.animHoverLeave] : undefined, // delete
    [vars.animHoverLeave]          : Elements.cssProps.animNone,
    [vars.animFocusBlur]           : Elements.cssProps.animNone,
    [vars.animActivePassive]       : Elements.cssProps.animNone,

    anim: [
        Elements.cssProps.anim,
        getVar(vars.animEnabledDisabled), // 1st : ctrl must be enabled
        getVar(vars.animHoverLeave),      // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),       // 3rd : ctrl got focused
        getVar(vars.animActivePassive),   // 4th : ctrl got pressed
    ],


    extend:[
        stateEnabledDisabled({
            [vars.filterEnabledDisabled]       : varProps.filterDisabled,
        }),
        stateEnabled({
            [vars.animEnabledDisabled]         : varProps.animEnabled,
        }),
        stateDisabled({
            [vars.animEnabledDisabled]         : varProps.animDisabled,
            cursor: varProps.cursorDisabled,
        }),
        {
            '&:disabled:not(.disabled)'  : {extend:[ // if ctrl was disabled at the first page load, disable first animation
                stateNoAnimStartup(),
            ]},
        },


        stateNotDisabled({extend:[
            stateHoverLeave({
                [vars.filterHoverLeave]        : varProps.filterHover,
            }),
            stateHover({
                [Elements.vars.animHoverLeave] : undefined, // delete
                [vars.animHoverLeave]          : varProps.animHover,
            }),
            stateLeave({
                [Elements.vars.animHoverLeave] : undefined, // delete
                [vars.animHoverLeave]          : varProps.animLeave,
            }),


            stateFocus({
                [vars.animFocusBlur]           : varProps.animFocus,
            }),
            stateBlur({
                [vars.animFocusBlur]           : varProps.animBlur,
            }),


            stateActivePassive({
                [vars.filterActivePassive]     : varProps.filterActive,
            }),
            stateActive({
                [vars.animActivePassive]       : varProps.animActive,
            }),
            statePassive({
                [vars.animActivePassive]       : varProps.animPassive,
            }),
            {
                '&.active,&.actived': { // if activated programmatically (not by user input)
                    anim: [
                        Elements.cssProps.anim,
                        getVar(vars.animActivePassive),   // 1st : ctrl already pressed, then released
                        getVar(vars.animHoverLeave),      // 2nd : cursor leaved
                        getVar(vars.animFocusBlur),       // 3nd : ctrl lost focus
                        getVar(vars.animEnabledDisabled), // 4th : ctrl disabled
                    ],
                },
                '&.actived': {extend:[ // if ctrl was activated at the first page load, disable first animation
                    stateNoAnimStartup(),
                ]},
            },
        ]}),
    ],
};

const styles = {
    main: {
        extend: [
            stipOuts.control,
            Elements.styles.main,
            filterValidProps(varProps),
            states,
        ],
    },
};

Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        (Elements.styles as any)[themeProp],
    ],
    [vars.boxShadowFocusTheme]: [[
        varProps.boxShadowFocus,
        (colors as any)[`${theme}Transp`],
    ]],
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export function useStateEnabledDisabled(props: Props) {
    const defaultEnabled = true; // if [enabled] was not specified => the default value is enabled=true
    const [enabled,   setEnabled  ] = useState(props.enabled ?? defaultEnabled);
    const [enabling,  setEnabling ] = useState(false);
    const [disabling, setDisabling] = useState(false);

    
    const newEnabled = props.enabled ?? defaultEnabled;
    useEffect(() => {
        if (enabled !== newEnabled) {
            setEnabled(newEnabled);

            if (newEnabled) {
                setDisabling(false);
                setEnabling(true);
            }
            else {
                setEnabling(false);
                setDisabling(true);
            }
        }
    }, [enabled, newEnabled]);

    
    const handleIdle = () => {
        // clean up expired animations

        if (enabling)  setEnabling(false);
        if (disabling) setDisabling(false);
    }
    return {
        enabled: enabled,
        disabled: !enabled,
        class: (enabling? 'enabled' : (disabling ? 'disabled': null)),
        handleAnimationEnd : handleIdle,
    };
}

export function useStateFocusBlur(props: Props, stateEnabledDisabled: {enabled:boolean}) {
    const defaultManualFocused = false; // if [focus] was not specified => the default value is focus=false
    const [focused,  setFocused ] = useState(props.focus ?? defaultManualFocused);
    const [blurring, setBlurring] = useState(false);

    const newFocus = props.focus ?? defaultManualFocused;
    useEffect(() => {
        if (focused !== newFocus) {
            setFocused(newFocus);

            if (newFocus) {
                setBlurring(false);
            }
            else {
                if (stateEnabledDisabled.enabled) {
                    setBlurring(true);
                }
            }
        }
    }, [focused, newFocus, stateEnabledDisabled.enabled]);

    const handleBlurring = () => { if (!blurring) setBlurring(true);  }
    const handleIdle     = () => { if (blurring)  setBlurring(false); }
    return {
        class: (!blurring) ? (focused ? 'focus' : null) : (blurring ? 'blur': null),
        handleFocus        : handleIdle,
        handleBlur         : handleBlurring,
        handleAnimationEnd : handleIdle,
    };
}

export function useStateActivePassive(props: Props, stateEnabledDisabled: {enabled:boolean}) {
    const defaultActived = false; // if [active] was not specified => the default value is active=false (released)
    const [actived,     setActived    ] = useState(props.active ?? defaultActived);
    const [activating,  setActivating ] = useState(false);
    const [passivating, setPassivating] = useState(false);

    
    const newActive = props.active ?? defaultActived;
    useEffect(() => {
        if (actived !== newActive) {
            setActived(newActive);

            if (stateEnabledDisabled.enabled) {
                if (newActive) {
                    setPassivating(false);
                    setActivating(true);
                }
                else {
                    setActivating(false);
                    setPassivating(true);
                }
            }
        }
    }, [actived, newActive, stateEnabledDisabled.enabled]);

    
    const handlePassivating = () => {
        if (passivating) return; // already being deactivating => action is not required
        if (actived) return; // already beed actived programatically => cannot be released by mouse/keyboard

        if (activating)  setActivating(false);
        setPassivating(true);
    }
    const handleIdle = () => {
        // clean up expired animations

        if (activating)  setActivating(false);
        if (passivating) setPassivating(false);
    }
    return {
        class: (!activating && !passivating) ? (actived ? 'actived' : null) : (activating? 'active' : (passivating ? 'passive': null)),
        handleMouseDown    : handleIdle,
        handleKeyDown      : handleIdle,
        handleMouseUp      : handlePassivating,
        handleKeyUp        : handlePassivating,
        handleAnimationEnd : handleIdle,
    };
}

export interface Props
    extends
        Elements.Props
{
    focus?:   boolean
    active?:  boolean
    enabled?: boolean
}
export default function Control(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateLeave     = Elements.useStateLeave();
    const stateEnbDis    =          useStateEnabledDisabled(props);
    const stateFocusBlur =          useStateFocusBlur(props, stateEnbDis);
    const stateActPass   =          useStateActivePassive(props, stateEnbDis);

    

    return (
        <button className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateLeave.class,
                stateEnbDis.class,
                stateFocusBlur.class,
                stateActPass.class,
            ].join(' ')}

            disabled={stateEnbDis.disabled}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateFocusBlur.handleFocus}
            onBlur={stateFocusBlur.handleBlur}
            onMouseDown={stateActPass.handleMouseDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyDown={stateActPass.handleKeyDown}
            onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={() => {
                stateLeave.handleAnimationEnd();
                stateEnbDis.handleAnimationEnd();
                stateFocusBlur.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Element'}
        </button>
    );
}