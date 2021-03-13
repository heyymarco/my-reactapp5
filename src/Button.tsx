import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
import * as border         from './borders';
import spacers             from './spacers';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
};



export interface CssProps {
    orientation : Css.Orientation
    whiteSpace  : Css.WhiteSpace

    gapX        : Css.Gap
    gapY        : Css.Gap
    gapXSm      : Css.Gap
    gapYSm      : Css.Gap
    gapXLg      : Css.Gap
    gapYLg      : Css.Gap
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Controls.vars;

// const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    orientation : 'row',
    whiteSpace  : 'normal',

    gapX        : (spacers.sm as string),
    gapY        : (spacers.sm as string),
    gapXSm      : (spacers.xs as string),
    gapYSm      : (spacers.xs as string),
    gapXLg      : (spacers.md as string),
    gapYLg      : (spacers.md as string),
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'btn'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = Controls.states;

const linkStyles = {
    textDecoration : 'underline',
    lineHeight     : 1,

    padding        : spacers.xs,
    borderRadius   : border.radiuses.sm,
};
const styles = {
    basic: {
        extend: [
            Controls.styles.basic,      // copy styles from Control
            filterValidProps(cssProps), // apply our filtered cssProps
        ],
        
        // layout:
        display        : 'inline-flex',
        flexDirection  : cssProps.orientation,
        justifyContent : center,
        alignItems     : center,

        // sizings:
        boxSizing      : 'content-box',

        // typo settings:
        textAlign      : center,
        verticalAlign  : 'baseline', // button's text should aligned with sibling text, so the button behave like <span> wrapper

        userSelect     : none, // disable selecting button's text
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
    btnOutline: Controls.styles.outline,
    btnLink: {
        extend:[
            Elements.styles.outline,
        ],

        // hide the border:
        borderColor    : 'transparent',



        // apply linkStyles & force to win conflict with main
        '&:not(._)': linkStyles,
    },
    btnOutlineLink: {
        extend:[
            Elements.styles.outline,
        ],



        // apply linkStyles & force to win conflict with main
        '&:not(._)': linkStyles,
    },
};

const cssPropsAny = cssProps as any;
defineSizes(styles, (size, Size, sizeProp) => ({
    extend: [
        // copy the size specific props from Element:
        (Elements.styles as any)[sizeProp],
    ],


    // overwrite the props with the props{Size}:

    '--btn-gapX' : cssPropsAny[`gapX${Size}`],
    '--btn-gapY' : cssPropsAny[`gapY${Size}`],
}));

const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeLg', object>);
const useStyles = createUseStyles(styles2);
export { states, styles2 as styles, useStyles };



export type BtnStyle = 'outline' | 'link' | 'outlineLink';
export interface VariantButton {
    btnStyle?: BtnStyle
}
export function useVariantButton(props: VariantButton, styles: Record<string, string>) {
    return {
        class: props.btnStyle ? (styles as any)[`btn${pascalCase(props.btnStyle)}`] : null,
    };
}

export const themeDefaults: {[btnStyle: string]: (string|undefined)} = {
    default     : 'secondary',
    outline     : 'secondary',
    link        : 'primary',
    outlineLink : 'primary',
};
export function useVariantThemeDefault(props: VariantButton) {
    return () => {
        return themeDefaults?.[props.btnStyle ?? 'default'] ?? undefined;
    };
}

export interface Props
    extends
        Controls.Props,
        VariantButton
{
    orientation? : Css.Orientation
    whiteSpace?  : Css.WhiteSpace

    text?        : string
    children?    : React.ReactNode

    onClick?     : React.MouseEventHandler<HTMLButtonElement>
}
export default function Button(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     = Controls.useStyles();

    const variSize       = Elements.useVariantSize(props, styles);
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles, variThemeDef);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variButton     =          useVariantButton(props, styles);

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
                variButton.class,

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
            onClick={props.onClick}
        >
            {props.text}
            {props.children}
        </button>
    );
}