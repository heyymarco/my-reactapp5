// react (builds html using javascript):
import React               from 'react'             // base technology of our nodestrap components

// jss   (builds css  using javascript):
import { createUseStyles } from 'react-jss'         // base technology of our nodestrap components
import type { Classes }    from 'jss'               // ts defs support for jss
import type * as Css       from './Css'             // ts defs support for jss
import CssPropsManager     from './CssPropsManager' // stores css props on the :root as global vars
import type { Dictionary } from './CssPropsManager' // ts defs support for jss
import { pascalCase }      from 'pascal-case'       // pascal-case support for jss
import { camelCase }       from 'camel-case'        // camel-case  support for jss

// nodestrap (modular web components):
import
    colors,
    * as color             from './colors'          // configurable colors & theming defs
import
    borders,
    * as border            from './borders'         // configurable borders & border radiuses defs
import spacers             from './spacers'         // configurable spaces defs
import typos               from './typos/index'     // configurable typography (texting) defs



// jss:

/**
 * A css manager that manages & update the `cssProps` stored at `:root` level.  
 */
const cssPropsManager = new CssPropsManager(() => {
    // common css values:
    // const unset   = 'unset';
    // const none    = 'none';
    const inherit = 'inherit';
    // const center  = 'center';
    // const middle  = 'middle';


    const keyframesNone = { };

    return {
        fontSize          : typos.fontSizeNm,
        fontSizeSm        : [['calc((', (typos.fontSizeSm as string), '+', (typos.fontSizeNm as string), ')/2)']],
        fontSizeLg        : typos.fontSizeMd,
        fontFamily        : inherit,
        fontWeight        : inherit,
        fontStyle         : inherit,
        textDecoration    : inherit,
        lineHeight        : inherit,

        color             : 'currentColor',
        backg             : 'transparent',
        backgGrad         : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],

        opacity           : 1,

        paddingX          : [['calc((', (spacers.sm as string), '+', (spacers.md as string), ')/2)']],
        paddingY          : [['calc((', (spacers.xs as string), '+', (spacers.sm as string), ')/2)']],
        paddingXSm        : spacers.sm as string,
        paddingYSm        : spacers.xs as string,
        paddingXLg        : spacers.md as string,
        paddingYLg        : spacers.sm as string,
        border            : borders.default,
        borderRadius      : border.radiuses.md,
        borderRadiusSm    : border.radiuses.sm,
        borderRadiusLg    : border.radiuses.lg,


        // anim props:

        transition        : [
            ['background' , '300ms', 'ease-out'],
            ['color'      , '300ms', 'ease-out'],
            ['border'     , '300ms', 'ease-out'],
            ['font-size'  , '300ms', 'ease-out'],
            ['width'      , '300ms', 'ease-out'],
            ['height'     , '300ms', 'ease-out'],
        ],

        boxShadowNone     : [[0, 0, 'transparent']],
        boxShadow         : [[0, 0, 'transparent']],

        filterNone        : 'brightness(100%)',
        filter            : 'brightness(100%)',

        '@keyframes none' : keyframesNone,
        animNone          : [[keyframesNone]],
        anim              : [[keyframesNone]],
    };
}, 'elm');
export const cssProps = cssPropsManager.refs;
export const cssDecls = cssPropsManager.decls;



/**
 * A css builder for styling our components.
 * Supports theming, styling, resizeable.
 * Supports many states.
 * Exposes configurable css props.
 */
