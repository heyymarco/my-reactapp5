import type * as par    from './paragraph';

import * as base        from './base';

import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends par.CssProps {
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : gens.fontSizeMd,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : inherit,
    
    marginBlockStart  : 0,
    marginBlockEnd    : '1em',
    marginInlineStart : 0,
    marginInlineEnd   : 0,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'bq'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'blockquote,.blockquote': {
        extend  : varProps,
        display : 'block',
    },
});