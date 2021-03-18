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
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

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
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

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



export const themes = Controls.themes; // copy Control's themes

export const sizes  = Controls.sizes;  // copy Control's sizes
const cssPropsAny = cssProps as any;
defineSizes(sizes, (size, Size, sizeProp) => ({
    // overwrite the props with the props{Size}:

    '--btn-gapX' : cssPropsAny[`gapX${Size}`],
    '--btn-gapY' : cssPropsAny[`gapY${Size}`],
}));


export const fnVars = Controls.fnVars; // copy Control's fnVars
export const states = Controls.states; // copy Control's states


const linkStyles = {
    textDecoration : 'underline',
    lineHeight     : 1,

    padding        : spacers.xs,
    borderRadius   : border.radiuses.sm,
};
export const basicStyle = {
    extend: [
        Controls.basicStyle,        // copy basicStyle from Control
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
};
const styles = {
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
    btnOutline: Controls.styles.outline,
    btnLink: {
        extend:[
            Elements.styles.outline,
        ],


        
        '&:not(._)': { // force to win conflict with outline
            // hide the border:
            borderColor    : 'transparent',

            extend:[
                linkStyles,
            ],
        },
    },
    btnOutlineLink: {
        extend:[
            Elements.styles.outline,
        ],



        // apply linkStyles & force to win conflict with main
        '&:not(._)': linkStyles,
    },
};
const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeLg', object>);
export { styles2 as styles };
export const useStyles = createUseStyles(styles2);



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
    // actions:
    onClick?     : React.MouseEventHandler<HTMLButtonElement>

    // labels:
    text?        : string
    children?    : React.ReactNode

    // layouts:
    orientation? : Css.Orientation
    whiteSpace?  : Css.WhiteSpace
}
export default function Button(props: Props) {
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     = Controls.useStyles();
    const btnStyles      =          useStyles();

    // themes:
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles, variThemeDef);
    const variSize       = Elements.useVariantSize(props, btnStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variButton     =          useVariantButton(props, btnStyles);

    // states:
    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);

    

    return (
        <button className={[
                btnStyles.main,

                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,
                variButton.class,

                // states:
                stateEnbDis.class,
                stateLeave.class,
                stateFocusBlur.class,
                stateActPass.class,
            ].join(' ')}

            // accessibility:
            disabled={stateEnbDis.disabled}

            // actions:
            onClick={props.onClick}
        
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
            {props.text}
            {props.children}
        </button>
    );
}