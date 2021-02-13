import * as base        from './base';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends base.CssProps {

    color             : string          ;

    marginBlockStart  : string | number ;
    marginBlockEnd    : string | number ;
    marginInlineStart : string | number ;
    marginInlineEnd   : string | number ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : inherit,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : inherit,
    
    marginBlockStart  : '0px',
    marginBlockEnd    : '1em',
    marginInlineStart : '0px',
    marginInlineEnd   : '0px',
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'p'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'p, .p': {
        extend  : varProps,
        display : 'block',
    },
});