export class StylesBuilder {
    //#region global css props
    /**
     * Defines the prefix name of the `cssProps` stored at `:root` level.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    protected readonly varPfx   : string;

    /**
     * Excludes the special names of the specified `cssProps`.  
     * @param cssProps A `cssProps` to be filtered.  
     * @returns A copy of the `cssProps` that only having *non special* name.
     */
    protected filterValidProps<TCssProps>(cssProps: TCssProps) {
        const cssPropsCopy: Dictionary<any> = { };
        for (const [key, value] of Object.entries(cssProps)) {
            // excludes the entry if matches with following:
            if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|None|Enable|Disable|Active|Passive|Check|Clear|Hover|Leave|Focus|Blur|Valid|Unvalid|Invalid|Uninvalid)$|^(@)|color|backg|backgGrad|anim|orientation|align/).test(key)) continue;
            
            // if not match => include it:
            cssPropsCopy[key] = value;
        }
        return cssPropsCopy as TCssProps;
    }

    /**
     * Includes the specified `cssProps` starting with specified `prefix`.
     * @param cssProps A `cssProps` to be filtered.  
     * @param prefix The prefix name of the `cssProps` to be *included*.  
     * @returns A copy of the `cssProps` that matches with specified `prefix`.  
     * The retuning prop names has been normalized, so it doesn't starting with `prefix`.
     */
    protected filterPrefixProps<TCssProps>(cssProps: TCssProps, prefix: string) {
        const cssPropsCopy: Dictionary<any> = { };
        for (const [key, value] of Object.entries(cssProps)) {
            // excludes the entry if not starting with specified prefix:
            if (!key.startsWith(prefix)) continue;

            // if match => remove the prefix => normalize the case => then include it:
            cssPropsCopy[camelCase(key.substr(prefix.length))] = value;
        }
        return cssPropsCopy as TCssProps;
    }
    //#endregion global css props


    
    // scoped css props:
    /**
     * Creates scoped css prop.
     * @param name The name of prop.
     * @returns A prefixed prop name (if `varPfx` applied) -or- prop name without prefix.
     */
    protected prop(name: string) {
        if (this.varPfx) return `--${this.varPfx}-${name}`;
        return `--${name}`;
    }

    /**
     * Gets the *value* of the specified prop `name`.
     * @param name The name of prop to retrieve.
     * @param fallback1 The name of secondary prop to retrieve if the `name` was not found.
     * @param fallback2 The name of third prop to retrieve if the `fallback1` was not found.
     * @returns A generated css expression for retrieving the value.
     */
    protected getProp(name: string, fallback1?: string, fallback2?: string) {
        return fallback1 ? (fallback2 ? `var(${name},var(${fallback1},var(${fallback2})))` : `var(${name},var(${fallback1}))`) : `var(${name})`;
    }



    // themes:
    /**
     * Creates color definitions *for each* theme `options`.
     * @param themes The previous theme definitions to *extend*.
     * @param options The list of theme options.
     * @returns An `object` represents the color definitions *for each* theme `options`.
     */
    protected themes(themes: Dictionary<object> = {}, options = Object.entries(color.themes)) {
        for (const [theme, themeColor] of options) {
            const Theme     = pascalCase(theme);
            const themeProp = `&.th${Theme}`;
            themes[themeProp] = {
                ...themes[themeProp],
                extend: (() => {
                    const newEntry = this.themeOf(
                        theme,     // camel  case
                        Theme,     // pascal case
                        themeProp, // prop name
                        themeColor as Css.Prop // current theme color css prop
                    );

                    const extend = (themes[themeProp] as any)?.extend;
                    if (Array.isArray(extend)) {
                        extend.push(newEntry);
                        return extend;
                    }
                    else {
                        return [newEntry];
                    }
                })(),
            };
        }
        return themes;
    }
    /**
     * Creates color definitions for a specified `theme`.
     * @param theme The current theme name written in camel case.
     * @param Theme The current theme name written in pascal case.
     * @param themeProp The prop name of current `theme`.
     * @param themeColor The backg color of current `theme`.
     * @returns An `object` represents the color definitions for the current `theme`.
     */
    protected themeOf(theme: string, Theme: string, themeProp: string, themeColor: Css.Prop) { return {}; }

    /**
     * Creates sizing definitions *for each* size option.
     * @param sizes The previous size definitions to *extend*.
     * @param options The list of size options.
     * @returns An `object` represents the sizing definitions *for each* size `options`.
     */
    protected sizes(sizes: Dictionary<object> = {}, options = ['sm', 'lg']) {
        for (const size of options) {
            const Size     = pascalCase(size);
            const sizeProp = `&.sz${Size}`;
            sizes[sizeProp] = {
                ...sizes[sizeProp],
                extend: (() => {
                    const newEntry = this.sizeOf(
                        size,    // camel  case
                        Size,    // pascal case
                        sizeProp // prop name
                    );

                    const extend = (sizes[sizeProp] as any)?.extend;
                    if (Array.isArray(extend)) {
                        extend.push(newEntry);
                        return extend;
                    }
                    else {
                        return [newEntry];
                    }
                })(),
            };
        }
        return sizes;
    }
    /**
     * Creates sizing definitions for a specified `size`.
     * @param size The current size name written in camel case.
     * @param Size The current size name written in pascal case.
     * @param sizeProp The prop name of current `size`.
     * @returns An `object` represents the sizing definitions for the current `size`.
     */
    protected sizeOf(size: string, Size: string, sizeProp: string) { return {}; }

    /**
     * Creates gradient definitions for if the gradient feature is enabled.
     * @returns An `object` represents the gradient definitions.
     */
    protected gradient() { return {}; }

    /**
     * Creates outlined definitions for if the outline feature is enabled.
     * @returns An `object` represents the outlined definitions.
     */
    protected outline()  { return {}; }



    // states:
    /**
     * Creates functional props in which the values *depends on* another *scoped css props* and/or *global css props* using *fallback* strategy.
     * @returns An `object` represents the functional props.
     */
    protected fnProps()  { return {}; }

    /**
     * Creates conditional color definitions for every *specific* state.
     * @returns An `object` represents the conditional color definitions for every *specific* state.
     */
    protected themesIf() { return {}; }

    /**
     * Creates css rules for every *specific* states by overriding some *scoped css props* and applied some `themesIf`.
     * @returns An `object` represents the css rules for every *specific* states.
     */
    protected states()   { return {}; }



    // styles:
    /**
     * Creates a basic style of a component *without* any themes nor states applied.
     * @returns An `object` represents the basic style definitions.
     */
    protected basicStyle() { return {}; }

    /**
     * Creates the composite style, with the themes & states applied.
     * @returns An `object` represents the composite style definitions.
     */
    protected styles() {
        return {
            main: {
                extend: [
                    this.basicStyle(), // basic style
        
                    // themes:
                    this.themes(),                      // variant themes
                    this.sizes(),                       // variant sizes
                    { '&.gradient' : this.gradient() }, // variant gradient
                    { '&.outline'  : this.outline()  }, // variant outline
        
                    // states:
                    this.fnProps(),  // functional  props
                    this.themesIf(), // conditional themes
                    this.states(),   // state rules
                ],
            },
        };
    }

    protected _useStyleCache : ((() => Classes<'main'>)|null) = null;

    /**
     * Returns a jss stylesheet for styling dom.
     * @returns A jss stylesheet instance.
     */
    public useStyles() {
        if (!this._useStyleCache) {
            this._useStyleCache = createUseStyles(this.styles());
        }
        return this._useStyleCache();
    }



    // constructors:
    /**
     * Creates a `StylesBuilder` instance.
     * @param varPfx The prefix name of the css props stored at `:root` level.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    protected constructor(
        varPfx: string,
    ) {
        // global css props:
        this.varPfx     = varPfx;
    }



    // utilities:
    /**
     * Escapes some set of character in svg format so it will be valid written in css.
     * @param svg The raw svg data to be escaped.
     * @returns An escaped svg data.
     */
    protected escapeSvg(svg: string) {
        const svgCopy = Array.from(svg);
        const escapeChars: Dictionary<string> = {
            '<': '%3c',
            '>': '%3e',
            '#': '%23',
            '(': '%28',
            ')': '%29',
        };
        for (const index in svgCopy) {
            const char = svgCopy[index];
            if (char in escapeChars) svgCopy[index] = escapeChars[char];
        }
    
        return svgCopy.join('');
    }

    /**
     * Creates a solid background based on specified `color`.
     * @param color The color of solid background.
     * @returns A string represents a solid background in css.
     */
    protected solidBackg(color: Css.Prop) {
        return `linear-gradient(${color},${color})`;
    }
}

