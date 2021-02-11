import * as base        from './base';

import heads,
       * as head        from './heading';
import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface Props
    extends head.Props {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize1         : [['calc(', 5.0, '*', gens.fontSize, ')']],
    fontSize2         : [['calc(', 4.5, '*', gens.fontSize, ')']],
    fontSize3         : [['calc(', 4.0, '*', gens.fontSize, ')']],
    fontSize4         : [['calc(', 3.5, '*', gens.fontSize, ')']],
    fontSize5         : [['calc(', 3.0, '*', gens.fontSize, ')']],
    fontSize6         : [['calc(', 2.5, '*', gens.fontSize, ')']],

    fontSize          : heads.fontSize,
    fontFamily        : heads.fontFamily,
    fontWeight        : 300,
    fontStyle         : heads.fontStyle,
    textDecoration    : heads.textDecoration,
    lineHeight        : heads.lineHeight,

    color             : heads.color,
    
    marginBlockStart  : heads.marginBlockStart,
    marginBlockEnd    : heads.marginBlockEnd,
    marginInlineStart : heads.marginInlineStart,
    marginInlineEnd   : heads.marginInlineEnd,
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'd'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
base.declareCss(head.createCss(varProps, level => `.display-${level}`));