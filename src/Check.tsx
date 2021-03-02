import type * as Css       from './Css';

import
    React, {
    useState,
    useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
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
import * as Buttons        from './Button';
import * as Icons          from './Icon';
import * as border         from './borders';
import spacers             from './spacers';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
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
    // anim props:

    filterClear        : Css.Filter

    '@keyframes check' : Css.Keyframes
    '@keyframes clear' : Css.Keyframes
    animCheck          : Css.Animation
    animClear          : Css.Animation
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';
const middle  = 'middle';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Controls.vars, Icons.vars, {
    /**
     * custom css props for manipulating icon's animation(s).
     */
    animIconFn       : '--chk-animIconFn',


    // anim props:

    filterCheckClear : '--chk-filterCheckClear',
    animCheckClear   : '--chk-animCheckClear',
});

// re-defined later, we need to construct varProps first
export const keyframesCheck = { from: undefined, to: undefined };
export const keyframesClear = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // anim props:

    filterClear        : [['opacity(0%)']],

    '@keyframes check' : keyframesCheck,
    '@keyframes clear' : keyframesClear,
    animCheck          : [['150ms', 'ease-out', 'both', keyframesCheck]],
    animClear          : [['300ms', 'ease-out', 'both', keyframesClear]],
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
    '&.check,&:checked': {
        extend: [content]
    }
});
export const stateNotCheck            = (content: object) => ({
    '&:not(.check):not(:checked)': {
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
    '&.check,&:checked,&.clear': {
        extend: [content]
    }
});
export const stateNotCheckClear       = (content: object) => ({
    '&:not(.check):not(:checked):not(.clear)': {
        extend: [content]
    }
});
export const stateNotCheckingClearing = (content: object) => ({
    '&:not(.check):not(.clear)': {
        extend: [content]
    }
});



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
    // customize the icon's anim:
    [vars.animIconFn]: [
        getVar(vars.animCheckClear),
    ],



    // all initial states are none:

    [vars.filterCheckClear] : ecssProps.filterNone,
    [vars.animCheckClear]   : ecssProps.animNone,

    // specific states:
    extend:[
        stateCheckClear({
            [vars.filterCheckClear]           : cssProps.filterClear,
        }),
        stateCheck({
            [vars.animCheckClear]             : cssProps.animCheck,
        }),
        stateClear({
            [vars.animCheckClear]             : cssProps.animClear,
        }),
        stateNotCheckClear({ // hides the check if not [checking, checked, clearing]
            '&::before': {
                display: none,
            },
        }),
        {
            '&:checked:not(.check)': // if ctrl was checked, disable first animation
                stateNoAnimStartup(),
        },
    ],
}]};

const styles = {
    main: {
        extend: [
            Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],

        display   : 'inline-block',

        // sizings:
        width     : '1em',
        height    : '1em',
        boxSizing : 'border-box',
        paddingX: 0, paddingY: 0,

        // typo settings:
        verticalAlign  : 'baseline', // button's text should aligned with sibling text, so the button behave like <span> wrapper



        overflow: 'hidden',
        '&::before': {
            extend: [
                Icons.styles.main,
                Icons.styles.img,
            ],

            content : '""',
            display : 'block',
            height  : '100%',
            width   : '100%',

            verticalAlign : undefined, // delete
            
            // forked from Bootstrap 5:
            [vars.img]: `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3 6-6'/></svg>")}")`,
            
            
            
            // a custom css props for manipulating icon's animation(s):
            anim: getVar(vars.animIconFn), // apply prop
        },
    },
};

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
    btn        : 'secondary',
    btnOutline : 'secondary',
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
    children? : React.ReactNode

    checked?  : boolean
    onChange? : React.ChangeEventHandler<HTMLInputElement>
}
export default function Button(props: Props) {
    const styles         =          useStyles();
    const ctrlStyles     = Controls.useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles, variThemeDef);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variButton     =          useVariantCheck(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);
    const stateChkClr    = useStateCheckClear(props);

    

    return (
        <input className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
                variButton.class,

                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
                stateChkClr.class,
            ].join(' ')}

            type='checkbox'

            disabled={stateEnbDis.disabled}
            checked={stateChkClr.checked}
        
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
                stateChkClr.handleAnimationEnd(e);
            }}
            onChange={props.onChange}
        />
    );
}