class ElementStylesBuilder extends StylesBuilder {
    constructor() {
        super('elm');
    }



    //#region scoped css props
    /**
     * themed foreground color.
     */
    protected readonly _colorTh          = this.prop('colorTh');

    /**
     * conditional foreground color.
     */
    protected readonly _colorIfIf        = this.prop('colorIfIf');

    /**
     * conditional unthemed foreground color.
     */
    protected readonly _colorIf          = this.prop('colorIf');

    /**
     * func foreground color.
     */
    protected readonly _colorFn          = this.prop('colorFn');

    
    /**
     * none background.
     */
    protected readonly _backgNo          = this.prop('backgNo');

    /**
     * themed background color.
     */
    protected readonly _backgTh          = this.prop('backgTh');

    /**
     * conditional background color.
     */
    protected readonly _backgIfIf        = this.prop('backgIfIf');

    /**
     * conditional unthemed background color.
     */
    protected readonly _backgIf          = this.prop('backgIf');

    /**
     * func composite background(s).
     */
    protected readonly _backgFn          = this.prop('backgFn');

    /**
     * background gradient.
     */
    protected readonly _backgGradTg      = this.prop('backgGradTg');


    /**
     * themed foreground color at outlined state.
     */
    protected readonly _colorOutlineTh   = this.prop('colorOutlineTh');

