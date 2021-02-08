import JssVarCollection from './JssVarCollection';
import colors           from './colors';



type StrokeValueNum = string | number;
type StrokeListNum = { [index: string]: StrokeValueNum };

type StrokeValueKey = string;
type StrokeListKey = { [index: string]: StrokeValueKey };

type StrokeValues = (StrokeValueNum | StrokeValueKey)[][];
type StrokeValueComplex = StrokeValueNum | StrokeValueKey | StrokeValues;
type StrokeListComplex = { [index: string]: StrokeValueComplex };



const widths: StrokeListNum = {
    none: '0px',
    hair: '1px',
    thin: '2px',
    bold: '4px',
};

const props: StrokeListKey = {
    color: (colors.darkTransp as string) ?? 'currentColor',
    style: 'solid',
};

const strokes: StrokeListComplex = Object.assign({},
    widths,
    props,
    {
        defaultWidth: widths.hair,
        default: [[props.style, widths.hair, props.color]]
    }
);



const collection = new JssVarCollection<StrokeValueComplex>(
    strokes,
    { varPrefix: 'bd'},
    (raw)   => raw,
    (value) => `${value}`
);
const config = collection.config;
const items  = collection.items;
const strokesPost = collection.values;
export { config, items as borders };
export default items;



const defaultStyle = () => ((strokesPost?.default as StrokeValues)?.[0]?.[0] ?? items?.style ?? 'solid') as StrokeValueKey;
const defaultWidth = () => ((strokesPost?.default as StrokeValues)?.[0]?.[1] ?? items?.defaultWidth ?? items?.hair ?? '1px') as StrokeValueKey;
const defaultColor = () => ((strokesPost?.default as StrokeValues)?.[0]?.[2] ?? items?.color ?? 'currentcolor') as StrokeValueKey;
const all = (width?: StrokeValueNum) => {
    const defWidth = defaultWidth();
    return { border: (((width ?? defWidth) === defWidth) ? items?.default : undefined) ?? [[defaultStyle(), (width ?? defWidth), defaultColor()]] };
};
const top       = (width?: StrokeValueNum) => ({ borderTop    : all(width).border });
const bottom    = (width?: StrokeValueNum) => ({ borderBottom : all(width).border });
const left      = (width?: StrokeValueNum) => ({ borderLeft   : all(width).border });
const right     = (width?: StrokeValueNum) => ({ borderRight  : all(width).border });
export { all, top, bottom, left, right };

const notTop    = (width?: StrokeValueNum) => ((border) => ({                    borderBottom: border, borderLeft: border, borderRight: border }))(all(width).border);
const notBottom = (width?: StrokeValueNum) => ((border) => ({ borderTop: border,                       borderLeft: border, borderRight: border }))(all(width).border);
const notLeft   = (width?: StrokeValueNum) => ((border) => ({ borderTop: border, borderBottom: border,                     borderRight: border }))(all(width).border);
const notRight  = (width?: StrokeValueNum) => ((border) => ({ borderTop: border, borderBottom: border, borderLeft: border,                     }))(all(width).border);
export { notTop, notBottom, notLeft, notRight };
