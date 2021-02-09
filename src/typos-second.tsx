import * as base     from './typos-base';
import JssVarCollection from './JssVarCollection';



export interface Props
    extends base.Props {

    color   : string          ;
    opacity : string | number ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize       : inherit,
    fontFamily     : inherit,
    fontWeight     : inherit,
    fontStyle      : inherit,
    textDecoration : inherit,
    lineHeight     : inherit,

    color          : inherit,
    opacity        : 0.63,
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'sec'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'small, .txt-sec': varProps,
});