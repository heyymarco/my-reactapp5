// jss   (builds css  using javascript):
import { 
    create as createJss,
    createGenerateId
}                                   from 'jss'   // base technology of our nodestrap components
import type * as Jss                from 'jss'   // ts defs support for jss
import type * as Css                from './Css' // ts defs support for jss

// import presetDefault from 'jss-preset-default'
import jssPluginFunctions           from 'jss-plugin-rule-value-function'
// import jssPluginObservable       from 'jss-plugin-rule-value-observable'
// import jssPluginTemplate         from 'jss-plugin-template'
import jssPluginGlobal              from 'jss-plugin-global'
import jssPluginExtend              from 'jss-plugin-extend'
import jssPluginNested              from 'jss-plugin-nested'
// import jssPluginCompose          from 'jss-plugin-compose'
import jssPluginCamelCase           from 'jss-plugin-camel-case'
// import jssPluginDefaultUnit      from 'jss-plugin-default-unit'
import jssPluginExpand              from 'jss-plugin-expand'
// import jssPluginVendorPrefixer   from 'jss-plugin-vendor-prefixer'
// import jssPluginPropsSort        from 'jss-plugin-props-sort'
import jssPluginNormalizeShorthands from './jss-plugin-normalize-shorthands'

// other supports:
import deepEquals                from 'deep-equal'



// ts defs:
export type Dictionary<TValue> = { [key: string]: TValue };



// jss & utilities:

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



/**
 * A *css custom property* manager that manages & update the *css props* stored at *:root* level (default) or at specified selector.  
 * Supports get property by *declaration*, eg:  
 * `cssPropsManager.decls.myFavColor` => returns `'--myFavColor'`.  
 *   
 * Supports get property by *reference*,   eg:  
 * `cssPropsManager.refs.myFavColor`  => returns `'var(--myFooProp)'`.  
 *   
 * Supports get property by *value*, eg:  
 * `cssPropsManager.vals.myFavColor`  => returns `'#ff0000'`.  
 *   
 * Supports set property,                  eg:  
 * `cssPropsManager.vals.myFavColor = 'red'`
 */
export default class CssPropsManager<TProps, TProp extends TProps[keyof TProps]> {
    // settings:

    //#region selector
    /**
     * Holds the declaring location (selector) of the generated css props.  
     * If changed, causing the `_genProps` needs to rebuild.
     */
    private _selector : string;
    
    /**
     * Gets the declaring location (selector) of the generated css props.
     */
    public  get selector() { return this._selector; }
    
    /**
     * Sets the declaring location (selector) of the generated css props.
     */
    public  set selector(newValue: string) {
        if (this._selector === newValue) return; // still the same => no changes needed
        this._selector = newValue;

        this.refresh(); // setting changed => need to rebuild the jss
    }
    //#endregion selector

    //#region prefix
    /**
     * Holds the prefix name of the generated css props.  
     * Useful to avoid name collision if working with another css frameworks.  
     * If changed, causing the `_genProps` needs to rebuild.
     */
    private _prefix : string;

    /**
     * Gets the prefix name of the generated css props.
     */
    public  get prefix() { return this._prefix; }

    /**
     * Sets the prefix name of the generated css props.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    public  set prefix(newValue: string) {
        if (this._prefix === newValue) return; // still the same => no changes needed
        this._prefix = newValue;

        this.refresh(); // setting changed => need to rebuild the jss
    }
    //#endregion prefix



    // data sources:

    /**
     * Virtual *css dom*.  
     * The source of truth.  
     * If changed, causing the `_genProps` needs to rebuild.
     */
    private readonly _props      : Dictionary</*original: */TProp>;



    // generated data:

