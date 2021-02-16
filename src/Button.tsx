import
    React, {
    useState,
    useEffect }            from 'react';

import
    * as Elements          from './Element';
import {
    filterValidProps as baseFilterValidProps,
}                          from './Element';
import
    * as Controls          from './Control';
import
    * as border            from './borders';
import spacers             from './spacers';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



type Orientation = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type WhiteSpace  = 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces';
export interface CssProps {
    orientation : Orientation | string
    whiteSpace  : WhiteSpace | string

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

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    orientation : 'row',
    whiteSpace  : 'normal',

    gapX        : spacers.md,
    gapY        : spacers.md,
    gapXSm      : spacers.sm,
    gapYSm      : spacers.sm,
    gapXLg      : spacers.lg,
    gapYLg      : spacers.lg,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'btn'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const filterValidProps = <TVarProps,>(varProps: TVarProps) => {
    const varProps2: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(baseFilterValidProps(varProps))) {
        if ((/^(orientation)$/).test(key)) continue;
        varProps2[key] = value;
    }
    return varProps2;
}

const styles = {
    main: {
        extend: [
            Controls.styles.main,
            filterValidProps(varProps),
        ],
        
        // flex settings:
        display        : 'inline-flex',
        flexDirection  : varProps.orientation,
        justifyContent : center,
        alignItems     : center,

        // typo settings:
        textAlign      : center,
        verticalAlign  : middle,

        userSelect     : none, // disable selecting button's text
    },
    btnOutline: {
        extend:[
            Controls.stateNotActive({
                '&:not(:hover):not(:focus), &:disabled,&.disabled': {
                    color       : Elements.cssProps.backg,
                    backg       : 'transparent',
                    borderColor : Elements.cssProps.backg,
                },
            }),
        ],
    },
    btnLink: { '&:not(._)': { // force to win conflict with main
        color          : Elements.cssProps.backg,
        backg          : 'transparent',
        borderColor    : 'transparent',


        // link properties:
        textDecoration : 'underline',
        lineHeight     : 1,

        padding        : spacers.xs,
        borderRadius   : border.radiuses.sm,
    }},
    btnOutlineLink: { '&:not(._)': { // force to win conflict with main
        color          : Elements.cssProps.backg,
        backg          : 'transparent',
        borderColor    : Elements.cssProps.backg,


        // link properties:
        textDecoration : 'underline',
        lineHeight     : 1,

        padding        : spacers.xs,
        borderRadius   : border.radiuses.sm,
    }},
}
const varProps2 = varProps as any;
for (let size of ['sm', 'lg']) {
    const Size = pascalCase(size);
    const sizeProp = `size${Size}`;
    (styles as any)[sizeProp] = {
        extend: [
            (Elements.styles as any)[sizeProp],
        ],
        '--elm-gapX' : varProps2[`gapX${Size}`],
        '--elm-gapY' : varProps2[`gapY${Size}`],
    };
}

const useStyles = createUseStyles(styles);
export { styles, useStyles };



type BtnStyle = 'outline' | 'link' | 'outlineLink';
export interface VariantButton {
    btnStyle?: BtnStyle
}
export function useVariantButton(props: VariantButton, styles: Record<string, string>) {
    return {
        class: props.btnStyle ? (styles as any)[`btn${pascalCase(props.btnStyle)}`] : null,
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

    onClick?     : React.MouseEventHandler<HTMLButtonElement>;
}
export default function Button(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     = Controls.useStyles();

    const variSize       = Elements.useVariantSize(props, styles);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variButton     =          useVariantButton(props, styles);

    const stateLeave     = Elements.useStateLeave();
    const stateEnbDis    = Controls.useStateEnabledDisabled(props);
    const stateFocusBlur = Controls.useStateFocusBlur(props, stateEnbDis);
    const stateActPass   = Controls.useStateActivePassive(props, stateEnbDis);

    

    return (
        <button className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
                variButton.class,

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
            onClick={props.onClick}
        >
            {props.text}
            {props.children}
        </button>
    );
}