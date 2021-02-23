import React               from 'react';

import * as Elements       from './Element';
import * as Indicators     from './Indicator';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Indicator';
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

    filterValidProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



type Orientation = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export interface CssProps {
    orientation : Orientation | string


    // anim props:

    filterActive          : string | string[][]

    '@keyframes active'   : object
    '@keyframes passive'  : object
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Indicators.vars, {
    /**
     * defines the foreground color at active state.
     */
    colorActive        : '--lg-colorActive',

    /**
     * a custom css props for manipulating foreground at active state.
     */
    colorActiveFn      : '--lg-colorActiveFn',

    /**
     * defines the background color at active state.
     */
    backgActive        : '--lg-backgActive',

    /**
     * a custom css props for manipulating background(s) at active state.
     */
    backgActiveFn      : '--lg-backgActiveFn',

    /**
     * (internal) Forwards animFn from parent element to children element.
    */
    animFw             : '--lg-animFw',


    // anim props:

    backgActivePassive : '--lg-backgActivePassive',
    colorActivePassive : '--lg-colorActivePassive',
});

// re-defined later, we need to construct varProps first
export const keyframesActive   = { from: undefined, to: undefined };
export const keyframesPassive  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    orientation : 'column',


    // anim props:

    filterActive          : ecssProps.filterNone,

    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    animActive            : [['150ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['300ms', 'ease-out', 'both', keyframesPassive ]],
};



Object.assign(keyframesActive, {
    from: Object.assign({}, Indicators.keyframesActive.from, {
        color: getVar(vars.colorFn),
        backg: getVar(vars.backgFn),
    }),
    to: Object.assign({}, Indicators.keyframesActive.to, {
        color: getVar(vars.colorActiveFn),
        backg: getVar(vars.backgActiveFn),
    })
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    to   : keyframesActive.from
});



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



const styles = {
    main: {
        extend: [
            stipOuts.list, // clear browser's default styles
        ],

        // flex settings:
        display        : 'flex',
        flexDirection  : cssProps.orientation,
        justifyContent : 'start',
        alignItems     : 'stretch',



        '& >li': { // wrapper element
            extend: [
                filterValidProps(icssProps), // apply Indicator's filtered cssProps
                Indicators.states,           // apply Indicator's states
            ],

            '--indi-filterActive' : cssProps.filterActive, // override Indicator's filter active
            '--indi-animActive'   : cssProps.animActive,   // override Indicator's anim active
            '--indi-animPassive'  : cssProps.animPassive,  // override Indicator's anim passive

            display: 'block',
    


            // make a nicely rounded corners:
            border         : ecssProps.border, // moved from children
            overflow       : 'hidden',
            '& + li': {
                borderTopWidth: 0,
            },
            '&:first-child': {extend:[
                border.radius.top(ecssProps.borderRadius),    // moved from children
            ]},
            '&:last-child' : {extend:[
                border.radius.bottom(ecssProps.borderRadius), // moved from children
            ]},



            [vars.animFw]: getVar(vars.animFn),
            '& >.lg-wrapper': { // main child element
                extend:[
                    Elements.styles.main, // copy styles from Control, including Control's cssProps & Control's states.
                ],

                display       : 'block',
                position      : 'relative',

                border        : undefined, // move to parent
                borderRadius  : undefined, // move to parent



                [vars.animFn] : getVar(vars.animFw),
            } // main element
        }, // wrapper element



        // we have 4 custom css props [colorActive, colorActiveFn, backgActive, backgActiveFn]
        // set the default value of them:

        // define the foreground color at active state:
        [vars.colorActive]: 'black', //TODO: remove hard coding

        // a custom css props for manipulating foreground at active state:
        [vars.colorActiveFn]: getVar(vars.colorActive), // set default value
        // color: getVar(vars.colorActiveFn),           // not apply yet

        // define the background color at active state:
        [vars.backgActive]: 'rgba(0,0,0, 0.2)', //TODO: remove hard coding

        // a custom css props for manipulating background(s) at active state:
        [vars.backgActiveFn]: getVar(vars.backgActive), // set default value
        // backg: getVar(vars.backgActiveFn),           // not apply yet
    },
    gradient: { '&>li>.lg-wrapper:not(._)': { // force to win conflict with main child element
        extend: [
            // copy the themes from Element:
            Elements.styles.gradient,
        ],

        // customize the backg at active state:
        [vars.backgActiveFn]: [ // active background with gradient
            ecssProps.backgGrad,
            getVar(vars.backgActive),
        ],
    }},
};

defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    // overwrite the backg & color props
    // we ignore the backg & color if the theme applied

    '--elm-color' : (colors as any)[`${theme}Cont`],
    '--elm-backg' : (colors as any)[`${theme}Thin`],


    // customize the backg & color at active state:
    [vars.colorActive] : (colors as any)[`${theme}Text`],
    [vars.backgActive] : themeColor,
}));

const useStyles = createUseStyles(styles);
export { styles, useStyles };



export interface Props
    extends
        Elements.Props
{
    orientation? : Orientation

    children?    : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
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
                    if (child) {
                        if (typeof(child) === 'string') return (
                            <ListGroupItem key={index}>
                                {child}
                            </ListGroupItem>
                        );
    
                        return child;
                    } // if

                    return undefined;
                })
            }
        </ul>
    );
}