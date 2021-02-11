import JssVarCollection from './jss-var-collection';



// define default props' value to be stored into css vars:
const basics = {
    none   : '0px',
    md     : '1rem',
};

const props = Object.assign({},
    basics,
    {
        default: basics.md,
        xs : [['calc(', basics.md, '/', 4  , ')']] as ((string | number)[][] | string),
        sm : [['calc(', basics.md, '/', 2  , ')']] as ((string | number)[][] | string),
        lg : [['calc(', basics.md, '*', 1.5, ')']] as ((string | number)[][] | string),
        xl : [['calc(', basics.md, '*', 3  , ')']] as ((string | number)[][] | string),
    }
);



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props,
    /*config :*/ { varPrefix: 'spc'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as spacers };
export default varProps;