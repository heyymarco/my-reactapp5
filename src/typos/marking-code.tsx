import * as base        from './base';
import type * as mark   from './marking-mark';

import gens             from './general';
import colors           from '../colors';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends mark.CssProps {
}
// const unset   = 'unset';
const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : [['calc((', gens.fontSizeSm, '+', gens.fontSizeMd, ')/2)']],
    fontFamily        : gens.fontFamilyMonospace,
    fontWeight        : gens.fontWeightNormal,
    fontStyle         : none,
    textDecoration    : none,
    lineHeight        : inherit,

    color             : colors.pink as string,
    backg             : none,
    
    paddingX          : none,
    paddingY          : none,
    border            : none,
    borderRadius      : none,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'code'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'code,.code,var,.var,samp,.samp': {
        extend  : varProps,
        display : 'inline',
    },
});