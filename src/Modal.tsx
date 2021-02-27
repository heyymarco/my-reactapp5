import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import
    Card,
    * as Cards             from './Card';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Card';
import colors              from './colors';
import * as Containers     from './Container'
import spacers             from './spacers';
import {
    general as typoGeneral
}                          from './typos/index';
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
    backg     : Css.Background
    boxShadow : Css.BoxShadow

    align     : Css.AlignItems
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';
// const middle  = 'middle';

// internal css vars:
// const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Contents.vars, {
});

// re-defined later, we need to construct varProps first
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    backg     : 'rgba(0, 0, 0, 0.5)',
    boxShadow : [[0, 0, '20px', 0, 'black']],
    
    align     : center,
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



const states = { };

const styles = {
    modalOpen: {
        // kill the scroll on the body:
        overflow: 'hidden',
    },
    main: { // overlay layer with limited width & height as scroller
        extend: [
            stripOuts.focusableElement, // clear browser's default styles
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
        ],

        boxShadow : undefined, // move to background layer

        // fill the entire screen:
        position : 'fixed',
        left     : 0,
        right    : 0,
        top      : 0,
        bottom   : 0,

        // grid properties:
        display      : 'grid',         // we use grid, so we can align the card both horizontally & vertically
        justifyItems : center,         // align center horizontally
        alignItems   : cssProps.align, // align (defaults center) vertically



        // scroller props:
        overflowX : 'hidden',
        overflowY : 'auto',
        '& >*': { // scrolling layer with additional paddings
            extend: [
                Containers.styles.main, // copy styles from Container
            ],

            width     : 'fit-content',
            height    : 'fit-content',
            boxSizing : 'content-box',



            '& >*': { // background layer
                display   : 'block',
                width     : 'fit-content',
                height    : 'fit-content',
                boxSizing : 'content-box',

                boxShadow : cssProps.boxShadow, // moved from overlay layer

                // set backg as same as page's backg (can be solid color or image):
                // to overcome card's transparent/trancluent backg color:
                backg        : typoGeneral.cssProps.backg,
                backgClip    : 'border-box',
                borderRadius : ecssProps.borderRadius,
                
                
                
                '& >*': { // card layer
                    // overwrite some Card's props:
                    '--crd-height'        : 'auto',             // overwrite card's height to auto resize
                },
            },
        },
    },
    scollable: {
        '& >*': { // scrolling layer with additional paddings
            '& >*': { // background layer
                '& >*': { // card layer
                    maxHeight : `calc(100vh - (${Containers.cssProps.y} * 2))`,
                    boxSizing : 'border-box',
    
                    '& >*': { // header, body, footer
                        overflowY: 'auto',
                    },
                },
            },
        },
    },
    alignStart: {
        alignItems: 'start',
    },
    alignCenter: {
        alignItems: center,
    },
    alignEnd: {
        alignItems: 'end',
    },
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



export interface VariantAlign {
    align?    : Css.AlignItems
}
export function useVariantAlign(props: VariantAlign, styles: Record<string, string>) {
    return {
        class: props.align ? (styles as any)[`align${pascalCase(props.align)}`] : null,
    };
}

export interface Props
    extends
        Elements.VariantTheme,
        Elements.VariantGradient,
        VariantAlign
{
    active?     : boolean
    scrollable? : boolean

    header?     : React.ReactNode
    children?   : React.ReactNode
    footer?     : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles       = useStyles();

    const variAlign    = useVariantAlign(props, styles);

    const stateActPass = useStateActivePassive(props);

    
    
    const cardProps: Cards.Props = Object.assign({}, props, {
        active: undefined,
    });
    return (
        <section className={[
                styles.main,
                (props.scrollable ? styles.scollable : null),

                variAlign.class,

                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={() => {
                stateActPass.handleAnimationEnd();
            }}

            tabIndex={-1}
        >
            <div>
                <div>
                    <Card {...cardProps} />
                </div>
            </div>
        </section>
    );
}