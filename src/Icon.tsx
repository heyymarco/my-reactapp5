import type * as Css       from './Css';

import
    React, {
    useMemo
}                          from 'react';

import * as Elements       from './Element';
import { getVar }          from './Element';
import Path                from 'path';
import fontMaterial        from './Icon-font-material';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



function resolveUrl(file: string, path: string) {
    if (!file) return file;

    if (file[0] === '~') file = Path.join('/node_modules', file.substr(1));
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
    color      : Css.Color
    
    size       : Css.Height | Css.Expression
    sizeSm     : Css.Height | Css.Expression
    sizeNm     : Css.Height | Css.Expression
    sizeMd     : Css.Height | Css.Expression
    sizeLg     : Css.Height | Css.Expression
}
// const unset   = 'unset';
const none    = 'none';
// const inherit = 'inherit';
const normal    = 'normal';

// internal css vars:
export const vars = {
    img: '--ico-img',
};

// define default cssProps' value to be stored into css vars:
const basics = {
    color      : 'currentColor',
    
    sizeNm     : '24px',
};

const _cssProps: CssProps = {...basics,
    size   :  basics.sizeNm,
    sizeSm : [['calc(', basics.sizeNm, '*', 0.75  , ')']],
    sizeMd : [['calc(', basics.sizeNm, '*', 1.50  , ')']],
    sizeLg : [['calc(', basics.sizeNm, '*', 2.00  , ')']],
};

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
        fontStyle      : normal,
        textDecoration : none,

        items          : fontMaterial,
    },
    img: {
        // path           : '~@nodestrap/icon/dist/icons/',
        path           : '/icons/',
        files          : [
            'instagram.svg',
            'whatsapp.svg',
            'close.svg',
        ],
    },
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ config    as { [index: string]: any }
);
const config2  = collection.config   as unknown as typeof config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config2 as config, cssProps };
// export default cssProps;



const customFont = {
    fontFamily     : config.font.fontFamily,
    fontWeight     : config.font.fontWeight,
    fontStyle      : config.font.fontStyle,
    textDecoration : config.font.textDecoration,
};


export const themes = {};
Elements.defineThemes(themes, (theme, Theme, themeProp, themeColor) => ({
    // overwrite the color prop
    // we ignore the color prop if the theme applied

    '--ico-color': themeColor,
}));

export const sizes  = {};
const cssPropsAny = cssProps as any;
Elements.defineSizes(sizes, (size, Size, sizeProp) => ({
    // overwrite the props with the props{Size}:

    '--ico-size': (size === '1em') ? '1em' : cssPropsAny[`size${Size}`],
}), ['sm', 'nm', 'md', 'lg', '1em']);


export const basicStyle = {
    extend: [
        Elements.filterValidProps(cssProps),
    ],

    display       : 'inline-block',
    verticalAlign : 'middle',

    color         : undefined, // delete

    size          : undefined, // delete
    height        : cssProps.size,
    width         : 'min-content',
};
const styles = {
    main: {
        extend: [
            basicStyle, // apply our basicStyle

            // themes:
            themes,     // variant themes
            sizes,      // variant sizes
        ],
    },
    '@font-face': [
        {
            src: config.font.files.map(file => `url("${resolveUrl(file, config.font.path)}") ${formatOf(file)}`).join(','),
            ...customFont,
        },
    ],
    font: {
        extend: [
            customFont,
        ],

        fontSize      : cssProps.size,
        overflowY     : 'hidden', // hide the pseudo-inherited underline

        backg         : 'transparent',
        color         : cssProps.color,

        userSelect    : none, // disable selecting icon's text

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
        backg         : cssProps.color,

        maskImage     : getVar(vars.img),
        maskSize      : 'contain',
        maskRepeat    : 'no-repeat',
        maskPosition  : 'center',

        '-webkit-maskImage'     : getVar(vars.img),
        '-webkit-maskSize'      : 'contain',
        '-webkit-maskRepeat'    : 'no-repeat',
        '-webkit-maskPosition'  : 'center',

        '& >img': {
            visibility : 'hidden !important',
            height     : '100%', // follow parent's height
        },
    },
};
const styles2 = styles as unknown as (typeof styles & Record<'sizeSm'|'sizeNm'|'sizeMd'|'sizeLg'|'size1em', object>);
export { styles2 as styles };
export const useStyles = createUseStyles(styles2);



export interface Props
    extends
        Elements.VariantSize,
        Elements.VariantTheme
{
    icon           : string
    'aria-hidden'? : boolean
}
export default function Icon(props: Props) {
    const icoStyles    = useStyles();

    // themes:
    const variTheme    = Elements.useVariantTheme(props, icoStyles);
    const variSize     = Elements.useVariantSize(props, icoStyles);



    const imgIcon = useMemo(() => {
        const file = config.img.files.find((file) => file.match(/[\w-.]+(?=[.]\w+$)/)?.[0] === props.icon);
        if (!file) return null;
        return resolveUrl(file, config.img.path);
    }, [props.icon]);

    const fontIcon = useMemo(() =>
        config.font.items.includes(props.icon)
    , [props.icon]);



    return (
        <span className={[
                icoStyles.main,
                (imgIcon ? icoStyles.img : (fontIcon ? icoStyles.font : null)),
                
                // themes:
                variTheme.class,
                variSize.class,
            ].join(' ')}

            style={imgIcon ? ({[vars.img]: `url("${imgIcon}")`} as React.CSSProperties) : undefined}

            aria-hidden={props['aria-hidden'] ?? true}
        >
            {imgIcon ? (
                <img src={imgIcon} alt='' />
            ) : undefined}
            
            {(!imgIcon && fontIcon) ? props.icon : undefined}
        </span>
    );
}