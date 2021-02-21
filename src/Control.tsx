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
    cursor                : string
    cursorDisabled        : string
    
    
    // anim props:

    boxShadowFocus        : (number|string)[][]

    filterDisabled        : string | string[][]
    filterHover           : string | string[][]//TODO: del
    filterActive          : string | string[][]

    '@keyframes enabled'  : object
    '@keyframes disabled' : object
    '@keyframes hover'    : object//TODO: del
    '@keyframes leave'    : object//TODO: del
    '@keyframes focus'    : object
    '@keyframes blur'     : object
    '@keyframes active'   : object
    '@keyframes passive'  : object
    animEnabled           : string | (string | object)[][]
    animDisabled          : string | (string | object)[][]
    animHover             : string | (string | object)[][]//TODO: del
    animLeave             : string | (string | object)[][]//TODO: del
    animFocus             : string | (string | object)[][]
    animBlur              : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    boxShadowFocusFn      : '--ctrl-boxShadowFocusFn',

    
    // anim props:

    filterEnabledDisabled : '--ctrl-filterEnabledDisabled',
    animEnabledDisabled   : '--ctrl-animEnabledDisabled',

    filterHoverLeave      : '--ctrl-filterHoverLeave',//TODO:del
    animHoverLeave        : '--ctrl-animHoverLeave',//TODO:del
    
    animFocusBlur         : '--ctrl-animFocusBlur',
    boxShadowFocusBlur    : '--ctrl-boxShadowFocusBlur',

    filterActivePassive   : '--ctrl-filterActivePassive',
    animActivePassive     : '--ctrl-animActivePassive',
};

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesEnabled  = { from: undefined, to: undefined };
const keyframesDisabled = { from: undefined, to: undefined };
const keyframesHover    = { from: undefined, to: undefined };//TODO:del
const keyframesLeave    = { from: undefined, to: undefined };//TODO:del
const keyframesFocus    = { from: undefined, to: undefined };
const keyframesBlur     = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const _cssProps: CssProps = {
    boxShadowFocus        : [[0, 0, 0, '0.2rem']],

    cursor                : 'pointer',
    cursorDisabled        : 'not-allowed',

    filterDisabled        : [['grayscale(50%)',  'opacity(50%)'  ]],
    filterHover           : ecssProps.filterHover,//TODO: del
    filterActive          : [['brightness(65%)', 'contrast(150%)']],

    '@keyframes enabled'  : keyframesEnabled,
    '@keyframes disabled' : keyframesDisabled,
    '@keyframes hover'    : keyframesHover,//TODO: del
    '@keyframes leave'    : keyframesLeave,//TODO: del
    '@keyframes focus'    : keyframesFocus,
    '@keyframes blur'     : keyframesBlur,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animEnabled           : [['300ms', 'ease-out', 'both', keyframesEnabled ]],
    animDisabled          : [['300ms', 'ease-out', 'both', keyframesDisabled]],
    animHover             : [['150ms', 'ease-out', 'both', keyframesHover   ]],//TODO: del
    animLeave             : [['300ms', 'ease-out', 'both', keyframesLeave   ]],//TODO: del
    animFocus             : [['150ms', 'ease-out', 'both', keyframesFocus   ]],
    animBlur              : [['300ms', 'ease-out', 'both', keyframesBlur    ]],
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive ]],
};



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



Object.assign(keyframesDisabled, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, but now become the second priority
            // getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
        ]],
    },
    to: {
        filter: [[
            ecssProps.filter,
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

Object.assign(keyframesActive, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            // getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
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
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
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

export const stateNoAnimStartup  = () => ({
    '&:not(.enable):not(.disable):not(:active):not(.active):not(.passive)': {
        extend:[
            Elements.stateNotHoverLeave({extend:[
                stateNotFocusBlur({
                    animationDuration: [['0ms'], '!important'],
                }),
            ]}),
        ],
    },
});



const states = {
    [vars.filterEnabledDisabled]   : ecssProps.filterNone,
    [vars.animEnabledDisabled]     : ecssProps.animNone,

    [vars.filterHoverLeave]        : ecssProps.filterNone,
    [vars.animHoverLeave]          : ecssProps.animNone,

    [Elements.vars.animHoverLeave] : undefined, // delete
    [vars.boxShadowFocusBlur]      : [[0, 0, 'transparent']],
    [vars.animFocusBlur]           : ecssProps.animNone,

    [vars.filterActivePassive]     : ecssProps.filterNone,
    [vars.animActivePassive]       : ecssProps.animNone,

    anim: [
        ecssProps.anim,
        getVar(vars.animEnabledDisabled), // 1st : ctrl must be enabled
        getVar(vars.animHoverLeave),      // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),       // 3rd : ctrl got focused
        getVar(vars.animActivePassive),   // 4th : ctrl got pressed
    ],


    extend:[
        stateEnabledDisabled({
            [vars.filterEnabledDisabled]       : cssProps.filterDisabled,
        }),
        stateEnabled({
            [vars.animEnabledDisabled]         : cssProps.animEnabled,
        }),
        stateDisabled({
            [vars.animEnabledDisabled]         : cssProps.animDisabled,
            cursor: cssProps.cursorDisabled,
        }),
        {
            '&:disabled:not(.disable)'  : {extend:[ // if ctrl was disabled at the first page load, disable first animation
                stateNoAnimStartup(),
            ]},
        },


        stateNotDisabled({extend:[
            stateHoverLeave({
                [vars.filterHoverLeave]        : cssProps.filterHover,
            }),
            stateHover({
                [Elements.vars.animHoverLeave] : undefined, // delete
                [vars.animHoverLeave]          : cssProps.animHover,
            }),
            stateLeave({
                [Elements.vars.animHoverLeave] : undefined, // delete
                [vars.animHoverLeave]          : cssProps.animLeave,
            }),


            stateFocusBlur({
                [vars.boxShadowFocusBlur]      : getVar(vars.boxShadowFocusFn),
            }),
            stateFocus({
                [vars.animFocusBlur]           : cssProps.animFocus,
            }),
            stateBlur({
                [vars.animFocusBlur]           : cssProps.animBlur,
            }),
        ]}),


        stateActivePassive({
            [vars.filterActivePassive]     : cssProps.filterActive,
        }),
        stateActive({
            [vars.animActivePassive]       : cssProps.animActive,
        }),
        statePassive({
            [vars.animActivePassive]       : cssProps.animPassive,
        }),
        {
            '&.active,&.actived': { // if activated programmatically (not by user input)
                anim: [
                    ecssProps.anim,
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
    ],
};

const styles = {
    main: {
        extend: [
            stipOuts.control,
            Elements.styles.main,
            filterValidProps(cssProps),
            states,
        ],
    },
};

Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        (Elements.styles as any)[themeProp],
    ],
    [vars.boxShadowFocusFn]: [[
        cssProps.boxShadowFocus,
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
        class: (enabling? 'enable' : (disabling ? 'disable': null)),
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

export function useStateActivePassive(props: Props) {
    const defaultActived = false; // if [active] was not specified => the default value is active=false (released)
    const [actived,     setActived    ] = useState(props.active ?? defaultActived);
    const [activating,  setActivating ] = useState(false);
    const [passivating, setPassivating] = useState(false);

    
    const newActive = props.active ?? defaultActived;
    useEffect(() => {
        if (actived !== newActive) {
            setActived(newActive);

            if (newActive) {
                setPassivating(false);
                setActivating(true);
            }
            else {
                setActivating(false);
                setPassivating(true);
            }
        }
    }, [actived, newActive]);

    
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
    const stateActPass   =          useStateActivePassive(props);

    

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