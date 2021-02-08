import JssVarCollection from './JssVarCollection';



type SpacerValue = number | string;
type SpacerList  = { [index: string]: SpacerValue };



const basics: SpacerList = {
    none   : '0px',
    md     : '1rem',
};

const spacers = Object.assign({},
    basics,
    {
        xs : [['calc(', basics.md, '/', 4  , ')']],
        sm : [['calc(', basics.md, '/', 2  , ')']],
        lg : [['calc(', basics.md, '*', 1.5, ')']],
        xl : [['calc(', basics.md, '*', 3  , ')']],
    }
);



const collection = new JssVarCollection<SpacerValue>(
    spacers,
    { varPrefix: 'spc'},
    (raw)   => raw,
    (value) => `${value}`
);
const config = collection.config;
const items  = collection.items;
export { config, items as spacers };
export default items;