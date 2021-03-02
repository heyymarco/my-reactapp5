import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import {
    filterValidProps, filterPrefixProps,
    
    defineSizes, defineThemes,
}                          from './Element';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,
};



export interface CssProps {
    // anim props:

    filterDisable        : Css.Filter
    filterActive         : Css.Filter

    '@keyframes enable'  : Css.Keyframes
    '@keyframes disable' : Css.Keyframes
    '@keyframes active'  : Css.Keyframes
    '@keyframes passive' : Css.Keyframes
    animEnable           : Css.Animation
    animDisable          : Css.Animation
    animActive           : Css.Animation
    animPassive          : Css.Animation
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Elements.vars, {
    // anim props:

    filterEnableDisable : '--indi-filterEnableDisable',
    animEnableDisable   : '--indi-animEnableDisable',

    filterHoverLeave    : '--ctrl-filterHoverLeave', // will be used    in Control
    // animHoverLeave   : '--ctrl-animHoverLeave',   // will be defined in Control

    filterActivePassive : '--indi-filterActivePassive',
    animActivePassive   : '--indi-animActivePassive',
});

// re-defined later, we need to construct varProps first
export const keyframesEnable   = { from: undefined, to: undefined };
export const keyframesDisable = { from: undefined, to: undefined };
export const keyframesActive   = { from: undefined, to: undefined };
export const keyframesPassive  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // anim props:

    filterDisable        : [['grayscale(50%)',  'opacity(50%)'  ]],
    filterActive         : [['brightness(65%)', 'contrast(150%)']],

    '@keyframes enable'  : keyframesEnable,
    '@keyframes disable' : keyframesDisable,
    '@keyframes active'  : keyframesActive,
    '@keyframes passive' : keyframesPassive,
    animEnable           : [['300ms', 'ease-out', 'both', keyframesEnable ]],
    animDisable          : [['300ms', 'ease-out', 'both', keyframesDisable]],
    animActive           : [['150ms', 'ease-out', 'both', keyframesActive ]],
    animPassive          : [['300ms', 'ease-out', 'both', keyframesPassive]],
};



Object.assign(keyframesDisable, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, but now become the second priority
            // getVar(vars.filterEnableDisable), // last priority, but now become the first priority
        ]],
    },
    to: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, but now become the second priority
            getVar(vars.filterEnableDisable), // last priority, but now become the first priority
        ]],
    }
});
Object.assign(keyframesEnable, {
    from : keyframesDisable.to,
    to   : keyframesDisable.from
});

