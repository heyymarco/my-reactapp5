import * as base        from './base';
import type * as par    from './paragraph';

import gens             from './general';

import JssVarCollection from '../JssVarCollection';



export interface Props
    extends par.Props {
    
    fontSize1 : string | number | (string | number)[][];
    fontSize2 : string | number | (string | number)[][];
    fontSize3 : string | number | (string | number)[][];
    fontSize4 : string | number | (string | number)[][];
    fontSize5 : string | number | (string | number)[][];
    fontSize6 : string | number | (string | number)[][];
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize1         : [['calc(', 2.25, '*', gens.fontSize, ')']],
    fontSize2         : [['calc(', 2.00, '*', gens.fontSize, ')']],
    fontSize3         : [['calc(', 1.75, '*', gens.fontSize, ')']],
    fontSize4         : [['calc(', 1.50, '*', gens.fontSize, ')']],
    fontSize5         : [['calc(', 1.25, '*', gens.fontSize, ')']],
    fontSize6         : [['calc(', 1.00, '*', gens.fontSize, ')']],

    fontSize          : undefined as unknown as string,
    fontFamily        : inherit,
    fontWeight        : 500,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : 1.25,

    color             : inherit,
    
    marginBlockStart  : '0px',
    marginBlockEnd    : '0.75em',
    marginInlineStart : '0px',
    marginInlineEnd   : '0px',
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*items  :*/ props as unknown as { [index: string]: any },
    /*config :*/ { varPrefix: 'h'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as props };
export default varProps;



// define the css class using configurable css vars:
export function createCss(varProps: typeof props, classLevelDecl: (level: number) => string) {
    const levels = [1,2,3,4,5,6];
    const css: { [index:string]: any } = {};
    


    css[levels.map(classLevelDecl).join(',')] = {
        extend    : varProps,
        display   : 'block',
        fontSize  : null,
        fontSize1 : null,
        fontSize2 : null,
        fontSize3 : null,
        fontSize4 : null,
        fontSize5 : null,
        fontSize6 : null,
    };



    // defines props.fontSize into each h1-h6:
    levels.forEach(level => css[classLevelDecl(level)] = {
        fontSize: (varProps as { [index:string]: any })[`fontSize${level}`],
    });



    return css;
}
base.declareCss(createCss(varProps, level => `h${level},.h${level}`));