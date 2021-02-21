import
    React, {
    useState,
    useEffect }            from 'react';

import
    * as Elements          from './Element';
import {
    stateEnabled, stateDisabled, stateEnabledDisabled,
    filterValidProps,
}                          from './Element';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export interface CssProps {
    cursor                : string
    cursorDisabled        : string


    // anim props:

    filterDisabled        : string | string[][]
    filterActive          : string | string[][]

    '@keyframes enabled'  : object
    '@keyframes disabled' : object
    '@keyframes active'   : object
    '@keyframes passive'  : object
    animEnabled           : string | (string | object)[][]
    animDisabled          : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    // anim props:

    filterEnabledDisabled : '--ctrl-filterEnabledDisabled',
    animEnabledDisabled   : '--ctrl-animEnabledDisabled',

    filterActivePassive   : '--ctrl-filterActivePassive',
    animActivePassive     : '--ctrl-animActivePassive',
};

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
const keyframesEnabled  = { from: undefined, to: undefined };
const keyframesDisabled = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const _cssProps: CssProps = {
    cursor                : 'pointer',
    cursorDisabled        : 'not-allowed',


    // anim props:

    filterDisabled        : [['grayscale(50%)',  'opacity(50%)'  ]],
    filterActive          : [['brightness(65%)', 'contrast(150%)']],

    '@keyframes enabled'  : keyframesEnabled,
    '@keyframes disabled' : keyframesDisabled,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animEnabled           : [['300ms', 'ease-out', 'both', keyframesEnabled ]],
    animDisabled          : [['300ms', 'ease-out', 'both', keyframesDisabled]],
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive ]],
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ind'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



Object.assign(keyframesDisabled, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterActivePassive),
            // getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterActivePassive),
            getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
        ]],
    }
});
Object.assign(keyframesEnabled, {
    from : keyframesDisabled.to,
    to   : keyframesDisabled.from
});

Object.assign(keyframesActive, {
    from: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            // getVar(vars.filterActivePassive),
        ]],
    },
    to: {
        filter: [[
            Elements.cssProps.filter,
            getVar(vars.filterEnabledDisabled), // last priority, rarely happened
            getVar(vars.filterActivePassive),
        ]],
    }
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});



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

export const stateNoAnimStartup  = () => ({
    '&:not(.enable):not(.disable):not(:active):not(.active):not(.passive)': {
        animationDuration: [['0ms'], '!important'],
    },
});

export const mixins = {
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive,
    stateNoAnimStartup,
};



const states = {
    [vars.filterEnabledDisabled]   : Elements.cssProps.filterNone,
    [vars.filterActivePassive]     : Elements.cssProps.filterNone,

    [vars.animEnabledDisabled]     : Elements.cssProps.animNone,
    [vars.animActivePassive]       : Elements.cssProps.animNone,

    anim: [
        Elements.cssProps.anim,
        getVar(vars.animEnabledDisabled), // 1st : ctrl must be enabled
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
                    Elements.cssProps.anim,
                    getVar(vars.animActivePassive),   // 1st : ctrl already pressed, then released
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
            Elements.styles.main,
            filterValidProps(cssProps),
            states,
        ],
    },
};

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

    
    const handleIdle = () => {
        // clean up expired animations

        if (activating)  setActivating(false);
        if (passivating) setPassivating(false);
    }
    return {
        class: (!activating && !passivating) ? (actived ? 'actived' : null) : (activating? 'active' : (passivating ? 'passive': null)),
        handleAnimationEnd : handleIdle,
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

    const stateEnbDis    =          useStateEnabledDisabled(props);
    const stateActPass   =          useStateActivePassive(props);

    

    return (
        <div className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Indicator'}
        </div>
    );
}