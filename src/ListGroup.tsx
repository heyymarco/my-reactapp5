import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Content';
import * as border         from './borders';
import * as stripOuts      from './strip-outs';
import ListGroupItem       from './ListGroupItem';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateDefault, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
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
export const vars = {...Contents.vars,
    /**
     * (internal use) Forwards anim to children element.
    */
    animFw: '--lg-animFw',
};

// re-defined later, we need to construct varProps first
const ecssProps = Elements.cssProps;
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



const wrapElm  = '& >li';
const mainElm = '& >.lg-wrapper';

const fnVars = Contents.fnVars; // copy Content's fnVars
const states = {extend:[ Contents.states, { // copy Content's states
    // customize the anim prop to be forwarded to another element(s):
    [vars.animFw]: getVar(vars.animFn),
}]};

const styles = {
    basic: {
        extend: [
            stripOuts.list, // clear browser's default styles
            filterValidProps(cssProps), // apply our filtered cssProps
        ],

        // flex settings:
        display        : 'flex',
        flexDirection  : cssProps.orientation,
        justifyContent : 'start',
        alignItems     : 'stretch',



        [wrapElm]: { // wrapper element
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



            [mainElm]: { // main child elements
                extend:[
                    Elements.styles.basic, // copy styles from Element
                ],

                display       : 'block',
                position      : 'relative',

                border        : undefined, // move to parent
                borderRadius  : undefined, // move to parent



                [vars.animFn] : getVar(vars.animFw),
            } // main child elements
        }, // wrapper element
    },
    main: {
        extend: [
            'basic',   // apply basic styles
            // states, // NOT apply our states here, but in child <li>
        ],



        [wrapElm]: { // wrapper element
            extend: [
                states, // apply our states
            ],
        },
    },
    gradient: {
        '& >li >.lg-wrapper': Elements.styles.gradient,
    },
};

const useStyles = createUseStyles(styles);
export { fnVars, states, styles, useStyles };



export interface Props
    extends
        Contents.Props
{
    orientation? : Css.Orientation
}
export default function ListGroup(props: Props) {
    const ctStyles       = Contents.useStyles();
    const lgStyles       =          useStyles();

    const variSize       = Elements.useVariantSize(props, ctStyles);
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, lgStyles);

    
    
    return (
        <ul className={[
                lgStyles.main,

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