    /**
     * conditional foreground color at outlined state.
     */
    protected readonly _colorOutlineIfIf = this.prop('colorOutlineIfIf');

    /**
     * conditional unthemed foreground color at outlined state.
     */
    protected readonly _colorOutlineIf   = this.prop('colorOutlineIf');

    /**
     * func foreground color at outlined state.
     */
    protected readonly _colorOutlineFn   = this.prop('colorOutlineFn');


    /**
     * func composite background(s) at outlined state.
     */
    protected readonly _backgOutlineFn   = this.prop('backgOutlineFn');


    /**
     * func composite animation(s).
     */
    protected readonly _animFn           = this.prop('animFn');
    //#endregion scoped css props



    // themes:
    protected themeOf(theme: string, Theme: string, themeProp: string, themeColor: Css.Prop) { return {
        // customize the backg & foreg
    
        // customize themed foreground color:
        [this._colorTh]        : (colors as any)[`${theme}Text`] as Css.Prop, // light on dark backg | dark on light backg
    
        // customize themed background color:
        [this._backgTh]        : this.solidBackg(themeColor),
    
        // customize themed foreground color at outlined state:
        [this._colorOutlineTh] : themeColor,
    }}
    protected sizeOf(size: string, Size: string, sizeProp: string) { return {
        // overwrite the props with the props{Size}:

        [cssDecls.fontSize]     : (cssProps as any)[`fontSize${Size}`]     as Css.Prop,
        [cssDecls.paddingX]     : (cssProps as any)[`paddingX${Size}`]     as Css.Prop,
        [cssDecls.paddingY]     : (cssProps as any)[`paddingY${Size}`]     as Css.Prop,
        [cssDecls.borderRadius] : (cssProps as any)[`borderRadius${Size}`] as Css.Prop,
    }}
    protected gradient() { return {
        // customize background gradient:
        [this._backgGradTg]: cssProps.backgGrad,
    }}
    protected outline() { return {
        // apply func foreground color at outlined state:
        color       : this.getProp(this._colorOutlineFn),
        
        // apply func composite background(s) at outlined state:
        backg       : this.getProp(this._backgOutlineFn),

        // set border color = text-color:
        borderColor : this.getProp(this._colorOutlineFn),
    }}



