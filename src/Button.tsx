import
    React, {
    useState,
    useEffect }            from 'react';

import
    * as Elements          from './Element';
import {
    filterValidProps,
}                          from './Element';
import
    * as Controls          from './Control';
import spacers             from './spacers';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



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
// const none    = 'none';
// const inherit = 'inherit';

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
    /*config   :*/ { varPrefix: 'elm'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const styles = {
    main: {
        extend: [
            Controls.styles.main,
            filterValidProps(varProps),
        ],
    },
    outline: {
    },
    link: {
    },
}

const useStyles = createUseStyles(styles);
export { styles, useStyles };



type BtnStyle = 'normal' | 'outline' | 'link' | 'outlineLink';
export interface VariantButton {
    btnStyle?: BtnStyle
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
    const styles         = useStyles();
    const elmStyles      = Elements.useStyles();
    const ctrlStyles     = Controls.useStyles();
    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, ctrlStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
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