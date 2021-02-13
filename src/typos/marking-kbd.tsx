import * as base        from './base';

import marks            from './marking-mark'
import codes,
      * as code         from './marking-code';
import colors           from '../colors';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends code.CssProps {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : codes.fontSize,
    fontFamily        : codes.fontFamily,
    fontWeight        : codes.fontWeight,
    fontStyle         : codes.fontStyle,
    textDecoration    : codes.textDecoration,
    lineHeight        : codes.lineHeight,

    color             : colors.white    as string,
    backg             : colors.grayDark as string,
    
    paddingX          : '0.4em',
    paddingY          : '0.2em',
    border            : marks.border,
    borderRadius      : marks.borderRadius,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'kbd'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'kbd,.kbd': {
        extend  : varProps,
        display : 'inline',
    },
});