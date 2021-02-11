import * as base        from './base';
import type * as par    from './paragraph';

import gens              from './general';

import JssVarCollection from '../jss-var-collection';



export interface Props
    extends par.Props {
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize          : gens.fontSizeMd,
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



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'bq'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'blockquote,.blockquote': {
        extend  : varProps,
        display : 'block',
    },
});