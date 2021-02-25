import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Content';
import * as border         from './borders';
import stipOuts            from './strip-outs';
import ListGroupItem       from './ListGroupItem';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface CssProps {
    orientation : Css.Orientation
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Contents.vars, {
    /**
     * (internal use) Forwards anim to children element.
    */
    animFw: '--lg-animFw',
});

// re-defined later, we need to construct varProps first
const ecssProps = Elements.cssProps;
const ccssProps = Contents.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    orientation : 'column',
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'lg'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const states = Object.assign({}, Contents.states, {
    // customize the anim prop to be forwarded to another element(s):
    [vars.animFw]: getVar(vars.animFn),
});

const styles = {
    main: {
        extend: [
            stipOuts.list, // clear browser's default styles
            filterValidProps(cssProps), // apply our filtered cssProps
        ],

        // flex settings:
        display        : 'flex',
        flexDirection  : cssProps.orientation,
        justifyContent : 'start',
        alignItems     : 'stretch',



        '& >li': { // wrapper element
            extend: [
                // Contents.styles.main, // we don't needed the style, just make an invisible wrapper element

                // copy props & states from Content, without the style:
                filterValidProps(ccssProps), // apply Content's filtered cssProps
                Contents.states,             // apply Content's states
            ],

            display: 'block',
    


            // make a nicely rounded corners:
            border         : ecssProps.border, // moved from children
            overflow       : 'hidden', // clip the children at rounded corners
            '& + li': {
                borderTopWidth: 0, // remove duplicate border
            },
            '&:first-child': {extend:[
                border.radius.top(ecssProps.borderRadius),    // moved from children
            ]},
            '&:last-child' : {extend:[
                border.radius.bottom(ecssProps.borderRadius), // moved from children
            ]},



            '& >.lg-wrapper': { // main child elements
                extend:[
                    Elements.styles.main, // copy styles from Element, including Control's cssProps & Control's states.
                ],

                display       : 'block',
                position      : 'relative',

                border        : undefined, // move to parent
                borderRadius  : undefined, // move to parent



                [vars.animFn] : getVar(vars.animFw),
            } // main child elements
        }, // wrapper element
    },
    gradient: { '& >li >.lg-wrapper:not(._)': { // force to win conflict with main child element
        extend: [
            // copy the themes from Content:
            Contents.styles.gradient,
        ],
    }},
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface Props
    extends
        Contents.Props
{
    orientation? : Css.Orientation
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctStyles       = Contents.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, styles);

    
    
    return (
        <ul className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
            ].join(' ')}
        >
            {
                (Array.isArray(props.children) ? props.children : [props.children]).map((child, index) => {
                    if (!child) return child;

                    if ((typeof(child) === 'string') || (typeof(child) === 'number')) return (
                        <ListGroupItem key={index}>
                            {child}
                        </ListGroupItem>
                    );

                    return child;
                })
            }
        </ul>
    );
}