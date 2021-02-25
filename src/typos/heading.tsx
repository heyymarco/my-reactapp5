import type * as Css    from '../Css';
import type * as par    from './paragraph';

import * as base        from './base';

import gens             from './general';

import JssVarCollection from '../jss-var-collection';



export interface CssProps
    extends par.CssProps {
    
    fontSize1 : Css.FontSize
    fontSize2 : Css.FontSize
    fontSize3 : Css.FontSize
    fontSize4 : Css.FontSize
    fontSize5 : Css.FontSize
    fontSize6 : Css.FontSize
}
// const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default cssProps' value to be stored into css vars:
const cssProps: CssProps = {
    fontSize1         : [['calc(', 2.25, '*', (gens.fontSize as string), ')']],
    fontSize2         : [['calc(', 2.00, '*', (gens.fontSize as string), ')']],
    fontSize3         : [['calc(', 1.75, '*', (gens.fontSize as string), ')']],
    fontSize4         : [['calc(', 1.50, '*', (gens.fontSize as string), ')']],
    fontSize5         : [['calc(', 1.25, '*', (gens.fontSize as string), ')']],
    fontSize6         : [['calc(', 1.00, '*', (gens.fontSize as string), ')']],

    fontSize          : undefined as unknown as string,
    fontFamily        : inherit,
    fontWeight        : 500,
    fontStyle         : inherit,
    textDecoration    : inherit,
    lineHeight        : 1.25,

    color             : inherit,
    
    marginBlockStart  : 0,
    marginBlockEnd    : '0.75em',
    marginInlineStart : 0,
    marginInlineEnd   : 0,
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