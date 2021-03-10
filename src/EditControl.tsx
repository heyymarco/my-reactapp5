import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
import colors              from './colors';
import * as Icons          from './Icon';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
};



export interface CssProps {
    cursor                 : Css.Cursor

    backg                  : Css.Background


    // anim props:
    backgValid             : Css.Background
    backgInvalid           : Css.Background

    '@keyframes valid'     : Css.Keyframes
    '@keyframes unvalid'   : Css.Keyframes
    '@keyframes invalid'   : Css.Keyframes
    '@keyframes uninvalid' : Css.Keyframes
    animValid              : Css.Animation
    animUnvalid            : Css.Animation
    animInvalid            : Css.Animation
    animUninvalid          : Css.Animation
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Object.assign({}, Controls.vars, Icons.vars, {
    backgValInv      : '--ectrl-backgValInv',


    // anim props:

    animValUnval     : '--ectrl-animValUnval',
    animInvalUninval : '--ectrl-animInvalUninval',
});

// re-defined later, we need to construct varProps first
export const keyframesValid     = { from: undefined, to: undefined };
export const keyframesUnvalid   = { from: undefined, to: undefined };
export const keyframesInvalid   = { from: undefined, to: undefined };
export const keyframesUninvalid = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    cursor                 : 'text',

    backg                  : colors.backg as string,


    // anim props:
    backgValid             : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='#000' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/></svg>")}")`,
    backgInvalid           : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='#000' d='M7.3,6.31,5,4,7.28,1.71a.7.7,0,1,0-1-1L4,3,1.71.72a.7.7,0,1,0-1,1L3,4,.7,6.31a.7.7,0,0,0,1,1L4,5,6.31,7.3A.7.7,0,0,0,7.3,6.31Z'/></svg>")}")`,

    '@keyframes valid'     : keyframesValid,
    '@keyframes unvalid'   : keyframesUnvalid,
    '@keyframes invalid'   : keyframesInvalid,
    '@keyframes uninvalid' : keyframesUninvalid,
    animValid              : [['3000ms', 'ease-out', 'both', keyframesValid    ]],
    animUnvalid            : [['3000ms',  'ease-out', 'both', keyframesUnvalid  ]],
    animInvalid            : [['3000ms',  'ease-out', 'both', keyframesInvalid  ]],
    animUninvalid          : [['3000ms', 'ease-out', 'both', keyframesUninvalid]],
};



Object.assign(keyframesValid, {
    from: {
    },
    to: {
    }
});
Object.assign(keyframesUnvalid, {
    from : keyframesValid.to,
    to   : keyframesValid.from
});

Object.assign(keyframesInvalid, {
    from: {
    },
    to: {
        transform: 'none',
    }
});
Object.assign(keyframesUninvalid, {
    from : keyframesInvalid.to,
    to   : keyframesInvalid.from
});



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ectrl'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const stateValid                     = (content: object) => ({
    '&.val,&.vald': {
        extend: [content]
    }
});
export const stateNotValid                  = (content: object) => ({
    '&:not(.val):not(.vald)': {
        extend: [content]
    }
});
export const stateUnvalid                   = (content: object) => ({
    '&.unval': {
        extend: [content]
    }
});
export const stateNotUnvalid                = (content: object) => ({
    '&:not(.unval)': {
        extend: [content]
    }
});
export const stateValidUnvalid              = (content: object) => ({
    '&.val,&.vald,&.unval': {
        extend: [content]
    }
});
export const stateNotValidUnvalid           = (content: object) => ({
    '&:not(.val):not(.vald):not(.unval)': {
        extend: [content]
    }
});
export const stateNotValidatingUnvalidating = (content: object) => ({
    '&:not(.val):not(.unval)': {
        extend: [content]
    }
});

export const stateInvalid                       = (content: object) => ({
    '&.inv,&.invd': {
        extend: [content]
    }
});
export const stateNotInvalid                    = (content: object) => ({
    '&:not(.inv):not(.invd)': {
        extend: [content]
    }
});
export const stateUninvalid                     = (content: object) => ({
    '&.uninv': {
        extend: [content]
    }
});
export const stateNotUninvalid                  = (content: object) => ({
    '&:not(.uninv)': {
        extend: [content]
    }
});
export const stateInvalidUninvalid              = (content: object) => ({
    '&.inv,&.invd,&.uninv': {
        extend: [content]
    }
});
export const stateNotInvalidUninvalid           = (content: object) => ({
    '&:not(.inv):not(.invd):not(.uninv)': {
        extend: [content]
    }
});
export const stateNotInvalidatingUninvalidating = (content: object) => ({
    '&:not(.inv):not(.uninv)': {
        extend: [content]
    }
});



