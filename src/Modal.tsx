import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import * as Cards          from './Card';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Card';
import spacers             from './spacers';
import stripOuts           from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
}
// const unset   = 'unset';
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
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'mod'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = {extend:[ Cards.states, { // copy Card's states
}]};

const styles = {
    main: {
        extend: [
            Cards.styles.main,          // copy styles from Card, including Card's cssProps & Card's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],
    },
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface Props
    extends
        Elements.VariantTheme,
        Elements.VariantGradient
{
    active?   :  boolean

    header?   : React.ReactNode
    children? : React.ReactNode
    footer?   : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const ctStyles       = Contents.useStyles();
    const crdStyles      = Cards.useStyles();

    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, crdStyles);

    const stateActPass   = useStateActivePassive(props);

    
    
    return (
        <article className={[
                styles.main,

                variTheme.class,
                variGradient.class,

                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={() => {
                stateActPass.handleAnimationEnd();
            }}
        >
            {props.header && (
                <header className={crdStyles.header}>
                    {props.header}
                </header>
            )}

            {props.children && (
                <div className={crdStyles.body}>
                    {props.children}
                </div>
            )}

            {props.footer && (
                <footer className={crdStyles.footer}>
                    {props.footer}
                </footer>
            )}
        </article>
    );
}