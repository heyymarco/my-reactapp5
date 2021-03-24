// react (builds html using javascript):
import React               from 'react'             // base technology of our nodestrap components

// jss   (builds css  using javascript):
import { createUseStyles } from 'react-jss'         // base technology of our nodestrap components
import type { Classes }    from 'jss'               // ts defs support for jss
import type * as Css       from './Css'             // ts defs support for jss
import CssPropsManager     from './CssPropsManager' // A *css custom property* manager that manages & updates the *css props* stored at specified `rule`.
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
 * A *css custom property* manager that manages & updates the *css props* stored at specified `rule`.
 */
const cssPropsManager = new CssPropsManager(() => {
    // common css values:
    // const initial = 'initial';
    // const unset   = 'unset';
    // const none    = 'none';
    const inherit = 'inherit';
    // const center  = 'center';
    // const middle  = 'middle';


    const keyframesNone : Css.Keyframes = { };

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
}, /*prefix: */'elm');
export const cssProps = cssPropsManager.refs;
export const cssDecls = cssPropsManager.decls;



/**
 * A css builder for styling our components.
 * Supports theming, styling, resizeable.
 * Supports many states.
 */
export class StylesBuilder {
    //#region global css props
    /**
     * Excludes the *special* prop names in the specified `cssProps`.  
     * @param cssProps The collection of the prop names to be filtered.  
     * @returns A copy of the `cssProps` that only having *non special* prop names.
     */
    protected filterValidProps<TCssProps>(cssProps: TCssProps) {
        const cssPropsCopy: Dictionary<any> = {};
        for (const [name, prop] of Object.entries(cssProps)) {
            // excludes the entry if the name matching with following:
            if ((/(Xs|Sm|Nm|Md|Lg|Xl|Xxl|Xxxl|None|Enable|Disable|Active|Passive|Check|Clear|Hover|Leave|Focus|Blur|Valid|Unvalid|Invalid|Uninvalid)$|^(@)|color|backg|backgGrad|anim|orientation|align/).test(name)) continue; // exclude
            
            // if not match => include it:
            cssPropsCopy[name] = prop;
        }
        return cssPropsCopy as TCssProps;
    }

    /**
     * Includes the prop names in the specified `cssProps` starting with specified `prefix`.
     * @param cssProps The collection of the prop names to be filtered.  
     * @param prefix The prefix name of the prop names to be *included*.  
     * @returns A copy of the `cssProps` that only having matching prop names.  
     * The retuning prop names has been normalized (renamed), so it doesn't starting with `prefix`.
     */
    protected filterPrefixProps<TCssProps>(cssProps: TCssProps, prefix: string) {
        const cssPropsCopy: Dictionary<any> = {};
        for (const [name, prop] of Object.entries(cssProps)) {
            // excludes the entry if the name not starting with specified prefix:
            if (!name.startsWith(prefix)) continue; // exclude

            // if match => remove the prefix => normalize the case => then include it:
            cssPropsCopy[camelCase(name.substr(prefix.length))] = prop;
        }
        return cssPropsCopy as TCssProps;
    }
    //#endregion global css props


    
    // scoped css props:
    /**
     * Holds the prefix name of the generated css props.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    protected readonly varPfx   : string;

    /**
     * Creates a scoped css prop name.
     * @param name The name of the prop.
     * @returns A prefixed prop name (if `varPfx` applied) -or- prop name without prefix.
     */
    protected prop(name: string) {
        if (this.varPfx) return `--${this.varPfx}-${name}`;
        return `--${name}`;
    }

