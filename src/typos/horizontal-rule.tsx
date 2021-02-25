import type * as Css    from '../Css';

import * as base        from './base';

import borders          from '../borders';
import spacers          from '../spacers';

import JssVarCollection from '../jss-var-collection';



export interface CssProps {
    color             : Css.Color
    opacity           : Css.Opacity

    width             : Css.Width

    marginBlockStart  : Css.MarginBlock
    marginBlockEnd    : Css.MarginBlock
    marginInlineStart : Css.MarginInline
    marginInlineEnd   : Css.MarginInline
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    color             : inherit,
    opacity           : 0.25,

    width             : borders.hair,
    
    marginBlockStart  : spacers.default,
    marginBlockEnd    : spacers.default,
    marginInlineStart : 0,
    marginInlineEnd   : 0,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'hr'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'hr': {
        extend          : varProps,
        display         : 'block',
        backgroundColor : 'currentColor',
        width           : null,
        height          : varProps.width,
        border          : 0,
    },
});