const iconElm = '&::after';

const states = {extend:[ Controls.states, { // copy Control's states
    // supress activating by mouse/keyboard (:active)
    // but still responsive activating programatically (.active & .actived)
    '&:active:not(.active):not(.actived)': {
        [vars.filterActivePassive] : ecssProps.filterNone,
        [vars.animActivePassive]   : ecssProps.animNone,
    },



    // overwrite from Control (replace with softer inactive (secondary) color):

    // customize conditional unthemed foreground color:
    [vars.colorIf]    : colors.secondaryCont,

    // customize conditional unthemed background color:
    [vars.backgIf] : `linear-gradient(${colors.secondaryThin},${colors.secondaryThin})`,



    // overwrite from Control (replace with softer active (primary) color):

    // customize active unthemed foreground color:
    [vars.colorIfAct] : colors.primaryCont,

    // customize active unthemed background color:
    [vars.backgIfAct] : `linear-gradient(${colors.primaryThin},${colors.primaryThin})`,



    // customize the anim:
    [vars.animFn]: [
        ecssProps.anim,
        getVar(vars.animValUnval),
        getVar(vars.animInvalUninval),
        getVar(vars.animEnableDisable), // 1st : ctrl must be enable
        getVar(vars.animHoverLeave),    // 2nd : cursor hovered over ctrl
        getVar(vars.animFocusBlur),     // 3rd : ctrl got focused (can interrupt hover/leave)
        getVar(vars.animActivePassive), // 4th : ctrl got pressed (can interrupt focus/blur)
    ],



    // all initial states are none:

    [vars.backgValInv]      : 'linear-gradient(transparent,transparent)',
    [vars.animValUnval]     : ecssProps.animNone,
    [vars.animInvalUninval] : ecssProps.animNone,

    // specific states:
    extend:[
        {
            '&.active,&.actived': { // if activated programmatically (not by user input)
                // customize the anim:
                [vars.animFn]: [
                    ecssProps.anim,
                    getVar(vars.animValUnval),
                    getVar(vars.animInvalUninval),
                    getVar(vars.animActivePassive), // 1st : ctrl already pressed, move to the least priority
                    getVar(vars.animHoverLeave),    // 2nd : cursor leaved
                    getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus (can interrupt hover/leave)
                    getVar(vars.animEnableDisable), // 4th : ctrl enable/disable (can interrupt focus/blur)
                ],

                '&.disabled,&:disabled:not(.disable)': { // if ctrl was disabled programatically
                    // customize the anim:
                    [vars.animFn]: [
                        ecssProps.anim,
                        getVar(vars.animValUnval),
                        getVar(vars.animInvalUninval),
                        getVar(vars.animEnableDisable), // 1st : ctrl already disabled, move to the least priority
                        getVar(vars.animHoverLeave),    // 2nd : cursor leaved, should not happened, move to low priority
                        getVar(vars.animFocusBlur),     // 3rd : ctrl lost focus, might happened programaticaly, move to low priority (can interrupt hover/leave)
                        getVar(vars.animActivePassive), // 4th : ctrl deactivated programatically, move to moderate priority (can interrupt focus/blur)
                    ],
                },
            },
        },



        // stateValidUnvalid({
        // }),
        stateValid({
            [vars.backgValInv]      : cssProps.backgValid,
            [vars.animValUnval]     : cssProps.animValid,
        }),
        stateUnvalid({
            [vars.animValUnval]     : cssProps.animUnvalid,
        }),

        // stateInvalidUninvalid({
        // }),
        stateInvalid({
            [vars.backgValInv]      : cssProps.backgInvalid,
            [vars.animInvalUninval] : cssProps.animInvalid,
        }),
        stateUninvalid({
            [vars.animInvalUninval] : cssProps.animUninvalid,
        }),
    ],
}]};

