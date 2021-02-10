import colors           from '../colors';

import JssVarCollection from '../JssVarCollection';



// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';

// define default props' value to be stored into css vars:
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

    color                 : colors.dark  as string,
    backg                 : colors.white as string,
};

const props = Object.assign({},
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



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as { [index: string]: any },
    /*config :*/ { varPrefix: ''}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;