    /**
     * Generated *css dom* resides on memory only.  
     * Similar to `_props` but some values has been partially/fully *transformed*.  
     * The duplicate values has been replaced with the *'var(...)'* linked to the existing one.  
     * eg:  
     * // origin:  
     * _props = {  
     *    --col-red      : '#ff0000',  
     *    --col-blue     : '#0000ff',  
     *    --bd-width     : '1px',
     *    
     *    --col-favorite : '#ff0000',  
     *    --the-border   : [[ 'solid', '1px', '#0000ff' ]],  
     * };
     *   
     * // transformed:  
     * _genProps = {  
     *    --col-red      : '#ff0000',  
     *    --col-blue     : '#0000ff',  
     *    --bd-width     : '1px',
     *    
     *    --col-favorite : 'var(--col-red)',  
     *    --the-border   : [[ 'solid', 'var(--bd-width)', 'var(--col-blue)' ]],  
     * }
     */
    private          _genProps   : Dictionary</*original: */TProp | /*transformed: */Css.Expr> = {};

    /**
     * Generated *css dom* resides on html document.
     */
    private          _css        : Jss.StyleSheet<'@global'> | null = null;

    /**
     * Converts the origin prop name to the generated prop name, eg: `'favColor'` => `'--my-favColor'`.
     * @param prop The origin prop name.
     * @returns The generated prop name with/without prefix (depends on the configuration).
     */
    private getGenProp(prop: string): string {
        prop = prop.replace(/^@keyframes\s+/, 'keyframes-'); // replaces '@keyframes fooSomething' => 'keyframes-fooSomething'

        const prefix = this._prefix;
        return prefix ? `--${prefix}-${prop}` : `--${prop}`; // add double dash with prefix '--my-' or double dash without prefix '--'
    }



    // proxies - representing data in various formats:

    //#region decls
    /**
     * Getter: Gets the *prop name* which is declaring the css prop, eg: `'--my-favColor'`.  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _declsProxy : Dictionary</*getter: */          string | /*setter: */TProp>;

    /**
     * Getter: Gets the *prop name* which is declaring the css prop, eg: `'--my-favColor'`.  
     * Setter: Sets the *direct* value of the css props.
     */
    public get decls() {
        const _this = this;
        return this._declsProxy as (typeof _this._declsProxy & { [key: string]: string });
    }
    //#endregion decls

    //#region refs
    /**
     * Getter: Gets the *prop reference* linked to the css prop, not the *direct* value, eg: `'var(--my-favColor)'`.  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _refsProxy  : Dictionary</*getter: */        Css.Ref  | /*setter: */TProp>;

    /**
     * Getter: Gets the *prop reference* linked to the css prop, not the *direct* value, eg: `'var(--my-favColor)'`.  
     * Setter: Sets the *direct* value of the css props.
     */
    public get refs() {
        const _this = this;
        return this._refsProxy  as (typeof _this._refsProxy & { [key: string]: Css.Ref });
    }
    //#endregion refs
    
    //#region vals
    /**
     * Getter: Gets the *equivalent value* of the css prop, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]`; or the *direct* value, eg: `[['5px', '10px']]`.  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _valsProxy  : Dictionary</*getter: */TProp | Css.Expr | /*setter: */TProp>;

    /**
     * Getter: Gets the *equivalent value* of the css prop, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]`; or the *direct* value, eg: `[['5px', '10px']]`.  
     * Setter: Sets the *direct* value of the css props.
     */
    public get vals() {
        return this._valsProxy;
    }
    //#endregion vals



    // data getters & setters:

    /**
     * Gets the *prop name* which is declaring the css prop, eg: `'--my-favColor'`.
     * @param prop The origin prop name.
     * @return A string represents the declaring css prop -or- `undefined` if it doesn't exist.
     */
    private getDecl(prop: string) {
        /*
            source    cssProps:
            {
                '@keyframes foo' :  {...}
                'myFavColor'     : 'blue',
            }

            generated valProps:
            {
                '--pfx-keyframes-foo' : 'foo-HASH',            // '@keyframes foo'  => getPropName => '--pfx-keyframes-foo'
                '--pfx-myFavColor'    : 'var(--col-primary)',  // 'myFavColor'      => getPropName => '--pfx-myFavColor'
                '@keyframes foo-HASH' : {...}
            }
        */
        
        
        const genProp = this.getGenProp(prop);

        // check if the genProp is already exists:
        if (!(genProp in this._genProps)) return undefined; // not found
        
        return genProp;
    }

