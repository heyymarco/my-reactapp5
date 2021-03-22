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
import deepEqual                    from 'deep-equal'



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



/**
 * A *css custom property* manager that manages & update the *css props* stored at *:root* level (default) or at specified `rule`.  
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

    //#region rule
    /**
     * Holds the declaring location (selector) of the generated css props.  
     * If changed, causing the `_genProps` needs to rebuild.
     */
    private _rule : string;
    
    /**
     * Gets the declaring location (selector) of the generated css props.
     */
    public  get rule() { return this._rule; }
    
    /**
     * Sets the declaring location (selector) of the generated css props.
     */
    public  set rule(newValue: string) {
        if (this._rule === newValue) return; // still the same => no changes needed
        this._rule = newValue;

        this.refresh(); // setting changed => need to rebuild the jss
    }
    //#endregion rule

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
    private          _sheet      : Jss.StyleSheet<'@global'> | null = null;

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

    /**
     * Converts the origin prop name to the generated prop ref, eg: `'favColor'` => `'var(--my-favColor)'`.
     * @param prop The origin prop name.
     * @returns The generated prop ref with/without prefix (depends on the configuration).
     */
    private getGenRef(prop: string): Css.Ref {
        return `var(${this.getGenProp(prop)})`;
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
        props  : TProps | (() => TProps),
        prefix = '',
        rule   = ':root'
    ) {
        // settings:
        this._rule   = rule;
        this._prefix = prefix;



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
        /**
         * Generated *keyframes*. Similar to `_props` but the key names starting with `'@keyframe foo'`.
         */
        const genKeyframes: Dictionary<Css.Keyframes> = {};



        const transformDuplicates = <TSrcProp, TRefProp>(srcProps: Dictionary<TSrcProp>, refProps: Dictionary<TRefProp>, propRename = ((prop: string) => prop)): (Dictionary<TSrcProp|Css.Ref> | undefined) => {
            /**
             * A frag determines the `copyProps` has modified.
             */
            let globalModified = false;



            /**
             * Determines if the specified `prop` can be transformed to another equivalent prop link `var(...)`.
             * @param prop The value to test.
             * @returns `true` indicates its transformable, otherwise `false`.
             */
            const isTransformableProp = <TTProp,>(prop: TTProp): boolean => {
                if (prop === undefined) return false; // skip empty prop

                if ((typeof(prop) === 'string') && (/^(none|unset|inherit)$/).test(prop)) return false; // ignore reserved keywords

                return true; // passed, transformable
            };

            /**
             * Determines if the specified `srcName` and `refName` are pointed to the same object.
             * @param srcName The prop name of `srcProps`.
             * @param refName The prop name of `refProps`.
             * @returns `true` indicates the same object, otherwise `false`.
             */
            const isSelfProp = (srcName: string, refName: string): boolean => {
                if (!Object.is(srcProps, refProps)) return false; // if srcProps & refProps are not the same object in memory => always return false
                
                return (srcName === refName);
            };

            /**
             * Determines if the specified `srcProp` and `refProp` are deeply the same by value.
             * @param srcProp The first value to test.
             * @param refProp The second value to test.
             * @returns 
             */
            const isEqualProp = <TTSrcProp, TTRefProp>(srcProp: TTSrcProp, refProp: TTRefProp) => deepEqual(srcProp, refProp, {strict: true});

            /**
             * Determines if the specified prop [key = `srcName` : value = `srcProp`] has the equivalent prop previously.
             * @param srcName The prop name (key).
             * @param srcProp The prop value.
             * @returns A `Css.Ref` (`string`) represents the link to the equivalent prop `var(...)`  
             * -or- `null` if no equivalent found.
             */
            const findEqualProp = <TTSrcProp,>(srcName: string, srcProp: TTSrcProp): (Css.Ref|null) => {
                for (const [refName, refProp] of Object.entries(refProps)) { // search for duplicates
                    if (isSelfProp(srcName, refName)) break; // stop search if reaches current pos (search for prev props only)


                    if (!isTransformableProp(srcProp)) continue; // skip non transformable prop


                    // comparing the srcProp & refProp:
                    if (isEqualProp(srcProp, refProp)) {
                        return this.getGenRef(refName); // return the link to the ref
                    }
                } // for // search for duplicates

                return null; // not found
            }


            
            /**
             * Stores the modified props of `srcProps`.
             */
            const modifProps: Dictionary<Css.Ref> = {}; // initially empty (no modification)



            for (const [srcName, srcProp] of Object.entries(srcProps)) { // walk each props in srcProps
                /**
                 * Determines if the current `srcName` is a special `@keyframes name`.  
                 * value:  
                 * `undefined` => *not* a special `@keyframes name`.  
                 * `string`    => represents the name of the `@keyframes`.
                 */
                const kfName = srcName.match(/(?<=@keyframes\s+).+/)?.[0];
                if (kfName) {
                    /**
                     * Assumes the current `srcProp` is a valid `@keyframes`' value.
                     */
                    const srcKeyframeProp = srcProp as unknown as Css.Keyframes;

                    

                    /**
                     * Determines if the current `srcKeyframeProp` has the equivalent stored `@keyframes`.  
                     * value:
                     * `undefined` => *no* equivalent `@keyframes` found.  
                     * `string`    => represents the name of the equivalent `@keyframes`.
                     */
                    const equalKfName = Object.entries(genKeyframes).find(entry => isEqualProp(entry[1], srcKeyframeProp))?.[0];
                    if (equalKfName) {
                        // found => use existing @keyframes name:

                        // replace with the equivalent `@keyframes` name:
                        modifProps[propRename(srcName)] = equalKfName;
                    }
                    else {
                        // not found => generate a unique @keyframes name:
                        const newKfName = generateKeyframeName(kfName);

                        // store the new @keyframes:
                        genKeyframes[`@keyframes ${newKfName}`] = srcKeyframeProp;

                        // replace with the new `@keyframes` name:
                        modifProps[propRename(srcName)] = newKfName;
                    } // if



                    // mission done => continue walk to next prop:
                    continue;
                }



                if (srcProp === undefined) continue; // skip undefined prop
                if (Array.isArray(srcProp)) {
                    let arr: any[] = srcProp;
                    let deep = false;
                    if ((arr.length === 1) && Array.isArray(arr[0])) {
                        arr = arr[0];
                        deep = true;
                    }
                    arr = arr.slice(); // copy array object


                    let modified = false;
                    for (let index = 0; index < arr.length; index++) { // walk each arrayItem in arr
                        const arrItem = arr[index];

                        if (!isTransformableProp(arrItem)) continue; // skip uncombinable prop


                        const found = findEqualProp(srcName, arrItem);
                        if (found) {
                            arr[index] = found;

                            modified = true;
                            globalModified = true;
                        }
                    } // for // walk each arrayItem in arr


                    // save the unmodified/modified array:
                    modifProps[propRename(srcName)] = modified ? (deep ? [arr] : arr) : srcProp;
                    if (modified) continue; // continue to investigating next prop, do not execute *code below*
                }

                // *code below*:


                let modified = false;
                const found = findEqualProp(srcName, srcProp);
                if (found) {
                    modifProps[propRename(srcName)] = found;

                    modified = true;
                    globalModified = true;
                }
                
                
                if (!modified) {
                    modifProps[propRename(srcName)] = srcProp;
                }
            } // for // walk each props in srcProps



            // if the modifProps is not empty (has any modifications) => return the (original + modified):
            if (Object.keys(modifProps).length) return {...srcProps, ...modifProps};

            return undefined; // undefined means no modification
        }


        
        const props = this._props;
        this._genProps = transformDuplicates(props, props, this.getGenProp) ?? props;
        


        //#region transform the keyframes
        /*
            kfName            : kfProp
            ------------------:---------------------------
            string            : Dict<  Dict<Css.Expr>   >
            ------------------:---------------------------
            '@keyframes foo'  : {     {'opacity': 0.5}  },
            '@keyframes dude' : {            ...        },
        */
        for (const [name, kfProp] of Object.entries(genKeyframes)) {
            if ((kfProp === undefined) || (kfProp === null)) continue; // skip empty keyframes



            type TKeyframes      = typeof kfProp; // keyframes = (key:string : frame:Dict<Expr>)*
            type TFrame          = TKeyframes[keyof TKeyframes];
            type TModifFrame     = Dictionary<TFrame[keyof TFrame] | Css.Ref>;
            type TmodifKeyframes = Dictionary<TModifFrame>;
            /**
             * Stores the modified props of `kfProp`.
             */
            const modifKfProp: TmodifKeyframes = {}; // initially empty (no modification)



            /*
                key    : frameProp
                -------:---------------
                string : Dict<Css.Expr>
                -------:---------------
                '12%'  : {
                            'opacity' : 0.5,
                            'color'   : 'red',
                            'some'    : Css.Expr,
                         }
            */
            for (const [key, frameProp] of Object.entries(kfProp)) {
                if ((frameProp === undefined) || (frameProp === null)) continue; // skip empty frames



                // find & transform the duplicate props (if any):
                const transfFrameProp = transformDuplicates(frameProp, props);

                // if transformed (modified) => store the modified:
                if (transfFrameProp) modifKfProp[key] = transfFrameProp;
            } // for

            

            // if the modifKfProp is not empty (has any modifications) => replace the original:
            if (Object.keys(modifKfProp).length) genKeyframes[name] = {...kfProp, ...modifKfProp};
        } // for
        //#endregion transform the keyframes



        //#region rebuild a new sheet content
        const styles = {
            '@global': {
                [this._rule]: this._genProps,
                ...genKeyframes,
            },
        };

        // detach the old sheet (if any):
        this._sheet?.detach();

        // create a new sheet & attach:
        this._sheet =
            getCustomJss()
            .createStyleSheet(styles)
            .attach();
        //#endregion rebuild a new sheet content
    }
}