    /**
     * Gets the *value* (reference) of the specified prop `name`.
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
     * @param options The list of the theme options.
     * @returns An `object` represents the color definitions *for each* theme `options`.
     */
    protected themes(themes: Dictionary<object> = {}, options = Object.entries(color.themes)) {
        for (const [theme, themeColor] of options) {
            const Theme     = pascalCase(theme);
            const themeProp = `&.th${Theme}`;
            themes[themeProp] = {
                ...themes[themeProp],
                extend: ((): object[] => {
                    const newEntry = this.themeOf(
                        theme,     // camel  case
                        Theme,     // pascal case
                        themeProp, // prop name
                        themeColor // current theme color
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
     * Creates a color definition for the specified `theme`.
     * @param theme The current theme name written in camel case.
     * @param Theme The current theme name written in pascal case.
     * @param themeProp The prop name of the current `theme`.
     * @param themeColor The backg color of the current `theme`.
     * @returns An `object` represents the color definition for the current `theme`.
     */
    protected themeOf(theme: string, Theme: string, themeProp: string, themeColor: Css.Ref) { return {}; }

    /**
     * Creates sizing definitions *for each* size `options`.
     * @param sizes The previous size definitions to *extend*.
     * @param options The list of the size options.
     * @returns An `object` represents the sizing definitions *for each* size `options`.
     */
    protected sizes(sizes: Dictionary<object> = {}, options = ['sm', 'lg']) {
        for (const size of options) {
            const Size     = pascalCase(size);
            const sizeProp = `&.sz${Size}`;
            sizes[sizeProp] = {
                ...sizes[sizeProp],
                extend: ((): object[] => {
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
     * Creates a sizing definition for the specified `size`.
     * @param size The current size name written in camel case.
     * @param Size The current size name written in pascal case.
     * @param sizeProp The prop name of the current `size`.
     * @returns An `object` represents the sizing definition for the current `size`.
     */
    protected sizeOf(size: string, Size: string, sizeProp: string) { return {}; }

    /**
     * Creates a gradient definition for if the gradient feature is enabled.
     * @returns An `object` represents the gradient definition.
     */
    protected gradient() { return {}; }

    /**
     * Creates an outlined definition for if the outlined feature is enabled.
     * @returns An `object` represents the outlined definition.
     */
    protected outlined()  { return {}; }



    // states:
    /**
     * Creates functional prop definitions in which the values *depends on* another *scoped css props* and/or *global css props* using *fallback* strategy.
     * @returns An `object` represents the functional prop definitions.
     */
    protected fnProps()  { return {}; }

    /**
     * Creates conditional color definitions for every *specific* condition (state).
     * @returns An `object` represents the conditional color definitions for every *specific* condition (state).
     */
    protected themesIf() { return {}; }

    /**
     * Creates css rule definitions for every *specific* state by overriding some *scoped css props* and applied some `themesIf`.
     * @returns An `object` represents the css rule definitions for every *specific* state.
     */
    protected states()   { return {}; }



    // styles:
    /**
     * Creates a basic style of a component *without* any themes nor states applied.
     * @returns An `object` represents the basic style definition.
     */
    protected basicStyle() { return {}; }

    /**
     * Creates one/more composite styles, with the themes & states applied.
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
                    { '&.outlined' : this.outlined() }, // variant outlined
        
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
     * @param varPfx The prefix name of the generated css props.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    protected constructor(
        varPfx: string,
    ) {
        // scoped css props:
        this.varPfx     = varPfx;
    }



    // utilities:
    /**
     * Escapes some sets of character in svg data, so it will be valid to be written in css.
     * @param svgData The raw svg data to be escaped.
     * @returns An escaped svg data.
     */
    protected escapeSvg(svgData: string) {
        const escapedChars: Dictionary<string> = {
            '<': '%3c',
            '>': '%3e',
            '#': '%23',
            '(': '%28',
            ')': '%29',
        };

        const svgDataCopy = Array.from(svgData);
        for (const index in svgDataCopy) {
            const char = svgDataCopy[index];
            if (char in escapedChars) svgDataCopy[index] = escapedChars[char];
        }
    
        return svgDataCopy.join('');
    }

    /**
     * Creates a single layer solid background based on specified `color`.
     * @param color The color of the solid background to create.
     * @returns A `Css.BackgroundLayer` represents a solid background in css.
     */
    protected solidBackg(color: Css.Ref, clip : Css.BackgroundClip = 'border-box'): Css.BackgroundLayer {
        return [[`linear-gradient(${color},${color})`, clip]];
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
    protected readonly _colorTh           = this.prop('colorTh');

    /**
     * conditional foreground color.
     */
    protected readonly _colorIfIf         = this.prop('colorIfIf');

    /**
     * conditional unthemed foreground color.
     */
    protected readonly _colorIf           = this.prop('colorIf');

    /**
     * func foreground color.
     */
    protected readonly _colorFn           = this.prop('colorFn');

    
    /**
     * none background.
     */
    protected readonly _backgNo           = this.prop('backgNo');

    /**
     * themed background color.
     */
    protected readonly _backgTh           = this.prop('backgTh');

    /**
     * conditional background color.
     */
    protected readonly _backgIfIf         = this.prop('backgIfIf');

    /**
     * conditional unthemed background color.
     */
    protected readonly _backgIf           = this.prop('backgIf');

    /**
     * func composite background(s).
     */
    protected readonly _backgFn           = this.prop('backgFn');

    /**
     * background gradient.
     */
    protected readonly _backgGradTg       = this.prop('backgGradTg');


    /**
     * themed foreground color at outlined state.
     */
    protected readonly _colorOutlinedTh   = this.prop('colorOutlinedTh');

    /**
     * conditional foreground color at outlined state.
     */
    protected readonly _colorOutlinedIfIf = this.prop('colorOutlinedIfIf');

    /**
     * conditional unthemed foreground color at outlined state.
     */
    protected readonly _colorOutlinedIf   = this.prop('colorOutlinedIf');

    /**
     * func foreground color at outlined state.
     */
    protected readonly _colorOutlinedFn   = this.prop('colorOutlinedFn');


    /**
     * func composite background(s) at outlined state.
     */
    protected readonly _backgOutlinedFn   = this.prop('backgOutlinedFn');


    /**
     * func composite animation(s).
     */
    protected readonly _animFn            = this.prop('animFn');
    //#endregion scoped css props



    // themes:
    protected themeOf(theme: string, Theme: string, themeProp: string, themeColor: Css.Ref) { return {
        // customize the backg & foreg
    
        // customize themed foreground color:
        [this._colorTh]         : (colors as any)[`${theme}Text`] as Css.Ref, // light on dark backg | dark on light backg
    
        // customize themed background color:
        [this._backgTh]         : this.solidBackg(themeColor),
    
        // customize themed foreground color at outlined state:
        [this._colorOutlinedTh] : themeColor,
    }}
    protected sizeOf(size: string, Size: string, sizeProp: string) { return {
        // overwrite the props with the props{Size}:

        [cssDecls.fontSize]     : (cssProps as any)[`fontSize${Size}`]     as Css.Ref,
        [cssDecls.paddingX]     : (cssProps as any)[`paddingX${Size}`]     as Css.Ref,
        [cssDecls.paddingY]     : (cssProps as any)[`paddingY${Size}`]     as Css.Ref,
        [cssDecls.borderRadius] : (cssProps as any)[`borderRadius${Size}`] as Css.Ref,
    }}
    protected gradient() { return {
        // customize background gradient:
        [this._backgGradTg]: cssProps.backgGrad,
    }}
    protected outlined() { return {
        // apply func foreground color at outlined state:
        color       : this.getProp(this._colorOutlinedFn),
        
        // apply func composite background(s) at outlined state:
        backg       : this.getProp(this._backgOutlinedFn),

        // set border color = text-color:
        borderColor : this.getProp(this._colorOutlinedFn),
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
        [this._colorOutlinedFn] : this.getProp(
            this._colorOutlinedIfIf, // first  priority
            this._colorOutlinedTh,   // second priority
            this._colorOutlinedIf    // third  priority
        ),
    
        // customize func composite background(s) at outlined state:
        [this._backgOutlinedFn] : this.getProp(
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
        [this._colorIf]         : cssProps.color,
        [this._backgIf]         : this.getProp(this._backgNo),
        [this._colorOutlinedIf] : cssProps.color,
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

export interface VariantOutlined {
    outlined?: boolean
}
export function useVariantOutlined(props: VariantOutlined) {
    return {
        class: props.outlined ? 'outlined' : null,
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
    const elmStyles     = styles.useStyles();

    // themes:
    const variTheme     = useVariantTheme(props);
    const variSize      = useVariantSize(props);
    const variGradient  = useVariantGradient(props);
    const variOutlined  = useVariantOutlined(props as VariantOutlined);



    const Tag = (props.tag ?? 'div');
    return (
        <Tag className={[
                elmStyles.main,
                
                // themes:
                variTheme.class,
                variSize.class,
                variGradient.class,
                variOutlined.class,

                ...(props.classes ?? []),
            ].filter((c) => !!c).join(' ')}
        >
            {(props as React.PropsWithChildren<Props>)?.children}
        </Tag>
    );
};