    /**
     * Gets the *prop reference* linked to the css prop, not the *direct* value, eg: `'var(--my-favColor)'`.
     * @param prop The origin prop name.
     */
    private getRef(prop: string) {
        const genProp = this.getDecl(prop);
        if (!genProp) return undefined; // not found

        return `var(${genProp})`;
    }

    /**
     * Gets the *equivalent value* of the css prop, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]`; or the *direct* value, eg: `[['5px', '10px']]`.
     * @param prop The origin prop name.
     */
    private getVal(prop: string) {
        const genProp = this.getDecl(prop);
        if (!genProp) return undefined; // not found

        return this._genProps[genProp];
    }

    /**
     * Sets the *direct* value of the css props.
     * @param prop The origin prop name.
     * @param newValue The desired prop value.
     */
    private setDirect(prop: string, newValue: TProp) {
        if ((newValue === undefined) || (newValue === null)) {
            delete this._props[prop];

            this.refresh(); // setting changed => need to rebuild the jss
        }
        else
        {
            if (this._props[prop] !== newValue) {
                this._props[prop] = newValue;

                this.refresh(); // setting changed => need to rebuild the jss
            }
        }

        return true;
    }



    // constructions:

    constructor(
        props    : TProps | (() => TProps),
        prefix   = '',
        selector = ':root'
    ) {
        // settings:
        this._selector = selector;
        this._prefix   = prefix;



        // data sources:
        this._props    = ((typeof(props)==='function') ? (props as (() => TProps))() : props) as unknown as Dictionary<TProp>;



        // proxies - representing data in various formats:

        const _this = this;

        this._declsProxy = new Proxy<typeof _this._declsProxy>(this._props, {
            get: (t, prop: string)                  => this.getDecl(prop),             // Gets the *prop name* which is declaring the css prop, eg: `'--my-favColor'`.
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the *direct* value of the css props.
        });

        this._refsProxy = new Proxy<typeof _this._refsProxy>(this._props, {
            get: (t, prop: string)                  => this.getRef(prop),              // Gets the *prop reference* linked to the css prop, not the *direct* value, eg: `'var(--my-favColor)'`.
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the *direct* value of the css props.
        });

        this._valsProxy = new Proxy<typeof _this._valsProxy>(this._genProps, {
            get: (t, prop: string)                  => this.getVal(prop),              // Gets the *equivalent value* of the css prop, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]`; or the *direct* value, eg: `[['5px', '10px']]`.
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the *direct* value of the css props.
        });


        
        // constructions:

        this.refresh();
    }


    /**
     * Holds the validity status of the generated data.  
     * `false` is invalid or never built.  
     * `true`  is valid.
     */
    private _valid = false;

    /**
     * Ensures the css props are valid.
     * @param immediately `true` to refresh the css props immediately (guaranteed has been refreshed after `refresh` returned) -or- `false` to refresh shortly after current execution finished.
     */
    public refresh(immediately = false) {
        if (immediately) {
            this.rebuild();
            this._valid = true; // mark the generated data is valid
        }
        else
        {
            this._valid = false; // mark the generated data as invalid
            setTimeout(() => {
                if (this._valid) return; // has been generated => abort
                this.rebuild();
                this._valid = true; // mark the generated data is valid
            }, 0);
        }
    }
    

