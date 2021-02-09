import * as base        from './base';
import * as par         from './paragraph';
import * as gen         from './general';
import JssVarCollection from '../JssVarCollection';



export interface Props
    extends par.Props {
    
    fontSize1 : string | number   | (string | number)[][];
    fontSize2 : string | number   | (string | number)[][];
    fontSize3 : string | number   | (string | number)[][];
    fontSize4 : string | number   | (string | number)[][];
    fontSize5 : string | number   | (string | number)[][];
    fontSize6 : string | number   | (string | number)[][];
}
const unset   = 'unset';
// const none    = 'none';
const inherit = 'inherit';

// define default props' value to be stored into css vars:
const props: Props = {
    fontSize1         : [['calc(', 2.25, '*', gen.props.fontSize, ')']],
    fontSize2         : [['calc(', 2.00, '*', gen.props.fontSize, ')']],
    fontSize3         : [['calc(', 1.75, '*', gen.props.fontSize, ')']],
    fontSize4         : [['calc(', 1.50, '*', gen.props.fontSize, ')']],
    fontSize5         : [['calc(', 1.25, '*', gen.props.fontSize, ')']],
    fontSize6         : [['calc(', 1.00, '*', gen.props.fontSize, ')']],

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
base.declareCss((() => {
    const levels = [1,2,3,4,5,6];
    const css: { [index:string]: any } = {};
    


    const varPropsReduce = Object.assign({}, varProps) as { [index:string]: any };
    // delete props .fontSize, .fontSize1-6:
    delete varPropsReduce.fontSize;
    levels.forEach(l => delete varPropsReduce[`fontSize${l}`]);
    
    // add reduced props into h1-h6,.h1-.h6:
    css[levels.map(l => `h${l},.h${l}`).join(',')] = varPropsReduce;



    // defines props.fontSize into each h1-h6:
    levels.forEach(l => css[`h${l},.h${l}`] = {
        fontSize: (varProps as { [index:string]: any })[`fontSize${l}`],
    });



    return css;
})());