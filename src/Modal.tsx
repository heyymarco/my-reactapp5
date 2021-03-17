import type * as Css       from './Css';

import
    React, {
    useMemo, useRef, useEffect
}                          from 'react';

import * as Elements       from './Element';
import
    Card,
    * as Cards             from './Card';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Card';
import * as Containers     from './Container'
import {
    general as typoGeneral
}                          from './typos/index';
import * as stripOuts      from './strip-outs';
import Button              from './Button';
import ButtonIcon          from './ButtonIcon';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateActive,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface CssProps {
    align                     : Css.AlignItems

    boxShadow                 : Css.BoxShadow


    // anim props:

    '@keyframes active'       : Css.Keyframes
    '@keyframes passive'      : Css.Keyframes
    animActive                : Css.Animation
    animPassive               : Css.Animation

    '@keyframes backgActive'  : Css.Keyframes
    '@keyframes backgPassive' : Css.Keyframes
    backgAnimActive           : Css.Animation
    backgAnimPassive          : Css.Animation
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const center  = 'center';
// const middle  = 'middle';

// internal css vars:
export const vars = {
    /**
     * final composite animation(s) at the content (card) layer.
     */
    animFn      : '--mod-animFn',

    /**
     * final composite animation(s) at the backg (overlay) layer.
     */
    backgAnimFn : '--mod-backgAnimFn',


    // forwards:
    backgFw     : '--mod-backgFw',
    boxShadowFw : '--mod-boxShadowFw',
    animFw      : '--mod-animFw',
    heightFw    : '--mod-heightFw',
};

// re-defined later, we need to construct varProps first
export const keyframesActive       = { from: undefined, to: undefined };
export const keyframesPassive      = { from: undefined, to: undefined };
export const keyframesBackgActive  = { from: undefined, to: undefined };
export const keyframesBackgPassive = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    align                     : center,

    boxShadow                 : [[0, 0, '10px', 'black']],
    

    // anim props:

    '@keyframes active'       : keyframesActive,
    '@keyframes passive'      : keyframesPassive,
    animActive                : [['300ms', 'ease-out', 'both', keyframesActive ]],
    animPassive               : [['500ms', 'ease-in',  'both', keyframesPassive]],

    '@keyframes backgActive'  : keyframesBackgActive,
    '@keyframes backgPassive' : keyframesBackgPassive,
    backgAnimActive           : [['300ms', 'ease-out', 'both', keyframesBackgActive ]],
    backgAnimPassive          : [['500ms', 'ease-in',  'both', keyframesBackgPassive]],
};



Object.assign(keyframesActive, {
    from: {
        opacity   : 0,
        transform : 'scale(0)',
    },
    '70%': {
        transform : 'scale(1.1)',
    },
    to: {
        opacity   : 1,
        transform : 'scale(1)',
    }
});
Object.assign(keyframesPassive, {
    from : keyframesActive.to,
    '30%': (keyframesActive as any)['70%'],
    to   : keyframesActive.from
});

Object.assign(keyframesBackgActive, {
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
        background: 'rgba(0,0,0, 0.5)',
    }
});
Object.assign(keyframesBackgPassive, {
    from : keyframesBackgActive.to,
    to   : keyframesBackgActive.from
});



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



const fnVars = {
    // customize final composite animation(s) at the content (card) layer:
    [vars.animFn]      : none,

    // customize final composite animation(s) at the backg (overlay) layer:
    [vars.backgAnimFn] : none,
};
const states = {
    extend:[
        stateActive({ // [activating, actived]
            [vars.animFn]      : cssProps.animActive,
            [vars.backgAnimFn] : cssProps.backgAnimActive,
        }),
        statePassivating({ // [passivating]
            [vars.animFn]      : cssProps.animPassive,
            [vars.backgAnimFn] : cssProps.backgAnimPassive,
        }),
        stateNotActivePassive({ // hides the modal if not [activating, actived, passivating]
            display: none,
        }),



        fnVars,
    ],
};

