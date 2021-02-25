import * as base        from './base';

import heads,
       * as head        from './heading';
import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends head.CssProps {
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize1         : [['calc(', 5.0, '*', (gens.fontSize as string), ')']],
    fontSize2         : [['calc(', 4.5, '*', (gens.fontSize as string), ')']],
    fontSize3         : [['calc(', 4.0, '*', (gens.fontSize as string), ')']],
    fontSize4         : [['calc(', 3.5, '*', (gens.fontSize as string), ')']],
    fontSize5         : [['calc(', 3.0, '*', (gens.fontSize as string), ')']],
    fontSize6         : [['calc(', 2.5, '*', (gens.fontSize as string), ')']],

    fontSize          : undefined as unknown as string,
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



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'd'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss(head.createCss(varProps, level => `.display-${level}`));