const styles = {
    main: {
        extend: [
            Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],


        [iconElm]: {
            extend: [
                Icons.styles.main,
                Icons.styles.img,
            ],

            content : '""',
            display : 'inline-block',

            height                 : '1em',     // follow parent text height
            width                  : '1.25em',  // make sure the icon's image ratio is 1.25 or less
            marginInlineStart      : '-1.25em', // cancel-out icon's width with negative margin, so it doen't take up space
            maskPosition           : 'right',   // align to right
            '-webkit-maskPosition' : 'right',   // align to right
            pointerEvents          : 'none',    // just an overlayed element, no mouse interaction


            [vars.img] : getVar(vars.backgValInv),
            backg      : getVar(vars.colorOl),
        },
    },
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    extend: [
        // copy the themes from Control:
        (Controls.styles as any)[themeProp],
    ],


    '&:not(._)': { // force to win conflict with states
        // customize the backg & color

        // customize final foreground color with softer color:
        [vars.colorTh]       : (colors as any)[`${theme}Cont`],

        // customize themed background color with softer color:
        [vars.backgTh]       : `linear-gradient(${(colors as any)[`${theme}Thin`]},${(colors as any)[`${theme}Thin`]})`,
    },
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export function useStateValidInvalid(props: Props) {
    const defaultValided: (boolean|null)  = null; // if [isValid] was not specified => the default value is isValid=null (unverified)
    const [valided,      setValided     ] = useState(props.isValid ?? defaultValided);
    const [succeeding,   setSucceeding  ] = useState(false);
    const [unsucceeding, setUnsucceeding] = useState(false);
    const [erroring,     setErroring    ] = useState(false);
    const [unerroring,   setUnerroring  ] = useState(false);

    
    const newValid = props.isValid ?? defaultValided;
    useEffect(() => {
        if (valided !== newValid) {
            setValided(newValid);

            if (newValid === null) { // neither success nor error
                if (valided === true) { // if was success
                    // fade out success mark:
                    setSucceeding(false);
                    setUnsucceeding(true);
                } // if

                if (valided === false) { // if was error
                    // fade out error mark:
                    setErroring(false);
                    setUnerroring(true);
                } // if
            }
            else if (newValid) { // success
                if (valided === false) { // if was error
                    // fade out error mark:
                    setErroring(false);
                    setUnerroring(true);
                } // if

                // fade in success mark:
                setUnsucceeding(false);
                setSucceeding(true);
            }
            else { // error
                if (valided === true) { // if was success
                    // fade out success mark:
                    setSucceeding(false);
                    setUnsucceeding(true);
                } // if

                // fade in error mark:
                setUnerroring(false);
                setErroring(true);
            } // if
        }
    }, [valided, newValid]);

    
    const handleIdleSucc = () => {
        // clean up expired animations

        if (succeeding)   setSucceeding(false);
        if (unsucceeding) setUnsucceeding(false);
    }
    const handleIdleErr = () => {
        // clean up expired animations

        if (erroring)     setErroring(false);
        if (unerroring)   setUnerroring(false);
    }
    return {
        /**
         * being/was valid or being/was invalid
        */
        valid : valided,

        class: !(succeeding || unsucceeding || erroring || unerroring) ? ((valided===null) ? null : (valided ? 'vald' : 'invd')) : [(succeeding? 'val' : (unsucceeding ? 'unval': null)), (erroring? 'inv' : (unerroring ? 'uninv': null))].join(' '),
        handleAnimationEnd : (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget) return; // no bubbling

            if (/((?<![a-z])(valid|unvalid)|(?<=[a-z])(Valid|Unvalid))(?![a-z])/.test(e.animationName)) {
                handleIdleSucc();
            }
            else if (/((?<![a-z])(invalid|uninvalid)|(?<=[a-z])(Invalid|Uninvalid))(?![a-z])/.test(e.animationName)) {
                handleIdleErr();
            }
        },
    };
}

export interface Props
    extends
        Controls.Props
{
    readonly? : boolean
    isValid?  : boolean
}
export default function EditControl(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);
    const stateValInval  = useStateValidInvalid(props);

    

    return (
        <textarea className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
                stateValInval.class,
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
                stateValInval.handleAnimationEnd(e);
            }}
        >
            {(props as React.PropsWithChildren<Props>)?.children ?? 'Base Content Control'}
        </textarea>
    );
}