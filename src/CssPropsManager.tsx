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



export default class CssPropsManager<TCssProps, TProp extends TCssProps[keyof TCssProps]> {
    /**
     * Holds the prefix name of the generated css props.  
     * If changed, causing the `_valProps` needs to rebuild.
     */
    private          _propPfx    : string;

    /**
     * Virtual *css dom*.  
     * The source of truth.  
     * Any *changes* causing the `_valProps` needs to rebuild => use `_cssProps` as source.
     */
    private readonly _cssProps   : Dictionary<TProp>;

    /**
     * Reflected *css dom*.  
     * Similar to `cssProps` but *some values* has been compacted.  
     * The duplicate values has been replaced with the var(...) linked to the prev one.
     */
    private          _valProps   : Dictionary</*original: */TProp | /*compacted: */Css.Expr> = {};



    /**
     * Getter: Gets the prop name which is declaring the css props, eg: --my-prop.  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _declsProxy : Dictionary</*getter: */          string | /*setterr: */TProp>;

    /**
     * Getter: Gets the prop reference of the css props, not the *direct* value, eg: var(--my-prop).  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _refsProxy  : Dictionary</*getter: */        Css.Prop | /*setterr: */TProp>;
    
    /**
     * Getter: Gets the *equivalent* value of the css props - the transformed value, after compacted, eg: var(--pad-y) var(--pad-x).  
     * Setter: Sets the *direct* value of the css props.
     */
    private readonly _valsProxy  : Dictionary</*getter: */TProp | Css.Expr | /*setterr: */TProp>;



    /**
     * Holds the generated css props.
     */
    private          _css        : Jss.StyleSheet<'@global'> | null = null;



    constructor(
        cssProps  : TCssProps | (() => TCssProps),
        propPfx   = '',
    ) {
        this._propPfx  = propPfx;
        this._cssProps = ((typeof(cssProps)==='function') ? (cssProps as (() => TCssProps))() : cssProps) as unknown as Dictionary<TProp>;



        const _this = this;

        this._declsProxy = new Proxy<typeof _this._declsProxy>(this._cssProps, {
            get: (t, prop: string)                  => this.getDecl(prop),             // Gets the prop name which is declaring the css props, eg: --my-prop.
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the direct value of the css props.
        });

        this._refsProxy = new Proxy<typeof _this._refsProxy>(this._cssProps, {
            get: (t, prop: string)                  => this.getRef(prop),              // Gets the prop reference of the css props, not the *direct* value, eg: var(--my-prop).
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the direct value of the css props.
        });

        this._valsProxy = new Proxy<typeof _this._valsProxy>(this._valProps, {
            get: (t, prop: string)                  => this.getVal(prop),              // Gets the *equivalent* value of the css props - the transformed value, after compacted, eg: var(--pad-y) var(--pad-x).
            set: (t, prop: string, newValue: TProp) => this.setDirect(prop, newValue), // Sets the direct value of the css props.
        });


        
        this.rebuildJss();
    }



    /**
     * Gets the prop name which is declaring the css props, eg: --my-prop.
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
        
        // if (matchKeyframeName.test(name)) return cssProps[name]; //'foo-HASH'

        const prop2 = this.getProp(prop);
        if (!(prop2 in this._valProps)) return undefined; // not found
        return prop2;
    }

    /**
     * Gets the prop reference of the css props, not the *direct* value, eg: var(--my-prop).
     */
    private getRef(prop: string) {
        const prop2 = this.getDecl(prop);
        if (prop2 === undefined) return undefined; // not found
        return `var(${prop2})`;
    }

    /**
     * Gets the *equivalent* value of the css props - the transformed value, after compacted, eg: var(--pad-y) var(--pad-x).
     */
    private getVal(prop: string) {
        const prop2 = this.getDecl(prop);
        if (prop2 === undefined) return undefined; // not found
        return this._valProps[prop2];
    }

    /**
     * Sets the *direct* value of the css props.
     */
    private setDirect(prop: string, newValue: TProp) {
        if ((newValue === undefined) || (newValue === null)) {
            delete this._cssProps[prop];
        }
        else
        {
            if (this._cssProps[prop] !== newValue) {
                this._cssProps[prop] = newValue;

                this.rebuildJss(); // setting changed => need to rebuild the jss
            }
        }

        return true;
    }
    


    private getProp(baseName: string): string {
        baseName = baseName.replace(/^@keyframes\s+/, 'keyframes-');

        const propPfx = this._propPfx;
        return `${propPfx ? `--${propPfx}-` : '--'}${baseName}`;
    }

    public rebuildJss() {
        this._css?.detach();


        
        const keyframes: Dictionary<object> = {};
        const replaceDuplicates = <TSrc, TRef>(srcProps: Dictionary<TSrc>, refProps: Dictionary<TRef>, propRename?: ((name: string) => string)) => {
            const propRenameDefault = (name: string) => name;
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
                        return `var(${this.getProp(prevName)})`;
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
        const cssProps = this._cssProps;
        this._valProps = replaceDuplicates(cssProps, cssProps, (name) => this.getProp(name)) ?? cssProps;
        


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

                const frameRep = replaceDuplicates(frame as Dictionary<unknown>, cssProps);
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



    /**
     * Gets the prefix name of the css props stored at `:root` level.
     */
    get propPfx() { return this._propPfx; }
    /**
     * Sets the prefix name of the css props stored at `:root` level.  
     * Useful to avoid name collision if working with another css frameworks.
     */
    set propPfx(newValue: string) {
        if (this._propPfx === newValue) return; // still the same => no changes needed
        this._propPfx = newValue;

        this.rebuildJss(); // setting changed => need to rebuild the jss
    }



    /**
     * Getter: Gets the prop name which is declaring the css props, eg: --my-prop.  
     * Setter: Sets the *direct* value of the css props.
     */
    get decls() {
        const _this = this;
        return this._declsProxy as unknown as (typeof _this._declsProxy & { [key: string]: string });
     // return this._declPropsProxy as unknown as (TCssProps | { [key: string]: string });
    }

    /**
     * Getter: Gets the prop reference of the css props, not the *direct* value, eg: var(--my-prop).  
     * Setter: Sets the *direct* value of the css props.
     */
    get refs() {
        const _this = this;
        return this._refsProxy as unknown as (typeof _this._refsProxy & { [key: string]: Css.Prop });
    }

    /**
     * Getter: Gets the *equivalent* value of the css props - the transformed value, after compacted, eg: var(--pad-y) var(--pad-x).  
     * Setter: Sets the *direct* value of the css props.
     */
    get vals() {
        const _this = this;
        return this._valsProxy as unknown as (typeof _this._valsProxy);
    }
}