import JssVarCollection from './JssVarCollection';



// define default props' value to be stored into css vars:
const props = {
    none       : '0px',
    sm         : '0.2rem',
    md         : '0.25rem',
    lg         : '0.3rem',
    pill       : '50rem',
    circle     : '50%',
};



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props,
    /*config :*/ { varPrefix: 'bd-rd'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof props;
// export the configurable props:
export { config, varProps as radiuses };
export default varProps;