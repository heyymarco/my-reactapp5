import React               from 'react';

import * as Elements       from './Element';
import * as Controls       from './Control';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
}                          from './Control';
import * as border         from './borders';
import spacers             from './spacers';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
};



type Orientation = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type WhiteSpace  = 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces';
export interface CssProps {
    orientation : Orientation | string
    whiteSpace  : WhiteSpace  | string

    gapX        : string | number | (string|number)[][]
    gapY        : string | number | (string|number)[][]
    gapXSm      : string | number | (string|number)[][]
    gapYSm      : string | number | (string|number)[][]
    gapXLg      : string | number | (string|number)[][]
    gapYLg      : string | number | (string|number)[][]
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';
const middle  = 'middle';

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

    gapX        : spacers.sm,
    gapY        : spacers.sm,
    gapXSm      : spacers.xs,
    gapYSm      : spacers.xs,
    gapXLg      : spacers.md,
    gapYLg      : spacers.md,
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



export const filterValidProps = <TCssProps,>(cssProps: TCssProps) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(Controls.filterValidProps(cssProps))) {
        if ((/^(orientation)$/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}

const styles = {
    main: {
        extend: [
            Controls.styles.main,       // copy styles from Control, including Control's cssProps & Control's states.
            filterValidProps(cssProps), // apply our filtered cssProps
        ],
        
        // flex settings:
        display        : 'inline-flex',
        flexDirection  : cssProps.orientation,
        justifyContent : center,
        alignItems     : center,

        // typo settings:
        textAlign      : center,
        verticalAlign  : middle,

        userSelect     : none, // disable selecting button's text



        // we have 1 custom css props [backgOlFn]
        // set the default value of it:

        // a custom css props for manipulating background(s) at outlined state:
        [vars.backgOlFn]: 'transparent',    // set default value
        // backg: getVar(vars.backgOlFn),   // not apply yet
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
export { styles2 as styles, useStyles };



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
    orientation? : Orientation
    whiteSpace?  : WhiteSpace

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

    const stateEnbDis    = useStateEnabledDisabled(props);
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
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateLeave.handleAnimationEnd();
                stateFocusBlur.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
            onClick={props.onClick}
        >
            {props.text}
            {props.children}
        </button>
    );
}