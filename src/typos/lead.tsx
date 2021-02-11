import * as base        from './base';

import pars             from './paragraph';
import type * as par    from './paragraph';
import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface Props
    extends par.Props {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
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



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'lead'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    '.lead': {
        extend  : varProps,
        display : 'block',
    },
});