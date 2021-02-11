import React from 'react';

import { createUseStyles } from 'react-jss';

import colors, * as color from './colors';
import borders, * as border from './borders';
import spacers from './spacers';
import typos, { base as typoBase } from './typos/index';

import JssVarCollection from './jss-var-collection';
import { pascalCase } from 'pascal-case';



export interface Props
    extends typoBase.Props {

    fontSizeSm     : string | number | typoBase.Expression ;
    fontSizeLg     : string | number | typoBase.Expression ;

    color          : string                                ;
    backg          : string | string[][] | object          ;
    backgGrad      : string | string[][]                   ;

    paddingX       : string | number | typoBase.Expression ;
    paddingY       : string | number | typoBase.Expression ;
    paddingXSm     : string | number | typoBase.Expression ;
    paddingYSm     : string | number | typoBase.Expression ;
    paddingXLg     : string | number | typoBase.Expression ;
    paddingYLg     : string | number | typoBase.Expression ;

    border         : string | string[][]                   ;
    borderRadius   : string | number                       ;
    borderRadiusSm : string | number                       ;
    borderRadiusLg : string | number                       ;

    boxShadow      : string | string[][]                   ;

    transition     : string | string[][]                   ;

    filter         : string | string[][]                   ;
    filterHover    : string | string[][]                   ;

    anim           : string | string[][]                   ;
    animHover      : string | string[][]                   ;
    animLeave      : string | string[][]                   ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize       : typos.fontSizeNm,
    fontSizeSm     : [['calc((', typos.fontSizeSm, '+', typos.fontSizeNm, ')/2)']],
    fontSizeLg     : typos.fontSizeMd,
    fontFamily     : inherit,
    fontWeight     : inherit,
    fontStyle      : inherit,
    textDecoration : inherit,
    lineHeight     : inherit,

    color          : 'contrast',
    backg          : 'rgba(255, 255, 255, 0)', // transp white, so the foreg color will be black
    backgGrad      : [['linear-gradient(180deg, rgba(255,255,255, 0.15), rgba(255,255,255, 0))', 'border-box']],

    paddingX       : [['calc((', spacers.sm as string, '+', spacers.md as string, ')/2)']],
    paddingY       : [['calc((', spacers.xs as string, '+', spacers.sm as string, ')/2)']],
    paddingXSm     : spacers.sm as string,
    paddingYSm     : spacers.xs as string,
    paddingXLg     : spacers.md as string,
    paddingYLg     : spacers.sm as string,
    border         : borders.default,
    borderRadius   : border.radiuses.md,
    borderRadiusSm : border.radiuses.sm,
    borderRadiusLg : border.radiuses.lg,

    boxShadow      : [['0px', '0px', 'transparent']],

    transition     : [
        ['background', '300ms', 'ease-out'],
        ['color', '300ms', 'ease-out'],
        ['border', '300ms', 'ease-out'],
    ],

    filter         : 'brightness(100%)',
    filterHover    : 'brightness(85%)',

    anim           : 'elm-anim-none',
    animHover      : [['150ms', 'ease-out', 'both', 'elm-anim-hover']],
    animLeave      : [['150ms', 'ease-out', 'both', 'elm-anim-leave']],
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props as { [index: string]: any },
    /*config :*/ { varPrefix: 'elm'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };



const styles = {
    main: {
        extend: [
            varProps,
        ],
        fontSizeSm     : null,
        fontSizeLg     : null,
        backgGrad      : null,
        paddingXSm     : null,
        paddingYSm     : null,
        paddingXLg     : null,
        paddingYLg     : null,
        borderRadiusSm : null,
        borderRadiusLg : null,
        filterHover    : null,
        animHover      : null,
        animLeave      : null,
    },
}
type StylesAny = { [index: string]: any };
const varProps2 = varProps as StylesAny;
for (let size of ['sm', 'lg']) {
    size = pascalCase(size);
    (styles as StylesAny)[`size${size}`] = {
        fontSize     : varProps2[`fontSize${size}`],
        paddingX     : varProps2[`paddingX${size}`],
        paddingY     : varProps2[`paddingY${size}`],
        borderRadius : varProps2[`borderRadius${size}`],
    };
}
for (let [theme, value] of Object.entries(color.themes)) {
    theme = pascalCase(theme);
    (styles as StylesAny)[`theme${theme}`] = {
        backg: value,
    };
}
export { styles };
const useStyles = createUseStyles(styles);



export default function Element(props: any) {
    const classes = useStyles();
    return (
        <div className={[classes.main, (classes as StylesAny).Sm].join(' ')}>
            {props.children}
        </div>
    );
}