import * as base        from './base';
import type * as par    from './paragraph';

import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends par.CssProps {
    
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

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
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



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as unknown as { [index: string]: any },
    /*config   :*/ { varPrefix: 'h'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
export default varProps;



// define the css class using configurable css vars:
export function createCss(varProps: typeof cssProps, classLevelDecl: (level: number) => string) {
    const levels = [1,2,3,4,5,6];
    const newVarProps: { [index:string]: any } = {};
    


    newVarProps[levels.map(classLevelDecl).join(',')] = {
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



    // defines newVarProps.fontSize into each h1-h6:
    for (const level of levels) {
        newVarProps[classLevelDecl(level)] = {
            fontSize: (varProps as { [index:string]: any })[`fontSize${level}`],
        }
    }



    return newVarProps;
}
base.declareCss(createCss(varProps, level => `h${level},.h${level}`));