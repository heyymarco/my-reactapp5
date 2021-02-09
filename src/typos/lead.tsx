import * as base        from './base';
import * as par         from './paragraph';
import * as gen         from './general';
import JssVarCollection from '../JssVarCollection';



export interface Props
    extends par.Props {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize          : gen.props.fontSizeMd,
    fontFamily        : par.props.fontFamily,
    fontWeight        : gen.props.fontWeightLight,
    fontStyle         : par.props.fontStyle,
    textDecoration    : par.props.textDecoration,
    lineHeight        : par.props.lineHeight,

    color             : par.props.color,
    
    marginBlockStart  : par.props.marginBlockStart,
    marginBlockEnd    : par.props.marginBlockEnd,
    marginInlineStart : par.props.marginInlineStart,
    marginInlineEnd   : par.props.marginInlineEnd,
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
    '.lead': varProps,
});