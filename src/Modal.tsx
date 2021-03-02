import type * as Css       from './Css';

import
    React, {
    useMemo, useRef, useEffect
}                          from 'react';

import * as Elements       from './Element';
import * as Contents       from './Content';
import
    Card,
    * as Cards             from './Card';
import {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Card';
import * as Containers     from './Container'
import {
    general as typoGeneral
}                          from './typos/index';
import stripOuts           from './strip-outs';
import Button              from './Button';
import ButtonIcon          from './ButtonIcon';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface CssProps {
    align     : Css.AlignItems

    boxShadow : Css.BoxShadow


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
const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Contents.vars, {
    /**
     * custom css props for manipulating animation(s).
     */
    animFn       : '--mod-animFn',

    /**
     * custom css props for manipulating backg's animation(s).
     */
    animBackgFn  : '--mod-animBackgFn',
});

// re-defined later, we need to construct varProps first
export const keyframesActive       = { from: undefined, to: undefined };
export const keyframesPassive      = { from: undefined, to: undefined };
export const keyframesBackgActive  = { from: undefined, to: undefined };
export const keyframesBackgPassive = { from: undefined, to: undefined };
const ecssProps = Elements.cssProps;
// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    align     : center,

    boxShadow : [[0, 0, '10px', 'black']],
    

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
        opacity: 0,
        transform: 'scale(0)',
    },
    '70%': {
        transform: 'scale(1.1)',
    },
    to: {
        opacity: 1,
        transform: 'scale(1)',
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



const states = {
    // customize the anim:
    [vars.animFn]      : none,
    [vars.animBackgFn] : none,



    extend:[
        stateActive({
            [vars.animFn]      : cssProps.animActive,
            [vars.animBackgFn] : cssProps.backgAnimActive,
        }),
        statePassive({
            [vars.animFn]      : cssProps.animPassive,
            [vars.animBackgFn] : cssProps.backgAnimPassive,
        }),
        stateNotActivePassive({ // hides the modal if not [activating, actived, deactivating]
            display: none,
        }),
    ],
};

const styles = {
    modalOpen: {
        // kill the scroll on the body:
        overflow: 'hidden',
    },
    main: { // overlay layer with limited width & height as scroller
        extend: [
            stripOuts.focusableElement, // clear browser's default styles
            filterPrefixProps(cssProps, 'backg'), // apply our cssProps starting with backg***
            states,                     // apply our states
        ],

        // a custom css props for manipulating backg's animation(s):
        anim: getVar(vars.animBackgFn), // apply prop

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
                extend: [
                    filterValidProps(cssProps), // apply our filtered cssProps
                ],

                // a custom css props for manipulating animation(s):
                anim: getVar(vars.animFn), // apply prop

                display   : 'block',
                width     : 'fit-content',
                height    : 'fit-content',
                boxSizing : 'content-box',

                // set backg as same as page's backg (can be solid color or image):
                // to overcome card's transparent/trancluent backg color:
                backg        : typoGeneral.cssProps.backg,
                backgClip    : 'border-box',
                borderRadius : ecssProps.borderRadius,
                
                
                
                '& >*': { // card layer
                    // overwrite some Card's props:
                    '--crd-height'    : 'auto', // overwrite card's height to auto resize
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

    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
};

const useStyles = createUseStyles(styles);
export { states, styles, useStyles };



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
    active?     : boolean
    scrollable? : boolean

    header?     : React.ReactNode
    children?   : React.ReactNode
    footer?     : React.ReactNode

    onClose?    : (closeType: CloseType) => void
}
export default function Modal(props: Props) {
    const styles       = useStyles();

    const variAlign    = useVariantAlign(props, styles);

    const stateActPass = useStateActivePassive(props);


    
    const cardProps = useMemo(() => {
        const cardProps: Cards.Props = Object.assign({}, props, {
            active: undefined,
        });

        if ((cardProps.header === undefined) || (typeof(cardProps.header) === 'string')) {
            cardProps.header = (
                <h5 className={styles.title}>
                    {cardProps.header}
                    <ButtonIcon btnStyle='link' theme='secondary' aria-label='Close' icon='close' onClick={() => props.onClose?.('ui')} />
                </h5>
            );
        }

        if ((cardProps.footer === undefined) || (typeof(cardProps.footer) === 'string')) {
            cardProps.footer = (
                <p className={styles.actionBar}>
                    {cardProps.footer}
                    <Button theme='primary' text='Close' onClick={() => props.onClose?.('ui')} />
                </p>
            );
        }


        return cardProps;
    }, [props, styles.title, styles.actionBar]);


    const modalUi = useRef<HTMLElement>(null);
    useEffect(() => {
        if (stateActPass.actived) modalUi.current?.focus();
    }, [stateActPass.actived]);



    return (
        <section className={[
                styles.main,
                (props.scrollable ? styles.scollable : null),

                variAlign.class,

                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={(e) => {
                stateActPass.handleAnimationEnd(e);
            }}

            // watch [escape key] on the whole modal, including card & children:
            onKeyDown={(e) => ((e.code === 'Escape') || (e.key === 'Escape')) && props.onClose?.('shortcut')}

            // watch left click on the backg only (not at the card):
            onClick={(e)   => (e.target === e.currentTarget) && (e.type === 'click') && props.onClose?.('backg')}

            // turn the modal as a focusable control but cannot be focused by tab key:
            tabIndex={-1}

            // make a reference for focusing programatically at shown (active = true)
            ref={modalUi}
        >
            <div>
                <div>
                    <Card {...cardProps} />
                </div>
            </div>
        </section>
    );
}