import
    React,
    { useContext }         from 'react';

import
    * as Elements          from './Element';
import
    * as Indicators        from './Indicator';
import {
    filterValidProps,
}                          from './Element';
import
    * as Controls          from './Control';
import {
    stateEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled,
    stateActive, statePassive, stateActivePassive,
}
                           from './Control';
import
    * as border            from './borders';
import spacers             from './spacers';
import
    colors,
    * as color             from './colors';
import stipOuts            from './strip-outs';
import ListGroupItem       from './ListGroupItem';
import type * as ListGroupItems from './ListGroupItem';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface CssProps {
    // '@keyframes enabled'  : object
    // '@keyframes disabled' : object
    '@keyframes active'   : object
    '@keyframes passive'  : object

    // animEnabled           : string | (string | object)[][]
    // animDisabled          : string | (string | object)[][]
    animActive            : string | (string | object)[][]
    animPassive           : string | (string | object)[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Indicators.vars, {
    backgActiveFn      : '--lg-backgActiveFn',
    backgActive        : '--lg-backgActive',
    colorActive        : '--lg-colorActive',


    // anim props:

    backgActivePassive : '--lg-backgActivePassive',
    colorActivePassive : '--lg-colorActivePassive',
    animActivePassive  : '--lg-animActivePassive',
});

// define default cssProps' value to be stored into css vars:
// re-defined later, we need to construct varProps first
// const keyframesEnabled  = { from: undefined, to: undefined };
// const keyframesDisabled = { from: undefined, to: undefined };
const keyframesActive   = { from: undefined, to: undefined };
const keyframesPassive  = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
const icssProps = Indicators.cssProps;
const _cssProps: CssProps = {
    // '@keyframes enabled'  : keyframesEnabled,
    // '@keyframes disabled' : keyframesDisabled,
    '@keyframes active'   : keyframesActive,
    '@keyframes passive'  : keyframesPassive,
    // animEnabled           : [['300ms', 'ease-out', 'both', keyframesEnabled ]],
    // animDisabled          : [['300ms', 'ease-out', 'both', keyframesDisabled]],
    animActive            : [['1000ms', 'ease-out', 'both', keyframesActive  ]],
    animPassive           : [['1000ms', 'ease-out', 'both', keyframesPassive ]],
};

// Object.assign(keyframesDisabled, {
//     from: {
//         filter: [[
//             Elements.cssProps.filter,
//             getVar(Controls.vars.filterHoverLeave), // first priority, but now become the second priority
//             // getVar(vars.filterEnabledDisabled), // last priority, but now become the first priority
//         ]],

//         // backg: getVar(vars.backgActivePassive),
//         // color: getVar(vars.colorActivePassive),
//     },
//     to: {
//         filter: [[
//             Elements.cssProps.filter,
//             getVar(Controls.vars.filterHoverLeave), // first priority, but now become the second priority
//             getVar(Controls.vars.filterEnabledDisabled), // last priority, but now become the first priority
//         ]],

//         backg: getVar(vars.backgActivePassive),
//         color: getVar(vars.colorActivePassive),
//     }
// });
// Object.assign(keyframesEnabled, {
//     from : keyframesDisabled.to,
//     to   : keyframesDisabled.from
// });

Object.assign(keyframesActive, {
    from: {
    },
    to: {
        backg: getVar(vars.backgActivePassive),
        color: getVar(vars.colorActivePassive),
    }
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



const states = {
    [vars.filterEnabledDisabled]   : ecssProps.filterNone,
    [vars.filterHoverLeave]        : ecssProps.filterNone,
    [vars.filterActivePassive]     : ecssProps.filterNone,
    [vars.backgActivePassive]      : getVar(vars.backgFn),
    [vars.colorActivePassive]      : ecssProps.color,

    [vars.animEnabledDisabled]     : ecssProps.animNone,
    [vars.animActivePassive]       : ecssProps.animNone,

    '& >*': {
        anim: [
            ecssProps.anim,
            getVar(vars.animEnabledDisabled), // 1st : ctrl must be enabled
            getVar(vars.animActivePassive),   // 4th : ctrl got pressed
        ],
    },


    extend:[
        stateEnabledDisabled({
            [vars.filterEnabledDisabled] : icssProps.filterDisabled,
        }),
        stateEnabled({
            [vars.animEnabledDisabled]   : icssProps.animEnabled,
        }),
        stateDisabled({
            [vars.animEnabledDisabled]   : icssProps.animDisabled,
        }),
        {
            '&.disabled:not(.disable)'  : {extend:[ // if ctrl was disabled at the first page load, disable first animation
                Controls.stateNoAnimStartup(),
            ]},
        },
        

        // stateNotDisabled({extend:[
            stateActivePassive({
                [vars.backgActivePassive]     : getVar(vars.backgActiveFn),
                [vars.colorActivePassive]     : getVar(vars.colorActive),
            }),
            stateActive({
                [vars.animActivePassive]      : cssProps.animActive,
            }),
            statePassive({
                [vars.animActivePassive]      : cssProps.animPassive,
            }),
            {
                '&.active,&.actived': { // if activated programmatically (not by user input)
                    '& >*': {
                        anim: [
                            ecssProps.anim,
                            getVar(vars.animActivePassive),   // 1st : ctrl already pressed, then released
                            getVar(vars.animEnabledDisabled), // 4th : ctrl disabled
                        ],
                    },
                },
                '&.actived': {extend:[ // if ctrl was activated at the first page load, disable first animation
                    Controls.stateNoAnimStartup(),
                ]},
            },
        // ]}),
    ],
};

const styles = {
    main: {
        extend: [
            stipOuts.list,
        ],


        display       : 'flex',
        flexDirection : 'column',


        [vars.backgFn]       : [ecssProps.backg],           // default background
        [vars.backgActiveFn] : getVar(vars.backgActive), // active  background

        borderRadius         : ecssProps.borderRadius,


        '& >*': {
            extend: [
                states,
            ],

            display: 'block',


            borderRadius : undefined,
            overflow     : 'hidden',
    
            '& + *': {
                borderTopWidth: 0,
            },
            '&:first-child': {extend:[
                border.radius.top('inherit'),
            ]},
            '&:last-child' : {extend:[
                border.radius.bottom('inherit'),
            ]},

            border: ecssProps.border,


            '& >*': {
                extend: [
                    filterValidProps(Elements.cssProps),
                    filterValidProps(cssProps),
                ],

                border       : undefined,
                borderRadius : 0,
                backg        : getVar(vars.backgFn),
    
    
                display        : 'block',
                position       : 'relative',
            }
        },
    },
    gradient: { '&:not(._)': { // force to win conflict with main
        [vars.backgFn]: [      // default background with gradient
            ecssProps.backgGrad,
            ecssProps.backg,
        ],
        [vars.backgActiveFn]: [ // active  background with gradient
            ecssProps.backgGrad,
            getVar(vars.backgActive),
        ],
    }},
};
Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    // overwrite the backg & color props
    // we ignore the backg & color if the theme applied

    '--elm-backg' : (colors as any)[`${theme}Thin`],
    '--elm-color' : (colors as any)[`${theme}Cont`],


    // customize the backg & color at active state:
    [vars.backgActive] : themeColor,
    [vars.colorActive] : (colors as any)[`${theme}Text`],
}));

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



type Child = string|React.ReactElement<ListGroupItems.Props>;
type Children = Child | Array<Child>;
export interface Props
    extends
        Elements.Props
{
    children?: Children
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, styles);
    const variGradient   = Elements.useVariantGradient(props, styles);

    // useContext()

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
                })
            }
        </ul>
    );
}