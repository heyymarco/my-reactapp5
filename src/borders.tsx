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
    color: colors.darkTransp as string,
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
export { config, items as borders };
export default items;



const all = (width?: StrokeValueNum) => ({ border: [[items?.style ?? 'solid', width ?? items?.defaultWidth ?? '1px', items?.color ?? 'black']] });
export { all };