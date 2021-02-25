import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Content';
import * as border         from './borders';
import colors              from './colors';
import stipOuts            from './strip-outs';
import ListGroupItem       from './ListGroupItem';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
    orientation : Css.Orientation

    height      : Css.Height

    colorCap    : Css.Color,
    backgCap    : Css.Background
}
const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Contents.vars, {
});

// re-defined later, we need to construct varProps first
const ecssProps = Elements.cssProps;
const ccssProps = Contents.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    orientation : 'column',

    height: unset,

    colorCap: unset,
    backgCap: colors.foregThin as string,
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'crd'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const filterValidProps = <TCssProps,>(cssProps: TCssProps) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(Contents.filterValidProps(cssProps))) {
        if ((/(Cap)$/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}
export const filterPropsSuffix = <TCssProps,>(cssProps: TCssProps, suffix: string) => {
    const cssPropsCopy: { [key: string]: any } = { };
    for (const [key, value] of Object.entries(cssProps)) {
        if (!key.endsWith(suffix)) continue;
        cssPropsCopy[key.substr(0, key.length - suffix.length)] = value;
    }
    return cssPropsCopy;
}

const states = Object.assign({}, Contents.states, {
});

const styles = {
    main: {
        extend: [
            Contents.styles.main,       // copy styles from Content, including Content's cssProps & Content's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],

        position: 'relative',
        display: 'flex',
        flexDirection: 'column',

        paddingX: undefined,
        paddingY: undefined,
        minWidth: 0, // See https://github.com/twbs/bootstrap/pull/22740#issuecomment-305868106
        wordWrap: 'break-word',
        backgroundClip: 'border-box',

    },
    header: {
        extend: [
            filterPropsSuffix(cssProps, 'Cap'),
        ],
        paddingX: ecssProps.paddingX,
        paddingY: ecssProps.paddingY,
        borderBottom: ecssProps.border,
    },
    footer: {
        extend: [
            filterPropsSuffix(cssProps, 'Cap'),
        ],
        paddingX: ecssProps.paddingX,
        paddingY: ecssProps.paddingY,
        borderTop: ecssProps.border,
    },
    body: {
        paddingX: ecssProps.paddingX,
        paddingY: ecssProps.paddingY,
        flex: [[1, 1, 'auto']],
    },
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface Props
    extends
        Contents.Props
{
    orientation? : Css.Orientation

    header?      : React.ReactNode
    footer?      : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctStyles       = Contents.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, ctStyles);

    const stateEnbDis    = useStateEnabledDisabled(props);
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
        
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            {props.header && (
                <header className={styles.header}>
                    {props.header}
                </header>
            )}

            {props.children && (
                <div className={styles.body}>
                    {props.children}
                </div>
            )}

            {props.footer && (
                <footer className={styles.footer}>
                    {props.footer}
                </footer>
            )}
        </div>
    );
}