import * as base        from './base';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends base.CssProps {

    color   : string          ;
    opacity : string | number ;
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize       : inherit,
    fontFamily     : inherit,
    fontWeight     : inherit,
    fontStyle      : inherit,
    textDecoration : inherit,
    lineHeight     : inherit,

    color          : inherit,
    opacity        : 0.63,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'sec'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'small, .txt-sec': varProps,
});