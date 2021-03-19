import { 
    create as createJss,
    createGenerateId
}                                from 'jss';
import type * as Jss             from 'jss';

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

import deepEquals                from 'deep-equal';



let customJssCache: Jss.Jss | null = null;
const getCustomJss = () => {
    if (customJssCache) return customJssCache;

    customJssCache = createJss().setup({plugins:[
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
    ]});

    return customJssCache;
}

let idGenerator = createGenerateId();
const generateKeyframeName = (baseName: string) => idGenerator({key: baseName} as Jss.Rule);

const matchKeyframeName = /(?<=@keyframes\s+).+/;



export type Dictionary<TValue> = { [index: string]: TValue };

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

    private _cssProps      : Dictionary<TProp>;
    private _varPropsProxy : Dictionary<TProp | Var>; // TItem for set, Var | Empty for get
    
    private _toString      : ((value: TProp) => string);
    private _valProps      : Dictionary<CSSValueComp> = {};

    private _css           : Jss.StyleSheet<'@global'> | null = null;


    constructor(
        cssProps : Dictionary<TProp>,
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
                    
                    this.rebuildJss(); // setting changed => need to rebuild the jss
                }
        
                return true;
            }
        });


        
        this._cssProps = cssProps;
        this._varPropsProxy = new Proxy(this._cssProps, {
            get: (cssProps, name: string) => {
                if (!Reflect.has(cssProps, name)) return undefined;
        
                if (matchKeyframeName.test(name)) return cssProps[name];

                return `var(${this.getVarName(name)})`;
            },
            set: (cssProps, name: string, value) => {
        
                if ((value === undefined) || (value === null)) {
                    delete cssProps[name];
                } else {
                    const newValue = parser ? parser(value) : (value as TProp);
                    if (cssProps[name] !== newValue) {
                        cssProps[name] = newValue;
        
                        this.rebuildJss(); // setting changed => need to rebuild the jss
                    }
                }
        
                return true;
            }
        });



        this._toString   = toString ?? ((item) => `${item}`);



        this.rebuildJss();
    }


    private getVarName(baseName: string): string {
        baseName = baseName.replace(/^@keyframes\s+/, 'keyframes-');

        const varPrefix = this._config.varPrefix;
        return `${varPrefix ? `--${varPrefix}-` : '--'}${baseName}`;
    }

    public rebuildJss() {
        this._css?.detach();


        
        const keyframes: Dictionary<object> = {};
        const replaceDuplicates = <TSrc, TRef>(srcProps: TSrc, refProps: TRef, propRename?: ((name: string) => string)) => {
            const propRenameDefault = (name: string) => name;
            if (!propRename) propRename = propRenameDefault; // if no custom renamer => set default handler
            let globalModified = false; // a flag determines the outProps is different than srcProps
            const outProps: Dictionary<CSSValueComp> = {}; // an object for storing unmodified & modified properties from srcProps


            const isCombinable = (value: any) => {
                if (value === undefined) return false; // skip undefined prop
                if ((typeof(value) === 'string') && (/^(none|unset|inherit)$/).test(value as string)) return false; // ignore reserved keywords
                // if (Array.isArray(value)) return false; // ignore prev value if it's kind of array
                return true; // passed
            };
            const isSelf = (name: string, prevName: string) => {
                if ((srcProps as unknown as object) !== (refProps as unknown as object)) return false;
                return (name === prevName);
            };
            const findDuplicateVar = (name: string, value: any) => {
                for (const [prevName, prevValue] of Object.entries(refProps)) { // search for duplicate cssProps' value
                    if (isSelf(name, prevName)) break; // stop search if reaches current pos (search for prev values only)

                    if (!isCombinable(prevValue)) continue; // skip uncombinable prop


                    if ((value === prevValue) || deepEquals(value, prevValue, {strict: true})) {
                        return `var(${this.getVarName(prevName)})`;
                    }
                } // for // searching for duplicates

                return null; // not found
            }


            for (const [name, value] of Object.entries(srcProps)) { // walk each props in srcProps
                const foundKf = name.match(matchKeyframeName)?.[0];
                if (foundKf) {
                    // if current keyframe equals to one of stored keyframes => use the matched stored keyframe
                    const found = Object.entries(keyframes).find(ent => (ent[1] === (value as unknown as object)));
                    if (found) {
                        outProps[propRename(name)] = found[0]; // replace with the stored keyframe's name

                        globalModified = true;
                        continue;
                    }


                    // if not found => generate a unique keyframe's name
                    const kfName = generateKeyframeName(foundKf);
                    keyframes[`@keyframes ${kfName}`] = (value as unknown as object);
                    outProps[propRename(name)] = kfName; // replace with the new keyframe's name

                    globalModified = true;
                    continue;
                }



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
                    for (let index = 0; index < arr.length; index++) { // walk each arrayItem in arr
                        const arrItem = arr[index];

                        if (!isCombinable(arrItem)) continue; // skip uncombinable prop


                        const found = findDuplicateVar(name, arrItem);
                        if (found) {
                            arr[index] = found;

                            modified = true;
                            globalModified = true;
                        }


                        if ((!modified) && (!Array.isArray(arrItem)) && (typeof(arrItem) !== 'string') && (typeof(arrItem) !== 'number')) {
                            arr[index] = this._toString(arrItem);

                            modified = true;
                            globalModified = true;
                        }
                    } // for // walk each arrayItem in arr


                    // save the unmodified/modified array:
                    outProps[propRename(name)] = modified ? (deep ? [arr] : arr) : (value as (CssValue[] | CssValue[][]));
                    if (modified) continue; // continue to investigating next prop, do not execute *code below*
                }

                // *code below*:


                let modified = false;
                const found = findDuplicateVar(name, value);
                if (found) {
                    outProps[propRename(name)] = found;

                    modified = true;
                    globalModified = true;
                }
                
                
                if (!modified) {
                    outProps[propRename(name)] = (() => {
                        // do not modify array => the array was already investigated & maybe transformed
                        if (Array.isArray(value)) return (value as (CssValue[] | CssValue[][]));

                        if (typeof(value) === 'string') return value;
                        if (typeof(value) === 'number') return value;


                        modified = true;
                        return this._toString(value);
                    })();
                    if (modified) globalModified = true;
                }
            } // for // walk each props in srcProps


            if (globalModified || (propRename !== propRenameDefault)) return outProps;

            return null; // null means no modification
        }
        const cssProps = this._cssProps;
        this._valProps = replaceDuplicates(cssProps, cssProps, (name) => this.getVarName(name)) ?? (cssProps as unknown as Dictionary<CSSValueComp>);
        


        for (const [id, keyframe] of Object.entries(keyframes)) {
            if ((keyframe === undefined) || (keyframe === null)) continue;

            const keyframeCopy = {...keyframe};
            let modified = false;

            for (const [key, frame] of Object.entries(keyframeCopy)) {
                if ((frame === undefined) || (frame === null)) continue;

                const frameRep = replaceDuplicates(frame, cssProps);
                if (frameRep) {
                    (keyframeCopy as { [key: string]: any })[key] = frameRep;
                    modified = true;
                }
            } // for

            if (modified) keyframes[id] = keyframeCopy;
        } // for



        const styles = {
            '@global': {
                ':root': this._valProps,
                ...keyframes,
            },
        };
        this._css =
            getCustomJss()
            .createStyleSheet(styles)
            .attach();
    }


    get config()   { return this._configProxy; }

    get varProps() { return this._varPropsProxy;  }

    private _valPropsProxy: Dictionary<CSSValueComp> | null = null;
    get valProps() {
        return this._valPropsProxy ?? (this._valPropsProxy = (() =>
            new Proxy(this._cssProps as unknown as Dictionary<CSSValueComp>, {
                get: (items, name: string)        => this._valProps[this.getVarName(name)],
                set: (items, name: string, value) => { throw new Error('property is read only.'); }
            })
        )());
    }
}