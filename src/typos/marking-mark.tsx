import * as base        from './base';

import colors           from '../colors';
import borders,
       * as border      from '../borders';

import JssVarCollection from '../JssVarCollection';



export interface Props
    extends base.Props {

    color        : string                       ;
    backg        : string | string[][] | object ;

    paddingX     : string | number              ;
    paddingY     : string | number              ;
    border       : string | string[][]          ;
    borderRadius : string | number              ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize          : inherit,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : inherit,
    backg             : colors.warningTransp as string,
    
    paddingX          : '0.2em',
    paddingY          : '0em',
    border            : borders.default,
    borderRadius      : border.radiuses.sm,
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'mrk'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'mark,.mark': {
        extend  : varProps,
        display : 'inline',
    },
});