const styles = {
    modalOpen: {
        // kill the scroll on the body:
        overflow: 'hidden',
    },

    basic: { // overlay layer with limited width & height as scroller
        extend: [
            stripOuts.focusableElement, // clear browser's default styles
            filterPrefixProps(cssProps, 'backg'), // apply our cssProps starting with backg***
        ],

        // a custom css props for manipulating backg's animation(s):
        anim: getVar(vars.backgAnimFn), // apply prop

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
                Containers.styles.basic, // copy styles from Container
            ],

            width     : 'fit-content',
            height    : 'fit-content',
            boxSizing : 'content-box',



            [vars.backgFw]     : ecssProps.backg,
            [vars.boxShadowFw] : ecssProps.boxShadow,
            [vars.animFw]      : ecssProps.anim,
            [vars.heightFw]    : Cards.cssProps.height,
            '& >*': { // card layer
                // overwrite some Card's props:
                '--elm-backg'       : typoGeneral.cssProps.backg, // set backg as same as page's backg (can be solid color or image)
                '--elm-boxShadow'   : cssProps.boxShadow,
                [Cards.vars.animFn] : getVar(vars.animFn), // apply prop
                '--crd-height'      : 'auto', // overwrite card's height to auto resize

                '& >*': {
                    '--elm-backg'       : getVar(vars.backgFw),
                    '--elm-boxShadow'   : getVar(vars.boxShadowFw),
                    [Cards.vars.animFn] : getVar(vars.animFw),
                    '--crd-height'      : getVar(vars.heightFw),
                },
            },
        },
    },
    main: {
        extend: [
            'basic', // apply basic styles
            states,  // apply our states
        ],
    },

    scollable: {
        '& >*': { // scrolling layer with additional paddings
            '& >*': { // card layer
                maxHeight : `calc(100vh - (${Containers.cssProps.y} * 2))`,
                boxSizing : 'border-box',

                '& >*': { // header, body, footer
                    overflowY: 'auto',
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

    title: {
        display        : 'flex',
        justifyContent : 'space-between',
        alignItems     : center,
    },
    actionBar: {
        display        : 'flex',
        justifyContent : 'flex-end',
        alignItems     : center,
    },
};

const useStyles = createUseStyles(styles);
export { fnVars, states, styles, useStyles };



export interface VariantAlign {
    align?   : Css.AlignItems
}
export function useVariantAlign(props: VariantAlign, styles: Record<string, string>) {
    return {
        class: props.align ? (styles as any)[`align${pascalCase(props.align)}`] : null,
    };
}

export type CloseType = 'ui' | 'backg' | 'shortcut';
export interface Props
    extends
        Elements.VariantTheme,
        Elements.VariantGradient,
        VariantAlign
{
    // accessibility:
    active?     : boolean

    // actions:
    onClose?    : (closeType: CloseType) => void

    // layouts:
    scrollable? : boolean

    // children:
    header?     : React.ReactNode
    children?   : React.ReactNode
    footer?     : React.ReactNode
}
export default function Modal(props: Props) {
    const modStyles    = useStyles();

    const variAlign    = useVariantAlign(props, modStyles);

    const stateActPass = useStateActivePassive(props);


    
    // dynamic cardProps based on current props:
    const cardProps = useMemo(() => {
        const cardProps: Cards.Props = {
            ...props,
            active: undefined,
        };

        // create default header:
        if ((cardProps.header === undefined) || (typeof(cardProps.header) === 'string')) {
            cardProps.header = (
                <h5 className={modStyles.title}>
                    {cardProps.header}
                    <ButtonIcon btnStyle='link' theme='secondary' aria-label='Close' icon='close' onClick={() => props.onClose?.('ui')} />
                </h5>
            );
        }

        // create default footer:
        if ((cardProps.footer === undefined) || (typeof(cardProps.footer) === 'string')) {
            cardProps.footer = (
                <p className={modStyles.actionBar}>
                    {cardProps.footer}
                    <Button theme='primary' text='Close' onClick={() => props.onClose?.('ui')} />
                </p>
            );
        }


        return cardProps;
    }, [props, modStyles.title, modStyles.actionBar]);


    // if actived => auto focus the ui:
    const modalUi = useRef<HTMLElement>(null);
    useEffect(() => {
        if (stateActPass.actived) modalUi.current?.focus();
    }, [stateActPass.actived]);



    return (
        <section className={[
                modStyles.main,
                (props.scrollable ? modStyles.scollable : null),

                variAlign.class,

                stateActPass.class,
            ].join(' ')}

            // actions:

            // watch [escape key] on the whole modal, including card & children:
            onKeyDown={(e) => ((e.code === 'Escape') || (e.key === 'Escape')) && props.onClose?.('shortcut')}

            // watch left click on the backg only (not at the card):
            onClick={(e)   => (e.target === e.currentTarget) && (e.type === 'click') && props.onClose?.('backg')}

            // turn the modal as a focusable control but cannot be focused by tab key:
            tabIndex={-1}

            // make a reference for focusing programatically at shown (active = true)
            ref={modalUi}
        

            onAnimationEnd={(e) => {
                stateActPass.handleAnimationEnd(e);
            }}
        >
            <div>
                <Card {...cardProps} />
            </div>
        </section>
    );
}