Object.assign(keyframesActive, {
    from: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnableDisable), // last priority, rarely happened
            // getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    },
    to: {
        filter: [[
            ecssProps.filter,
            getVar(vars.filterEnableDisable), // last priority, rarely happened
            getVar(vars.filterActivePassive),
            getVar(vars.filterHoverLeave), // first priority, serving smooth responsiveness
        ]],
    }
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'indi'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const stateEnable             = (content: object) => ({
    '&.enable': { // .enable
        extend: [content]
    }
});
export const stateNotEnable          = (content: object) => ({
    '&:not(.enable)': { // not-.enable
        extend: [content]
    }
});
export const stateDisable            = (content: object) => ({
    '&:disabled,&.disabled,&.disable': { // :disabled or .disabled or .disable
        extend: [content]
    }
});
export const stateNotDisable         = (content: object) => ({
    '&:not(:disabled):not(.disabled):not(.disable)': { // not-:disabled and not-.disabled and not-.disable
        extend: [content]
    }
});
export const stateEnableDisable      = (content: object) => ({
    '&.enable,&:disabled,&.disabled,&.disable': { // .enable or :disabled or .disabled or .disable
        extend: [content]
    }
});
export const stateNotEnableDisable   = (content: object) => ({
    '&:not(.enable):not(:disabled):not(.disabled):not(.disable)': { // not-.enable and not-:disabled and not-.disabled and not-.disable
        extend: [content]
    }
});
export const stateNotEnablingDisabling = (content: object) => ({
    '&:not(.enable):not(.disable)': { // not-.enable and not-.disable
        extend: [content]
    }
});

// non-pseudo active only
export const stateActive            = (content: object) => ({
    '&.active,&.actived': {
        extend: [content]
    }
});
export const stateNotActive         = (content: object) => ({
    '&:not(.active):not(.actived)': {
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
    '&.active,&.actived,&.passive': {
        extend: [content]
    }
});
export const stateNotActivePassive  = (content: object) => ({
    '&:not(.active):not(.actived):not(.passive)': {
        extend: [content]
    }
});
export const stateNotActivatingPassivating  = (content: object) => ({
    '&:not(.active):not(.passive)': {
        extend: [content]
    }
});

export const stateNoAnimStartup     = () =>
    stateNotEnablingDisabling(
        stateNotActivatingPassivating({
            animationDuration: [['0ms'], '!important'],
        })
    );



const states = {extend:[ Elements.states, { // copy Element's states
    // customize the anim:
    [vars.animFn]: [
        ecssProps.anim,
        getVar(vars.animEnableDisable), // 1st : ctrl must be enable
        getVar(vars.animActivePassive), // 4th : ctrl got pressed
    ],



    // all initial states are none:

    [vars.filterEnableDisable] : ecssProps.filterNone,
    [vars.animEnableDisable]   : ecssProps.animNone,

    [vars.filterHoverLeave]    : ecssProps.filterNone, // supports for control

    [vars.filterActivePassive] : ecssProps.filterNone,
    [vars.animActivePassive]   : ecssProps.animNone,

    // specific states:
    extend:[
        stateEnableDisable({
            [vars.filterEnableDisable]            : cssProps.filterDisable,
        }),
        stateEnable({
            [vars.animEnableDisable]              : cssProps.animEnable,
        }),
        stateDisable({
            [vars.animEnableDisable]              : cssProps.animDisable,
        }),
        {
            '&:disabled:not(.disable),&.disabled' : {extend:[ // if ctrl was disabled programatically, disable first animation
                stateNoAnimStartup(),
            ]},
        },


        stateActivePassive({
            [vars.filterActivePassive]            : cssProps.filterActive,
        }),
        stateActive({
            [vars.animActivePassive]              : cssProps.animActive,
        }),
        statePassive({
            [vars.animActivePassive]              : cssProps.animPassive,
        }),
        {
            '&.active,&.actived': { // if activated programmatically (not by user input)
                // customize the anim:
                [vars.animFn]: [
                    ecssProps.anim,
                    getVar(vars.animActivePassive), // 1st : ctrl already pressed, move to the least priority
                    getVar(vars.animEnableDisable), // 4th : ctrl enable/disable
                ],

                '&:disabled:not(.disable),&.disabled': { // if ctrl was disabled programatically
                    // customize the anim:
                    [vars.animFn]: [
                        ecssProps.anim,
                        getVar(vars.animEnableDisable), // 1st : ctrl already disabled, move to the least priority
                        getVar(vars.animActivePassive), // 4th : ctrl deactivated programatically, move to moderate priority
                    ],
                },
            },
            '&.actived': {extend:[ // if indicator was activated programatically, disable the animation
                stateNoAnimStartup(),
            ]},
        },
    ],
}]};

const styles = {
    main: {
        extend: [
            Elements.styles.main,       // copy styles from Element, including Element's cssProps & Element's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export function useStateEnableDisable(props: Props) {
    const defaultEnabled = true; // if [enabled] was not specified => the default value is enabled=true
    const [enabled,   setEnabled  ] = useState(props.enabled ?? defaultEnabled);
    const [enabling,  setEnabling ] = useState(false);
    const [disabling, setDisabling] = useState(false);

    
    const newEnable = props.enabled ?? defaultEnabled;
    useEffect(() => {
        if (enabled !== newEnable) {
            setEnabled(newEnable);

            if (newEnable) {
                setDisabling(false);
                setEnabling(true);
            }
            else {
                setEnabling(false);
                setDisabling(true);
            }
        }
    }, [enabled, newEnable]);

    
    const handleIdle = () => {
        // clean up expired animations

        if (enabling)  setEnabling(false);
        if (disabling) setDisabling(false);
    }
    return {
        enabled : enabled,
        disabled: !enabled,
        class: (enabling? 'enable' : (disabling ? 'disable': null)),
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(enable|disable)|(?<=[a-z])(Enable|Disable))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
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
        if (actived) return; // already beed actived programatically => cannot be released by mouse/keyboard
        if (passivating) return; // already being deactivating => action is not required

        if (activating)  setActivating(false);
        setPassivating(true);
    }
    const handleIdle = () => {
        // clean up expired animations

        if (activating)  setActivating(false);
        if (passivating) setPassivating(false);
    }
    return {
        /**
         * partially/fully active
        */
        active  : actived,

        /**
         * partially/fully passive
         */
        passive : !actived,

        /**
         * fully active
        */
        actived : actived && !activating,

        /**
         * fully passive
         */
        passived: !actived && !passivating,

        class: (!activating && !passivating) ? (actived ? 'actived' : null) : (activating? 'active' : (passivating ? 'passive': null)),
        handleMouseDown    : handleIdle,        // for Control
        handleKeyDown      : handleIdle,        // for Control
        handleMouseUp      : handlePassivating, // for Control
        handleKeyUp        : handlePassivating, // for Control
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling
            if (/((?<![a-z])(active|passive)|(?<=[a-z])(Active|Passive))(?![a-z])/.test(e.animationName)) {
                handleIdle();
            }
        },
    };
}

export interface Props
    extends
        Elements.Props
{
    active?:  boolean
    enabled?: boolean
}
export default function Indicator(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, elmStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateActPass   = useStateActivePassive(props);

    

    return (
        <div className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Indicator'}
        </div>
    );
}