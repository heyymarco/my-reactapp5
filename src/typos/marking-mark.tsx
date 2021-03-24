import type * as Css    from '../Css';

import * as base        from './base';

import colors           from '../colors';
import borders,
       * as border      from '../borders';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends base.CssProps {

    color        : Css.Color
    backg        : Css.Background

    paddingX     : Css.PaddingXY
    paddingY     : Css.PaddingXY
    border       : Css.Border
    borderRadius : Css.BorderRadius
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize          : inherit,
    fontFamily        : inherit,
    fontWeight        : inherit,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : inherit,

    color             : inherit,
    backg             : colors.warningTransp,
    
    paddingX          : '0.2em',
    paddingY          : '0em',
    border            : borders.default,
    borderRadius      : border.radiuses.sm,
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'mrk'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
base.declareCss({
    'mark,.mark': {
        extend  : varProps,
        display : 'inline',
    },
});