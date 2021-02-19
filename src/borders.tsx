import JssVarCollection from './jss-var-collection';
import colors           from './colors';
import * as radius      from './borders-radiuses';



// define default props' value to be stored into css vars:
const widths = {
    none: '0px',
    hair: '1px',
    thin: '2px',
    bold: '4px',
};

const others = {
    color: (colors.darkTransp as string) ?? 'currentColor',
    style: 'solid',
};

const props = Object.assign({},
    widths,
    others,
    {
        defaultWidth : widths.hair,
        default      : [[others.style, widths.hair, others.color]] as (string[][] | string),
    }
);



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props,
    /*config :*/ { varPrefix: 'bd'}
);
const config   = collection.config;
const varProps = collection.varProps as (typeof props & { [key: string]: (undefined|string|number|(string|number)[][]) });
const valProps = collection.valProps as (typeof props & { [key: string]: (undefined|string|number|(string|number)[][]) });
// export the configurable props:
export { config, varProps as borders };
export default varProps;



// export our mixins:
// property of .default, .style, .defaultWidth, & .color "might" has deleted by user => use nullish op for safety => .?
const defaultStyle = () => ((valProps?.default as string[][])?.[0]?.[0] ?? varProps?.style ?? 'solid');
const defaultWidth = () => ((valProps?.default as string[][])?.[0]?.[1] ?? varProps?.defaultWidth ?? varProps?.hair ?? '1px');
const defaultColor = () => ((valProps?.default as string[][])?.[0]?.[2] ?? varProps?.color ?? 'currentcolor');
type Width = number | string;
const all = (width?: Width) => {
    const defWidth = defaultWidth();
    return { border: (((width ?? defWidth) === defWidth) ? varProps?.default : undefined) ?? [[defaultStyle(), (width ?? defWidth), defaultColor()]] };
};
const top       = (width?: Width) => ({ borderTop    : all(width).border });
const bottom    = (width?: Width) => ({ borderBottom : all(width).border });
const left      = (width?: Width) => ({ borderLeft   : all(width).border });
const right     = (width?: Width) => ({ borderRight  : all(width).border });
export { all, top, bottom, left, right };

const notTop    = (width?: Width) => ((border) => ({                    borderBottom: border, borderLeft: border, borderRight: border }))(all(width).border);
const notBottom = (width?: Width) => ((border) => ({ borderTop: border,                       borderLeft: border, borderRight: border }))(all(width).border);
const notLeft   = (width?: Width) => ((border) => ({ borderTop: border, borderBottom: border,                     borderRight: border }))(all(width).border);
const notRight  = (width?: Width) => ((border) => ({ borderTop: border, borderBottom: border, borderLeft: border,                     }))(all(width).border);
export { notTop, notBottom, notLeft, notRight };



const radiuses = radius.radiuses;
export { radiuses, radius };
