import jss, * as Jss from 'jss';

// import presetDefault from 'jss-preset-default';
import jssPluginFunctions        from 'jss-plugin-rule-value-function';
// import jssPluginObservable       from 'jss-plugin-rule-value-observable';
// import jssPluginTemplate         from 'jss-plugin-template';
import jssPluginGlobal           from 'jss-plugin-global';
import jssPluginExtend           from 'jss-plugin-extend';
import jssPluginNested           from 'jss-plugin-nested';
// import jssPluginCompose          from 'jss-plugin-compose';
import jssPluginCamelCase        from 'jss-plugin-camel-case';
// import jssPluginDefaultUnit      from 'jss-plugin-default-unit';
import jssPluginExpand           from 'jss-plugin-expand';
// import jssPluginVendorPrefixer   from 'jss-plugin-vendor-prefixer';
// import jssPluginPropsSort        from 'jss-plugin-props-sort';
import jssPluginNormalizeShorthands from './jss-plugin-normalize-shorthands';



type Dictionary<TValue> = { [index: string]: TValue };

/*
    set varProps.foo       = Color(255, 0, 0)      => TItem

    get varProps.foo       = return var(--pr-fooA) => string
    get varProps.notExists = return undefined      => undefined
*/
type Var   = string;

/*
    get valProps.fooC => return { margin: '10px', opacity: 0.5 } => '10px', 0.5 => string, number
    get valProps.fooD => return { font-family: ['Arial', 'Roboto']; margin: [[10px 5px]], } => CssValue[], CssValue[][]
*/
type CssValue     = string | number;
type CSSValueComp = CssValue | CssValue[] | CssValue[][];

export default class JssVarCollection<TProp> {
    private _config        : Dictionary<string>;
    private _configProxy   : Dictionary<string>;

    private _props         : Dictionary<TProp>;
    private _varPropsProxy : Dictionary<TProp | Var>; // TItem for set, Var | Empty for get
    
    private _toString      : ((value: TProp) => string);
    private _valProps      : Dictionary<CSSValueComp> = {};

    private _css           : Jss.StyleSheet<'@global'> | null = null;


    constructor(
        props    : Dictionary<TProp>,
        config   : Dictionary<string>               = { varPrefix: '' },
        parser   : ((item: any) => TProp)    | null = null,
        toString : ((item: TProp) => string) | null = null
    ) {
        this._config = config;

        // a proxy to "watch" any config changes:
        this._configProxy = new Proxy(config, {
            set: (target, name: string, value) => {
        
                if (target[name] !== value) {
                    target[name] = value;
                    
                    this._rebuildJss(); // setting changed => need to rebuild the jss
                }
        
                return true;
            }
        });


        
        this._props = props;
        this._varPropsProxy = new Proxy(this._props, {
            get: (props, name: string) => {
                if (!Reflect.has(props, name)) return undefined;
        
                return `var(${this._getVarName(name)})`;
            },
            set: (props, name: string, value) => {
        
                if (!value) {
                    delete props[name];
                } else {
                    const newValue = parser ? parser(value) : (value as TProp);
                    if (props[name] !== newValue) {
                        props[name] = newValue;
        
                        this._rebuildJss(); // setting changed => need to rebuild the jss
                    }
                }
        
                return true;
            }
        });



        this._toString   = toString ?? ((item) => `${item}`);



        this._rebuildJss();
    }


    private _getVarName(baseName: string): string {
        const varPrefix = this._config.varPrefix;
        return `${varPrefix ? `--${varPrefix}-` : '--'}${baseName}`;
    }

    private _rebuildJss() {
        this._css?.detach();



        const props = this._props;
        const valProps: Dictionary<CSSValueComp> = {};
        const reservedKeyword = /^(none|unset|inherit)$/;
        for (const name in props) { // set up values
            const value = props[name];
            if (value === undefined) continue; // skip undefined prop
            if (Array.isArray(value)) {
                let arr = value as any[];
                let deep = false;
                if ((arr.length === 1) && Array.isArray(arr[0])) {
                    arr = arr[0] as any[];
                    deep = true;
                }
                arr = arr.slice(); // copy array object


                let modified = false;
                for (let index = 0; index < arr.length; index++) {
                    const arrItem: any = arr[index];
                    if ((typeof(arrItem) === 'string') && reservedKeyword.test(arrItem as string)) continue; // ignore reserved keywords
                    if (Array.isArray(arrItem)) continue; // ignore value if it's kind of array


                    for (const prevName in props) {
                        if (prevName === name) break; // stop search if reaches current pos (search for prev values only)

                        const prevValue = props[prevName];
                        if (prevValue === undefined) continue; // skip undefined prop
                        if ((typeof(prevValue) === 'string') && reservedKeyword.test(prevValue as string)) continue; // ignore reserved keywords
                        if (Array.isArray(prevValue)) continue; // ignore prev value if it's kind of array


                        if (arrItem === prevValue) {
                            arr[index] = `var(${this._getVarName(prevName)})`;
                            modified = true;
                        }
                        else if (typeof(arrItem) !== 'string') {
                            arr[index] = this._toString(arrItem);
                            modified = true;
                        }
                    }
                }
                if (modified) {
                    valProps[this._getVarName(name)] = deep ? [arr] : arr;
                    continue;
                }
            }


            let modified = false;
            for (const prevName in props) {
                if (prevName === name) break; // stop search if reaches current pos (search for prev values only)

                const prevValue = props[prevName];
                if ((typeof(prevValue) === 'string') && reservedKeyword.test(prevValue as string)) continue; // ignore reserved keywords

                
                if (value === prevValue) {
                    valProps[this._getVarName(name)] = `var(${this._getVarName(prevName)})`;

                    modified = true;
                    break;
                }
            }
            if (!modified) {
                valProps[this._getVarName(name)] = Array.isArray(value) ? (Array.isArray((value as CssValue[])[0]) ? (value as CssValue[][]) : (value as CssValue[])) : this._toString(value);
            }
        }
        this._valProps = valProps;


        const styles = {
            '@global': {
                ':root': valProps
            }
        };
        this._css = jss.setup({
            plugins: [
              jssPluginFunctions(),
              // jssPluginObservable({}),
              // jssPluginTemplate(),
              jssPluginGlobal(),
              jssPluginExtend(),
              jssPluginNested(),
              // jssPluginCompose(),
              jssPluginCamelCase(),
              // jssPluginDefaultUnit({}),
              jssPluginExpand(),
              // jssPluginVendorPrefixer(),
              // jssPluginPropsSort(),
              jssPluginNormalizeShorthands()
            ]
          }).createStyleSheet(styles);
        this._css.attach();
    }


    get config()   { return this._configProxy; }

    get varProps() { return this._varPropsProxy;  }

    private _valPropsProxy: Dictionary<CSSValueComp> | null = null;
    get valProps() {
        return this._valPropsProxy ?? (this._valPropsProxy = (() =>
            new Proxy(this._props as unknown as Dictionary<CSSValueComp>, {
                get: (items, name: string)        => this._valProps[this._getVarName(name)],
                set: (items, name: string, value) => { throw new Error('property is read only.'); }
            })
        )());
    }
}