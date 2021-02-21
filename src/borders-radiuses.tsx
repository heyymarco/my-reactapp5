import JssVarCollection from './jss-var-collection';



// define default props' value to be stored into css vars:
const basics = {
    none        : '0px',
    sm          : '0.2rem',
    md          : '0.25rem',
    lg          : '0.3rem',
    pill        : '50rem',
    circle      : '50%',
};
const props = Object.assign({},
    basics,
    {
        default : basics.md,
    }
);



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props,
    /*config :*/ { varPrefix: 'bd-rd'}
);
const config   = collection.config;
const varProps = collection.varProps as (typeof props & { [key: string]: (undefined|string|number|(string|number)[][]) });
// export the configurable props:
export { config, varProps as radiuses };
export default varProps;



// export our mixins:
const defaultRadius = () => (varProps?.default ?? varProps?.md ?? '0.25rem');
type Radius = number | string;
const all = (radius?: Radius) => {
    const defRadius = defaultRadius();
    return { borderRadius: (((radius ?? defRadius) === defRadius) ? varProps?.default : undefined) ?? (radius ?? defRadius) };
};
const topStart    = (radius?: Radius) => ({ borderTopLeftRadius     : all(radius).borderRadius });
const topEnd      = (radius?: Radius) => ({ borderTopRightRadius    : all(radius).borderRadius });
const bottomStart = (radius?: Radius) => ({ borderBottomLeftRadius  : all(radius).borderRadius });
const bottomEnd   = (radius?: Radius) => ({ borderBottomRightRadius : all(radius).borderRadius });
export { all, topStart, topEnd, bottomStart, bottomEnd };

const top    = (radius?: Radius) => ((radius) => ({ borderTopLeftRadius: radius, borderTopRightRadius: radius,                                                                  }))(all(radius).borderRadius);
const bottom = (radius?: Radius) => ((radius) => ({                                                            borderBottomLeftRadius: radius, borderBottomRightRadius: radius, }))(all(radius).borderRadius);
const start  = (radius?: Radius) => ((radius) => ({ borderTopLeftRadius: radius,                               borderBottomLeftRadius: radius,                                  }))(all(radius).borderRadius);
const end    = (radius?: Radius) => ((radius) => ({                              borderTopRightRadius: radius,                                 borderBottomRightRadius: radius, }))(all(radius).borderRadius);
export { top, bottom, start, end };