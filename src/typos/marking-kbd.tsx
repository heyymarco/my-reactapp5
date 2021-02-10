import * as base        from './base';

import marks            from './marking-mark'
import codes,
      * as code         from './marking-code';
import colors           from '../colors';

import JssVarCollection from '../JssVarCollection';



export interface Props
    extends code.Props {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
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



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'kbd'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'kbd,.kbd': {
        extend  : varProps,
        display : 'inline',
    },
});