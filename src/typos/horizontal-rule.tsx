import * as base        from './base';

import borders          from '../borders';
import spacers          from '../spacers';

import JssVarCollection from '../jss-var-collection';



export interface Props {
    color             : string          ;
    opacity           : string | number ;

    width             : string | number ;

    marginBlockStart  : string | number ;
    marginBlockEnd    : string | number ;
    marginInlineStart : string | number ;
    marginInlineEnd   : string | number ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    color             : inherit,
    opacity           : 0.25,

    width             : borders.hair,
    
    marginBlockStart  : spacers.default,
    marginBlockEnd    : spacers.default,
    marginInlineStart : '0px',
    marginInlineEnd   : '0px',
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'hr'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'hr': {
        extend          : varProps,
        display         : 'block',
        backgroundColor : 'currentColor',
        width           : null,
        height          : varProps.width,
        border          : '0px',
    },
});