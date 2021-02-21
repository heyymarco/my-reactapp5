import
    React,
    { useContext }         from 'react';

import
    * as Elements          from './Element';
import {
    filterValidProps
}                          from './Element';
import
    * as Controls          from './Control';
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
    backgOverPassive   : string | string[][]
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';
// const middle  = 'middle';

// css vars:
const getVar = (name: string) => `var(${name})`;
export const vars = {
    // backgFn        : '--lg-backgFn',
};

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    backgOverPassive      : `linear-gradient(${colors.backgTransp}, ${colors.backgTransp})`,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'lg'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const styles = {
    main: {
        extend: [
            stipOuts.list,
        ],

        
        display       : 'flex',
        flexDirection : 'column',

        borderRadius  : Elements.cssProps.borderRadius,

        [Elements.vars.backgFn]: [Elements.cssProps.backg],



        '& >*': {
            extend: [
                // Elements.styles.main,
                filterValidProps(Elements.cssProps),
                filterValidProps(varProps),
            ],

            display        : 'block',
            position       : 'relative',
            


            backg: getVar(Elements.vars.backgFn),
            


            '& + *': {
                borderTopWidth: 0,
            },

            borderRadius: undefined,
            '&:first-child': {extend:[
                border.radius.top('inherit'),
            ]},
            '&:last-child' : {extend:[
                border.radius.bottom('inherit'),
            ]},
        },
    },
};
Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    [Elements.vars.backg]: [
        varProps.backgOverPassive,
        themeColor,
    ],
    [Elements.vars.color]: (colors as any)[`${theme}Cont`],
}));

const useStyles = createUseStyles(styles);
export { styles, useStyles };



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
    const variGradient   = Elements.useVariantGradient(props, elmStyles);

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