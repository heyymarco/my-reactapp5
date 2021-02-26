import type * as Css       from './Css';

import React               from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Content';
import spacers             from './spacers';
import stripOuts           from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
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
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Contents.vars, {
    /**
     * a custom css props for manipulating background(s) at outlined state.
     */
    backgOlFn : '--crd-backgOlFn',
});

// re-defined later, we need to construct varProps first
const ecssProps = Elements.cssProps;
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

const states = Object.assign({}, Contents.states, {
    // customize the background(s) at outlined state:
    [vars.backgOlFn]: 'transparent',
});

const image = {
    // maximum width including parent's paddings:
    width   : [['calc(100% + (', ecssProps.paddingX, ' * 2))']], // Required because we use flexbox and this inherently applies align-self: stretch
    // height  : [['calc(100% + (', ecssProps.paddingY, ' * 2))']],

    // cancel-out parent's padding with negative margin:
    marginX : [['calc(0px - ', ecssProps.paddingX, ')']],
    marginY : [['calc(0px - ', ecssProps.paddingY, ')']],

    // add an extra spaces to the next sibling:
    '&:not(:last-child)': {
        marginBottom: ecssProps.paddingY,
    },
};

const cardItem = {
    // copy parent's flex properties:
    display: 'inherit',
    flexDirection: 'inherit',

    // moved paddings from main:
    paddingX: ecssProps.paddingX,
    paddingY: ecssProps.paddingY,



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
        display: 'flex', // do not take space if the img fail to load image

        '& >img': {
            width: '100%',
        }
    },
    '& >figure, & >img': image,
};

const styles = {
    main: {
        extend: [
            Contents.styles.main,       // copy styles from Content, including Content's cssProps & Content's states.
            filterValidProps(cssProps), // apply our filtered cssProps
            states,                     // apply our states
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

    gradient: { '&:not(._)': { // force to win conflict with main
        extend: [
            // copy the themes from Content:
            Contents.styles.gradient,
        ],

        // customize the backg at outlined state:
        [vars.backgOlFn]: ecssProps.backgGrad,
    }},
    cardOutline: { // already have specific rule :not-active => always win conflict with main
        extend:[
            stateNotActive({
                // apply the outlined-backg:
                backg : getVar(vars.backgOlFn),
        
                // customize the text-color (foreground):
                [vars.colorFn] : ccssProps.backgActive,
        
                // set border color = text-color:
                borderColor    : getVar(vars.colorFn),
            }),
        ],
    },
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

    const variSize       = Elements.useVariantSize(props, elmStyles);
    const variTheme      = Elements.useVariantTheme(props, ctStyles);
    const variGradient   = Elements.useVariantGradient(props, styles);
    const variCard       =          useVariantCard(props, styles);

    const stateEnbDis    = useStateEnabledDisabled(props);
    const stateActPass   = useStateActivePassive(props);

    
    
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
        </article>
    );
}