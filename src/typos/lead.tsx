import * as base        from './base';

import pars             from './paragraph';
import type * as par    from './paragraph';
import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends par.CssProps {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : gens.fontSizeMd,
    fontFamily        : pars.fontFamily,
    fontWeight        : gens.fontWeightLight,
    fontStyle         : pars.fontStyle,
    textDecoration    : pars.textDecoration,
    lineHeight        : pars.lineHeight,

    color             : pars.color,
    
    marginBlockStart  : pars.marginBlockStart,
    marginBlockEnd    : pars.marginBlockEnd,
    marginInlineStart : pars.marginInlineStart,
    marginInlineEnd   : pars.marginInlineEnd,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'lead'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    '.lead': {
        extend  : varProps,
        display : 'block',


        '&:last-child': {
            marginBlockEnd: 0,
        },
    },
});