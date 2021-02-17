import
    React,
    { useState }           from 'react';

import
    * as Elements          from './Element';
import
    colors,
    * as color             from './colors';
import
    borders,
    * as border            from './borders';
import spacers             from './spacers';
import
    typos,
    { base as typoBase }   from './typos/index';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface CssProps {
    color      : string
    
    size       : string | number | typoBase.Expression
    sizeSm     : string | number | typoBase.Expression
    sizeNm     : string | number | typoBase.Expression
    sizeLg     : string | number | typoBase.Expression
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';

const basics = {
    color      : typos.color,
    
    sizeNm     : '24px',
};

const cssProps: CssProps = Object.assign({},
    basics,
    {
        size   :  basics.sizeNm,
        sizeSm : [['calc(', basics.sizeNm, '*', [0.75]  , ')']],
        sizeLg : [['calc(', basics.sizeNm, '*', [1.50]  , ')']],
        sizeXl : [['calc(', basics.sizeNm, '*', [2.00]  , ')']],
    }
);



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'ico'}
);
const config   = collection.config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config, varProps as cssProps };
// export default varProps;



const styles = {
    main: {
        extend: [
            Elements.filterValidProps(varProps),
        ],
    },
};

const varProps2 = varProps as any;
Elements.defineSizes(styles, (size, Size, sizeProp) => ({
    '--ico-size': varProps2[`size${Size}`],
}));

Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    '--ico-color': themeColor,
}));

const styles2 = styles as unknown as Record<'main'|'sizeSm'|'sizeLg'|'sizeXl', string>;
const useStyles = createUseStyles(styles2);
export { styles2 as styles, useStyles };


export interface Props
    extends
        Elements.VariantSize,
        Elements.VariantTheme
{
    icon: string
}
export default function Element(props: Props) {
    const styles       = useStyles();

    const variSize     = Elements.useVariantSize(props, styles);
    const variTheme    = Elements.useVariantTheme(props, styles);



    return (
        <span className={[
                styles.main,
                
                variSize.class,
                variTheme.class,
            ].join(' ')}
        >
            {props.icon}
        </span>
    );
}