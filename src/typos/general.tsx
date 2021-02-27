import type * as Css    from '../Css';

import colors           from '../colors';

import JssVarCollection from '../jss-var-collection';



export interface CssProps {
    fontSize              : Css.FontSize
    fontSizeXs            : Css.FontSize
    fontSizeSm            : Css.FontSize
    fontSizeNm            : Css.FontSize
    fontSizeMd            : Css.FontSize
    fontSizeLg            : Css.FontSize
    fontSizeXl            : Css.FontSize
    fontSizeXxl           : Css.FontSize
    fontSizeXxxl          : Css.FontSize

    fontFamily            : Css.FontFamily
    fontFamilySansSerief  : Css.FontFamily
    fontFamilyMonospace   : Css.FontFamily

    fontWeight            : Css.FontWeight
    fontWeightLighter     : Css.FontWeight
    fontWeightLight       : Css.FontWeight
    fontWeightNormal      : Css.FontWeight
    fontWeightBold        : Css.FontWeight
    fontWeightBolder      : Css.FontWeight

    fontStyle             : Css.FontStyle
    textDecoration        : Css.TextDecoration

    lineHeight            : Css.LineHeight
    lineHeightSm          : Css.LineHeight
    lineHeightNm          : Css.LineHeight
    lineHeightLg          : Css.LineHeight

    color                 : Css.Color

    /**
     * Defaults is color's backg.
     * It can be an image with the average color as color's backg.
     */
    backg                 : Css.Background
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const basics = {
    fontSizeNm            : '1rem',

    fontFamilySansSerief  : ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', '"Liberation Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
    fontFamilyMonospace   : ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],

    fontWeightLighter     : 'lighter',
    fontWeightLight       : 300,
    fontWeightNormal      : 400,
    fontWeightBold        : 700,
    fontWeightBolder      : 'bolder',

    fontStyle             : none,
    textDecoration        : none,

    lineHeightSm          : 1.25,
    lineHeightNm          : 1.50,
    lineHeightLg          : 2.00,

    color                 : colors.foreg as string,
    backg                 : colors.backg as string, // defaults is color's backg. It can be an image with the average color as color's backg.
};

const cssProps: CssProps = Object.assign({},
    basics,
    {
        fontSize          : basics.fontSizeNm,
        fontSizeXs        : [['calc(', basics.fontSizeNm, '*', 0.50  , ')']],
        fontSizeSm        : [['calc(', basics.fontSizeNm, '*', 0.75  , ')']],
        fontSizeMd        : [['calc(', basics.fontSizeNm, '*', 1.25  , ')']],
        fontSizeLg        : [['calc(', basics.fontSizeNm, '*', 1.50  , ')']],
        fontSizeXl        : [['calc(', basics.fontSizeNm, '*', 1.75  , ')']],
        fontSizeXxl       : [['calc(', basics.fontSizeNm, '*', 2.00  , ')']],
        fontSizeXxxl      : [['calc(', basics.fontSizeNm, '*', 2.25  , ')']],

        fontFamily        : basics.fontFamilySansSerief,

        fontWeight        : basics.fontWeightNormal,

        lineHeight        : basics.lineHeightNm,
    }
);



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: ''}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;