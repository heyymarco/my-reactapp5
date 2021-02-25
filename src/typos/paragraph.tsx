import type * as Css    from '../Css';

import * as base        from './base';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends base.CssProps {

    color             : Css.Color

    marginBlockStart  : Css.MarginBlock
    marginBlockEnd    : Css.MarginBlock
    marginInlineStart : Css.MarginInline
    marginInlineEnd   : Css.MarginInline
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
    
    marginBlockStart  : 0,
    marginBlockEnd    : '1em',
    marginInlineStart : 0,
    marginInlineEnd   : 0,
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


        '&:last-child': {
            marginBlockEnd: 0,
        },
    },
});