    // states:
    protected fnProps() { return {
        // customize func foreground color:
        [this._colorFn] : this.getProp(
            this._colorIfIf, // first  priority
            this._colorTh,   // second priority
            this._colorIf    // third  priority
        ),
    
        // customize func composite background(s):
        [this._backgFn] : [
            // top layer:
            this.getProp(
                this._backgGradTg,
                this._backgNo
            ),

            // middle layer:
            this.getProp(
                this._backgIfIf, // first  priority
                this._backgTh,   // second priority
                this._backgIf    // third  priority
            ),

            // bottom layer:
            cssProps.backg,
        ],
    
    
    
        // customize func foreground color at outlined state:
        [this._colorOutlineFn] : this.getProp(
            this._colorOutlineIfIf, // first  priority
            this._colorOutlineTh,   // second priority
            this._colorOutlineIf    // third  priority
        ),
    
        // customize func composite background(s) at outlined state:
        [this._backgOutlineFn] : this.getProp(
            this._backgGradTg,
            this._backgNo
        ),
    
    
    
        // customize func composite animation(s):
        [this._animFn] : [
            cssProps.anim,
        ],
    }}
    protected themesIf() { return {
        // define default colors:
        [this._colorIf]        : cssProps.color,
        [this._backgIf]        : this.getProp(this._backgNo),
        [this._colorOutlineIf] : cssProps.color,
    }}
    protected states() { return {
        // customize none background.
        [this._backgNo] : this.solidBackg('transparent'),
    }}



    // styles:
    protected basicStyle() { return {
        extend: [
            this.filterValidProps(cssProps), // apply our filtered cssProps
        ],
    
    
    
        // apply func foreground color:
        color : this.getProp(this._colorFn),
    
        // apply func composite background(s):
        backg : this.getProp(this._backgFn),
    
        // apply func composite animation(s):
        anim  : this.getProp(this._animFn),
    }}
}
export const styles = new ElementStylesBuilder();



// hooks:

export interface VariantTheme {
    theme?: string
}
export function useVariantTheme(props: VariantTheme, themeDefault?: () => (string|undefined)) {
    const theme = props.theme ?? themeDefault?.();
    return {
        class: theme ? `th${pascalCase(theme)}` : null,
    };
}

export interface VariantSize {
    size?: 'sm' | 'lg' | string
}
export function useVariantSize(props: VariantSize) {
    return {
        class: props.size ? `sz${pascalCase(props.size)}` : null,
    };
}

export interface VariantGradient {
    enableGradient?: boolean
}
export function useVariantGradient(props: VariantGradient) {
    return {
        class: props.enableGradient ? 'gradient' : null,
    };
}

export interface VariantOutline {
    outline?: boolean
}
export function useVariantOutline(props: VariantOutline) {
    return {
        class: props.outline ? 'outline' : null,
    };
}


// func components:

export interface Props
    extends
        VariantTheme,
        VariantSize,
        VariantGradient,
        React.DOMAttributes<HTMLOrSVGElement>
{
    tag?     : keyof JSX.IntrinsicElements
    classes? : string[]
}
export default function Element(props: Props) {
    const elmStyles    = styles.useStyles();

    // themes:
    const variTheme    = useVariantTheme(props);
    const variSize     = useVariantSize(props);
    const variGradient = useVariantGradient(props);
    const variOutline  = useVariantOutline(props as VariantOutline);



    const Tag = (props.tag ?? 'div');
    return (
        <Tag className={[
                elmStyles.main,
                
                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,
                variOutline.class,

                ...(props.classes ?? []),
            ].filter((c) => !!c).join(' ')}
        >
            {(props as React.PropsWithChildren<Props>)?.children}
        </Tag>
    );
};
