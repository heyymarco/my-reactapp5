import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Content';
import spacers             from './spacers';
import stripOuts           from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface CssProps {
    height            : Css.Height

    capColor          : Css.Color
    capBackg          : Css.Background
    capBackdropFilter : Css.Filter
}
const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = Contents.vars;

// re-defined later, we need to construct varProps first
// const ecssProps = Elements.cssProps;
const ccssProps = Contents.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    height            : '100%', // set height to maximum if parent container has specific height, otherwise no effect

    capColor          : unset,
    capBackg          : unset,
    capBackdropFilter : 'brightness(0.8)',
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
        if ((/^(cap)/).test(key)) continue;
        cssPropsCopy[key] = value;
    }
    return cssPropsCopy;
}

const states = Contents.states;

const image = {
    display: 'block', // remove unecessary space to the next sibling

    // maximum width including parent's paddings:
    width   : [['calc(100% + (', ccssProps.paddingX, ' * 2))']], // Required because we use flexbox and this inherently applies align-self: stretch
    // height  : [['calc(100% + (', ccssProps.paddingY, ' * 2))']],

    // cancel-out parent's padding with negative margin:
    marginX : [['calc(0px - ', ccssProps.paddingX, ')']],
    marginY : [['calc(0px - ', ccssProps.paddingY, ')']],

    // allow prev sibling to add an extra spaces:
    '&:not(:first-child)': {
        marginTop: 0,
    },

    // add an extra spaces to the next sibling:
    '&:not(:last-child)': {
        marginBottom: ccssProps.paddingY,
    },
};

const cardItem = {
    display: 'block',

    // default card's items are unresizeable (excepts for card's body):
    flex: [[0, 0, 'auto']],

    // moved paddings from main:
    paddingX: ccssProps.paddingX,
    paddingY: ccssProps.paddingY,



    // handle <a> as card-link:
    '& >a': {
        '& +a': {
            marginLeft: spacers.default,
        },
    },
    

    // handle <figure> & <img> as card-image:
    overflow: 'hidden', // clip the oversized overlay
    '& >figure': {
        extend: [
            stripOuts.figure, // clear browser's default styles
        ],

        '& >img': {
            display: 'block', // remove unecessary space to the next sibling
            width: '100%',
        }
    },
    '& >figure, & >img': image,
};

const styles = {
    basic: {
        extend: [
            Contents.styles.basic,      // copy styles from Content
            filterValidProps(cssProps), // apply our filtered cssProps
        ],

        display: 'flex',
        flexDirection: 'column',

        overflow: 'hidden', // clip the children at rounded corners

        // move paddings to [header, body, footer]:
        paddingX: undefined,
        paddingY: undefined,

        minWidth: 0, // See https://github.com/twbs/bootstrap/pull/22740#issuecomment-305868106
        wordWrap: 'break-word',
        backgroundClip: 'border-box',
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },
    header: {
        extend: [
            cardItem,

            // apply cssProps ending with ***Cap:
            filterPrefixProps(cssProps, 'cap'),
        ],
    },
    footer: {
        extend: [
            cardItem,

            // apply cssProps ending with ***Cap:
            filterPrefixProps(cssProps, 'cap'),
        ],
    },
    body: {
        extend: [
            cardItem,
        ],

        // Enable `flex-grow: 1` for decks and groups so that card blocks take up
        // as much space as possible, ensuring footers are aligned to the bottom.
        flex: [[1, 1, 'auto']],

        '&:not(:first-child)': {
            // add border between header & body:
            borderTop: 'inherit',
        },
        '&:not(:last-child)': {
            // add border between body & footer:
            borderBottom: 'inherit',
        }
    },

    cardOutline: Elements.styles.outline,
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



type CardStyle = 'outline';
export interface VariantCard {
    cardStyle?: CardStyle
}
export function useVariantCard(props: VariantCard, styles: Record<string, string>) {
    return {
        class: props.cardStyle ? (styles as any)[`card${pascalCase(props.cardStyle)}`] : null,
    };
}

export interface Props
    extends
        Contents.Props,
        VariantCard
{
    header? : React.ReactNode
    footer? : React.ReactNode
}
export default function ListGroup(props: Props) {
    const styles         =          useStyles();
    const elmStyles      = Elements.useStyles();
    const ctStyles       = Contents.useStyles();

    const variSize       = Elements.useVariantSize(props, ctStyles);
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, elmStyles);
    const variCard       =          useVariantCard(props, styles);

    const stateEnbDis    = useStateEnableDisable(props);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);

    
    
    return (
        <article className={[
                styles.main,

                variSize.class,
                variTheme.class,
                variGradient.class,
                variCard.class,

                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
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
        </article>
    );
}