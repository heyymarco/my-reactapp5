import
    React,
    { useMemo }            from 'react';

import
    * as Elements          from './Element';
import type
    { base as typoBase }   from './typos/index';
import fontMaterial        from './Icon-font-material';
import Path                from 'path';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



function resolveUrl(file: string, path: string) {
    if (!file) return file;

    if (file[0] === '~') file = Path.join("/node_modules", file.substr(1));
    return Path.join(path, file);
}
function formatOf(file: string) {
    if (!file) return null;

    const match = file.match(/(?<=[.])\w+$/)?.[0];
    if (match) {
        if (match === 'ttf') return 'format("truetype")';
        return `format("${match}")`;
    } // if

    return null;
}



export interface CssProps {
    color      : string
    
    size       : string | number | typoBase.Expression
    sizeSm     : string | number | typoBase.Expression
    sizeNm     : string | number | typoBase.Expression
    sizeLg     : string | number | typoBase.Expression
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const normal    = 'normal';

const basics = {
    color      : 'currentColor',
    
    sizeNm     : '24px',
};

const cssProps: CssProps = Object.assign({},
    basics,
    {
        size   :  basics.sizeNm,
        sizeSm : [['calc(', basics.sizeNm, '*', [0.75]  , ')']],
        sizeMd : [['calc(', basics.sizeNm, '*', [1.50]  , ')']],
        sizeLg : [['calc(', basics.sizeNm, '*', [2.00]  , ')']],
    }
);

const config = {
    varPrefix: 'ico',
    font: {
        // path           : '~@nodestrap/icon/dist/fonts/',
        path           : '/fonts/',
        files          : [
            'MaterialIcons-Regular.woff2',
            'MaterialIcons-Regular.woff',
            'MaterialIcons-Regular.ttf',
        ],

        fontFamily     : '"Material Icons"',
        fontWeight     : 400,
        fontStyle      : 'normal',
        textDecoration : 'none',

        items          : fontMaterial,
    },
    img: {
        // path           : '~@nodestrap/icon/dist/icons/',
        path           : '/icons/',
        files          : [
            'instagram.svg',
            'whatsapp.svg',
        ],
    },
};



// convert cssProps => varProps:
const collection = new JssVarCollection(
    /*cssProps :*/ cssProps as { [index: string]: any },
    /*config   :*/ config   as { [index: string]: any }
);
const config2  = collection.config   as unknown as typeof config;
const varProps = collection.varProps as typeof cssProps;
// export the configurable varPops:
export { config2 as config, varProps as cssProps };
// export default varProps;



const customFont = {
    fontFamily     : config.font.fontFamily,
    fontWeight     : config.font.fontWeight,
    fontStyle      : config.font.fontStyle,
    textDecoration : config.font.textDecoration,
};
const styles = {
    main: {
        extend: [
            Elements.filterValidProps(varProps),
        ],

        display       : 'inline-block',
        verticalAlign : 'middle',

        size          : undefined, // delete
        height        : varProps.size,
        width         : 'min-content',

        userSelect    : none, // disable selecting icon's text
    },
    '@font-face': [
        Object.assign({
            src   : config.font.files.map(file => `url("${resolveUrl(file, config.font.path)}") ${formatOf(file)}`).join(',')
        }, customFont),
    ],
    font: {
        extend: [
            customFont,
        ],

        fontSize      : varProps.size,
        overflowY     : 'hidden', // hide the pseudo-inherited underline

        backg         : 'transparent',
        color         : varProps.color,

        lineHeight    : 1,
        textTransform : none,
        letterSpacing : normal,
        wordWrap      : normal,
        whiteSpace    : 'nowrap',
        direction     : 'ltr',

        // support for all WebKit browsers
        '-webkit-font-smoothing': 'antialiased',

        // support for Safari and Chrome
        'textRendering': 'optimizeLegibility',

        // support for Firefox
        '-moz-osx-font-smoothing': 'grayscale',

        // support for IE
        fontFeatureSettings: 'liga',
    },
    img: {
        backg         : varProps.color,

        maskImage     : 'var(--ico-img)',
        maskSize      : 'contain',
        maskRepeat    : 'no-repeat',
        maskPosition  : 'center',

        '-webkit-maskImage'     : 'var(--ico-img)',
        '-webkit-maskSize'      : 'contain',
        '-webkit-maskRepeat'    : 'no-repeat',
        '-webkit-maskPosition'  : 'center',

        '& >img': {
            visibility : 'hidden !important',
            height     : '100%', // follow parent's height
        },
    }
};

const varProps2 = varProps as any;
Elements.defineSizes(styles, (size, Size, sizeProp) => ({
    '--ico-size': (size === '1em') ? '1em' : varProps2[`size${Size}`],
}), ['sm', 'nm', 'md', 'lg', '1em']);

Elements.defineThemes(styles, (theme, Theme, themeProp, themeColor) => ({
    '--ico-color': themeColor,
}));

const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeNm'|'sizeMd'|'sizeLg'|'size1em', string>);
const useStyles = createUseStyles(styles2);
export { styles2 as styles, useStyles };


export interface Props
    extends
        Elements.VariantSize,
        Elements.VariantTheme
{
    icon           : string
    'aria-hidden'? : boolean
}
export default function Icon(props: Props) {
    const styles       = useStyles();

    const variSize     = Elements.useVariantSize(props, styles);
    const variTheme    = Elements.useVariantTheme(props, styles);



    const fontIcon = useMemo(() =>
        config.font.items.includes(props.icon)
    , [props.icon]);

    const imgIcon = useMemo(() => {
        const file = config.img.files.find((file) => file.match(/[\w-.]+(?=[.]\w+$)/)?.[0] === props.icon);
        if (!file) return null;
        return resolveUrl(file, config.img.path);
    }, [props.icon]);



    return (
        <span className={[
                styles.main,
                (fontIcon ? styles.font : (imgIcon ? styles.img : null)),
                
                variSize.class,
                variTheme.class,
            ].join(' ')}

            style={imgIcon ? ({'--ico-img': `url("${imgIcon}")`} as React.CSSProperties) : undefined}

            aria-hidden={props['aria-hidden'] ?? true}
        >
            {fontIcon ? props.icon : undefined}
            {!fontIcon && imgIcon ? (
                <img src={imgIcon} alt='' />
            ) : undefined}
        </span>
    );
}