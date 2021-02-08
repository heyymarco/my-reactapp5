import JssVarCollection from './JssVarCollection';
import colors from './colors';



type TypoValue = number | string | (number | string)[];
type TypoList  = { [index: string]: TypoValue };
// const unset = 'unset';
const none  = 'none';



const basics: TypoList = {
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

const typos = Object.assign({},
    basics,
    {
        fontSizeXs        : [['calc(', basics.fontSizeNm, '*', 0.50  , ')']],
        fontSizeSm        : [['calc(', basics.fontSizeNm, '*', 0.75  , ')']],
        fontSizeMd        : [['calc(', basics.fontSizeNm, '*', 1.25  , ')']],
        fontSizeLg        : [['calc(', basics.fontSizeNm, '*', 1.50  , ')']],
        fontSizeXl        : [['calc(', basics.fontSizeNm, '*', 1.75  , ')']],
        fontSizeXxl       : [['calc(', basics.fontSizeNm, '*', 2.00  , ')']],
        fontSizeXxxl      : [['calc(', basics.fontSizeNm, '*', 2.25  , ')']],

        fontFamily        : basics.fontFamilySansSerief,
        fontFamilyDefault : basics.fontFamilySansSerief,

        fontWeight        : basics.fontWeightNormal,
        fontWeightDefault : basics.fontWeightNormal,

        lineHeight        : basics.lineHeightNm,
        lineHeightDefault : basics.lineHeightNm,
    }
);



const collection = new JssVarCollection<TypoValue>(
    typos,
    { varPrefix: ''},
    (raw)   => raw,
    (value) => `${value}`
);
const config = collection.config;
const items  = collection.items;
export { config, items as typos };
export default items;