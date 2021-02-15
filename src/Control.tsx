import
    React, {
    useState,
    useEffect }            from 'react';

import
    colors,
    * as color             from './colors';
import
    borders,
    * as border            from './borders';
import spacers             from './spacers';
import
    typos,
    { base as typoBase }   from './typos/index';
import
    Element,
    * as Elements          from './Element';
import {
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled,
    filterValidProps,
}                          from './Element';
import stipOuts            from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface CssProps {
    boxShadowFocus        : (number|string)[][]

    cursorEnabled         : string
    cursorDisabled        : string

    filterHover           : string | string[][]
    filterActive          : string | string[][]
    filterDisabled        : string | string[][]

    '@keyframes hover'    : object
    '@keyframes leave'    : object
    '@keyframes focus'    : object
    '@keyframes blur'     : object
    '@keyframes active'   : object
    '@keyframes passive'  : object
    '@keyframes enabled'  : object
    '@keyframes disabled' : object

    animHover             : string | (string | object)[][]
    animLeave             : string | (string | object)[][]
    animFocus             : string | (string | object)[][]
    animBlur              : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
    animEnabled           : string | (string | object)[][]
    animDisabled          : string | (string | object)[][]
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesHover    = { from: undefined, to: undefined };
const keyframesLeave    = { from: undefined, to: undefined };
const keyframesFocus    = { from: undefined, to: undefined };
const keyframesBlur     = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const keyframesEnabled  = { from: undefined, to: undefined };
const keyframesDisabled = { from: undefined, to: undefined };
const cssProps: CssProps = {
    boxShadowFocus        : [[0, 0, 0, '0.2rem']],

    cursorEnabled         : 'pointer',
    cursorDisabled        : 'not-allowed',

    filterHover           : 'brightness(65%)', //Elements.cssProps.filterHover,
    filterActive          : [['brightness(55%)', 'contrast(150%)']],
    filterDisabled        : [['grayscale(50%)',  'opacity(50%)']],

    '@keyframes hover'    : keyframesHover,
    '@keyframes leave'    : keyframesLeave,
    '@keyframes focus'    : keyframesFocus,
    '@keyframes blur'     : keyframesBlur,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    '@keyframes enabled'  : keyframesEnabled,
    '@keyframes disabled' : keyframesDisabled,
    animHover             : [['500ms', 'ease-out', 'both', keyframesHover]],
    animLeave             : [['500ms', 'ease-out', 'both', keyframesLeave]],
    animFocus             : [['500ms', 'ease-out', 'both', keyframesFocus   ]],
    animBlur              : [['500ms', 'ease-out', 'both', keyframesBlur    ]],
    animActive            : [['500ms', 'ease-out', 'both', keyframesActive  ]], //TODO slowing down anim for debug
    animPassive           : [['500ms', 'ease-out', 'both', keyframesPassive ]], //TODO slowing down anim for debug
    animEnabled           : [['500ms', 'ease-out', 'both', keyframesEnabled ]],
    animDisabled          : [['500ms', 'ease-out', 'both', keyframesDisabled]],
};
Object.assign(keyframesHover, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            'var(--ctrl-filterEnabledDisabled)',
            'var(--ctrl-filterActivePassive)',
            // 'var(--ctrl-filterHoverLeave)',
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            'var(--ctrl-filterEnabledDisabled)',
            'var(--ctrl-filterActivePassive)',
            'var(--ctrl-filterHoverLeave)',
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
        ]]],
    },
    to: {
        boxShadow: [[[
            Elements.cssProps.boxShadow,
            cssProps.boxShadowFocus,
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
            'var(--ctrl-filterEnabledDisabled)',
            // 'var(--ctrl-filterActivePassive)',
            'var(--ctrl-filterHoverLeave)',
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            'var(--ctrl-filterEnabledDisabled)',
            'var(--ctrl-filterActivePassive)',
            'var(--ctrl-filterHoverLeave)',
        ]],
    }
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});