    private rebuild() {
        this._css?.detach();


        
        const keyframes: Dictionary<object> = {};
        const replaceDuplicates = <TSrc, TRef>(srcProps: Dictionary<TSrc>, refProps: Dictionary<TRef>, propRename?: ((prop: string) => string)) => {
            const propRenameDefault = (prop: string) => prop;
            if (!propRename) propRename = propRenameDefault; // if no custom renamer => set default handler
            let globalModified = false; // a flag determines the outProps is different than srcProps
            const outProps: Dictionary<TSrc|Css.Expr> = {}; // an object for storing unmodified & modified properties from srcProps


            const isCombinable = <TVal,>(value: TVal) => {
                if (value === undefined) return false; // skip undefined prop
                if ((typeof(value) === 'string') && (/^(none|unset|inherit)$/).test(value as string)) return false; // ignore reserved keywords
                // if (Array.isArray(value)) return false; // ignore prev value if it's kind of array
                return true; // passed
            };
            const isSelf = (name: string, prevName: string) => {
                if ((srcProps as unknown) !== (refProps as unknown)) return false;
                return (name === prevName);
            };
            const findDuplicateProp = <TVal,>(name: string, value: TVal) => {
                for (const [prevName, prevValue] of Object.entries(refProps)) { // search for duplicate cssProps' value
                    if (isSelf(name, prevName)) break; // stop search if reaches current pos (search for prev values only)

                    if (!isCombinable(prevValue)) continue; // skip uncombinable prop


                    if (((value as unknown) === (prevValue as unknown)) || deepEquals(value, prevValue, {strict: true})) {
                        return `var(${this.getGenProp(prevName)})`;
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
                    let arr: any[] = value;
                    let deep = false;
                    if ((arr.length === 1) && Array.isArray(arr[0])) {
                        arr = arr[0];
                        deep = true;
                    }
                    arr = arr.slice(); // copy array object


                    let modified = false;
                    for (let index = 0; index < arr.length; index++) { // walk each arrayItem in arr
                        const arrItem = arr[index];

                        if (!isCombinable(arrItem)) continue; // skip uncombinable prop


                        const found = findDuplicateProp(name, arrItem);
                        if (found) {
                            arr[index] = found;

                            modified = true;
                            globalModified = true;
                        }
                    } // for // walk each arrayItem in arr


                    // save the unmodified/modified array:
                    outProps[propRename(name)] = modified ? (deep ? [arr] : arr) : value;
                    if (modified) continue; // continue to investigating next prop, do not execute *code below*
                }

                // *code below*:


                let modified = false;
                const found = findDuplicateProp(name, value);
                if (found) {
                    outProps[propRename(name)] = found;

                    modified = true;
                    globalModified = true;
                }
                
                
                if (!modified) {
                    outProps[propRename(name)] = value;
                }
            } // for // walk each props in srcProps


            if (globalModified || (propRename !== propRenameDefault)) return outProps;

            return null; // null means no modification
        }
        const props = this._props;
        this._genProps = replaceDuplicates(props, props, (prop) => this.getGenProp(prop)) ?? props;
        


        // prop             : keyframes
        // string           : object
        // '@keyframes foo' : {... '12%': {}, ...}
        for (const [id, keyframe] of Object.entries(keyframes)) {
            if ((keyframe === undefined) || (keyframe === null)) continue;

            const keyframeCopy = {...keyframe};
            let modified = false;


            // key    : frame
            // string : object
            // '12%'  : {... opacity: 0.5, ...}
            //               subKey : unknown
            for (const [key, frame] of Object.entries(keyframeCopy)) {
                if ((frame === undefined) || (frame === null)) continue;

                const frameRep = replaceDuplicates(frame as Dictionary<unknown>, props);
                if (frameRep) {
                    (keyframeCopy as { [key: string]: any })[key] = frameRep;
                    modified = true;
                }
            } // for

            if (modified) keyframes[id] = keyframeCopy;
        } // for



        const styles = {
            '@global': {
                ':root': this._genProps,
                ...keyframes,
            },
        };
        this._css =
            getCustomJss()
            .createStyleSheet(styles)
            .attach();
    }
}