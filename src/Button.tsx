import type * as Css       from './Css';

import React               from 'react';

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
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Controls.vars, {
    /**
     * a custom css props for manipulating background(s) at outlined state.
     */
    backgOlFn : '--btn-backgOlFn',
});

const ecssProps = Elements.cssProps;
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



const states = {extend:[ Controls.states, { // copy Control's states
    // customize the background(s) at outlined state:
    [vars.backgOlFn]: 'transparent',
}]};

const styles = {
    main: {
        extend: [
            Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
        
        // flex settings:
        display        : 'inline-flex',
        flexDirection  : cssProps.orientation,
        justifyContent : center,
        alignItems     : center,

        // typo settings:
        textAlign      : center,
        verticalAlign  : 'baseline', // button's text should aligned with sibling text, so the button behave like <span> wrapper

        userSelect     : none, // disable selecting button's text
    },
    gradient: { '&:not(._)': { // force to win conflict with main
        extend: [
            // copy the themes from Element:
            Elements.styles.gradient,
        ],

        // customize the backg at outlined state:
        [vars.backgOlFn]: ecssProps.backgGrad,
    }},
    btnOutline: { // already have specific rule :not-active => always win conflict with main
        extend:[
            stateNotActive({
                '&:not(:hover):not(:focus), &:disabled,&.disabled': {
                    // apply the outlined-backg:
                    backg          : getVar(vars.backgOlFn),

                    // customize the text-color (foreground):
                    [vars.colorFn] : ecssProps.backg,

                    // set border color = text-color:
                    borderColor    : getVar(vars.colorFn),
                },
            }),
        ],
    },
    btnLink: { '&:not(._)': { // force to win conflict with main
        // apply the outlined-backg:
        backg          : getVar(vars.backgOlFn),

        // customize the text-color (foreground):
        [vars.colorFn] : ecssProps.backg,

        // hide the border:
        borderColor    : 'transparent',



        // link properties:
        textDecoration : 'underline',
        lineHeight     : 1,

        padding        : spacers.xs,
        borderRadius   : border.radiuses.sm,
    }},
    btnOutlineLink: { '&:not(._)': { // force to win conflict with main
        // apply the outlined-backg:
        backg          : getVar(vars.backgOlFn),

        // customize the text-color (foreground):
        [vars.colorFn] : ecssProps.backg,

        // set border color = text-color:
        borderColor    : getVar(vars.colorFn),



        // link properties:
        textDecoration : 'underline',
        lineHeight     : 1,

        padding        : spacers.xs,
        borderRadius   : border.radiuses.sm,
    }},
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



type BtnStyle = 'outline' | 'link' | 'outlineLink';
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
    const ctrlStyles     = Controls.useStyles();

    const variSize       = Elements.useVariantSize(props, styles);
    const variThemeDef   =          useVariantThemeDefault(props);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles, variThemeDef);
    const variGradient   = Elements.useVariantGradient(props, styles);
    const variButton     =          useVariantButton(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateLeave     = useStateLeave(stateEnbDis);
    const stateFocusBlur = useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = useStateActivePassive(props);

    

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