Object.assign(keyframesDisabled, {
    from: {
        filter: [[
            Elements.cssProps.filter,
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            cssProps.filterDisabled,
        ]],
    }
});
Object.assign(keyframesEnabled, {
    from : keyframesDisabled.to,
    to   : keyframesDisabled.from
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
    '&:focus': {
        extend: [content]
    }
});
const stateNotFocus           = (content: object) => ({
    '&:not(:focus)': {
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
    '&:focus,&.blur': {
        extend: [content]
    }
});
const stateNotFocusBlur      = (content: object) => ({
    '&:not(:focus):not(.blur)': {
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
    Elements.stateNotHoverLeave({extend:[
        stateNotFocusBlur({
            animationDuration: [['0ms'], '!important'],
        }),
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
    '--ctrl-filterHoverLeave'      : Elements.cssProps.filterNone,
    '--ctrl-animHoverLeave'        : Elements.cssProps.animNone,

    '--ctrl-filterActivePassive'   : Elements.cssProps.filterNone,
    '--ctrl-animActivePassive'     : Elements.cssProps.animNone,

    '--ctrl-animFocusBlur'         : Elements.cssProps.animNone,
    
    '--ctrl-filterEnabledDisabled' : Elements.cssProps.filterNone,
    '--ctrl-animEnabledDisabled'   : Elements.cssProps.animNone,
    anim: [
        Elements.cssProps.anim,
        // 'var(--ctrl-animEnabledDisabled)',
        'var(--ctrl-animHoverLeave)',      // first: cursor hovered
        // 'var(--ctrl-animFocusBlur)',    // then : control got focus
        'var(--ctrl-animActivePassive)',   // then : press control
    ],


    extend:[
        stateNotDisabled({extend:[
            stateHoverLeave({
                '--ctrl-filterHoverLeave': varProps.filterHover,
            }),
            stateHover({
                '--ctrl-animHoverLeave'  : varProps.animHover,
            }),
            stateLeave({
                '--ctrl-animHoverLeave'  : varProps.animLeave,
            }),


            stateFocus({
                '--ctrl-animFocusBlur': varProps.animFocus,
            }),
            stateBlur({
                '--ctrl-animFocusBlur': varProps.animBlur,
            }),


            stateActivePassive({
                '--ctrl-filterActivePassive': varProps.filterActive,
            }),
            stateActive({
                '--ctrl-animActivePassive': varProps.animActive,
            }),
            statePassive({
                '--ctrl-animActivePassive': varProps.animPassive,
            }),
            {
                '&.active,&.actived': { // if activated programmatically (not by user input)
                    anim: [
                        Elements.cssProps.anim,
                        'var(--ctrl-animEnabledDisabled)',
                        'var(--ctrl-animActivePassive)',   // first: control already pressed, then released
                        'var(--ctrl-animFocusBlur)',       // then : control may lost focus
                        'var(--ctrl-animHoverLeave)',      // then : cursor leaved
                    ],
                },
                '&.actived': {extend:[ // if was actived, disable first animation
                    stateNoAnimStartup(),
                ]},
            },
        ]}),


        stateEnabled({
            '--ctrl-animEnabledDisabled': varProps.animEnabled,
        }),
        stateDisabled({
            '--ctrl-animEnabledDisabled': varProps.animDisabled,
        }),
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
for (const [theme, value] of Object.entries(color.themes)) {
    const Theme = pascalCase(theme);
    const themeProp = `theme${Theme}`;
    (styles as any)[themeProp] = {
        extend: [
            (Elements.styles as any)[themeProp],
        ],
        '--ctrl-boxShadowFocus-theme': [[varProps.boxShadowFocus, (colors as any)[`${theme}Transp`]]],
    };
}

const useStyles = createUseStyles(styles);
export { styles, useStyles };



export function useStateBlur() {
    const [blurring, setBlurring] = useState(false);

    const handleBlurring = () => { if (!blurring) setBlurring(true);  }
    const handleIdle     = () => { if (blurring)  setBlurring(false); }
    return {
        class: blurring ? 'blur': null,
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
        class: (!enabling && !disabling) ? (enabled ? null : 'disabled') : (enabling? 'enabled' : (disabling ? 'disabled': null)),
        handleAnimationEnd : handleIdle,
    };
}

export interface Props
    extends
        Elements.Props
{
    active?:  boolean,
    enabled?: boolean,
}
export default function Control(props: Props) {
    const styles       = useStyles();
    const elmStyles    = Elements.useStyles();
    const varSize      = Elements.useVariantSize(props, elmStyles);
    const varTheme     = Elements.useVariantTheme(props, styles);
    const varGradient  = Elements.useVariantGradient(props, elmStyles);
    const stateLeave   = Elements.useStateLeave();
    const stateBlur    = useStateBlur();
    const stateActPass = useStateActivePassive(props);
    const stateEnbDis  = useStateEnabledDisabled(props);

    

    return (
        <button className={[
                styles.main,
                varSize.class,
                varTheme.class,
                varGradient.class,

                stateLeave.class,
                stateBlur.class,
                stateActPass.class,
                stateEnbDis.class,
            ].join(' ')}
        
            onMouseEnter={stateLeave.handleMouseEnter}
            onMouseLeave={stateLeave.handleMouseLeave}
            onFocus={stateBlur.handleFocus}
            onBlur={stateBlur.handleBlur}
            onMouseDown={stateActPass.handleMouseDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyDown={stateActPass.handleKeyDown}
            onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={() => {
                stateLeave.handleAnimationEnd();
                stateBlur.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
                stateEnbDis.handleAnimationEnd();
            }}
        >Base Control</button>
    );
}