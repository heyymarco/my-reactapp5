import jss, * as Jss from 'jss';
import preset from 'jss-preset-default';



type Dictionary<TValue> = { [index: string]: TValue };
type Var = string;
type Empty = undefined | null;

export default class JssVarCollection<TItem> {
    private _items: Dictionary<TItem>;
    private _itemsProxy: Dictionary<TItem | Var | Empty>;
    private _toString : ((value: TItem) => string);

    private _config: Dictionary<string>;
    private _configProxy: Dictionary<string>;

    private _css: Jss.StyleSheet<'@global'> | null = null;


    constructor(
        items    : Dictionary<TItem>,
        config   : Dictionary<string> = { varPrefix: '' },
        parser   : ((item: any) => TItem) | null = null,
        toString : ((item: TItem) => string) | null = null
    ) {
        this._config = config;
        this._configProxy = new Proxy(config, {
            set: (target, name: string, value) => {
        
                if (target[name] !== value) {
                    target[name] = value;
                    
                    this._rebuildJss(); // setting changed => need to rebuild the jss
                }
        
                return true;
            }
        });


        this._toString = toString ?? ((item) => `${item}`);
        this._items = items;
        this._itemsProxy = new Proxy(this._items, {
            get: (items, name: string) => {
                if (!Reflect.has(items, name)) return undefined;
        
                return `var(${this._getVarName(name)})`;
            },
            set: (items, name: string, value) => {
        
                if (!value) {
                    delete items[name];
                } else {
                    const newValue = parser ? parser(value) : (value as TItem);
                    if (items[name] !== newValue) {
                        items[name] = newValue;
        
                        this._rebuildJss(); // setting changed => need to rebuild the jss
                    }
                }
        
                return true;
            }
        });


        this._rebuildJss();
    }


    private _getVarName(baseName: string): string {
        const varPrefix = this._config.varPrefix;
        return `${varPrefix ? `--${varPrefix}-` : '--'}${baseName}`;
    }

    private _rebuildJss() {
        this._css?.detach();


        const items = this._items;
        const varItems: Dictionary<string | any[]> = {}; // clear values
        for (const name in items) { // set up values
            const value = items[name];
            if (Array.isArray(value)) {
                let arr = value as any[];
                let deep = false;
                if ((arr.length === 1) && Array.isArray(arr[0])) {
                    arr = arr[0] as any[];
                    deep = true;
                }
                arr = arr.slice(); // copy array object

                for (let index = 0; index < arr.length; index++) {
                    const arrItem = arr[index];

                    for (const prevName in items) {
                        if (prevName === name) break; // stop search if reaches current pos (search for prev values only)
                        const prevValue = items[prevName];
                        if (Array.isArray(prevValue)) continue; // ignore prev value if it's kind of array

                        if (arrItem === prevValue) arr[index] = `var(${this._getVarName(prevName)})`;
                        if (typeof(arrItem) !== 'string') arr[index] = this._toString(arrItem);
                    }
                }

                varItems[this._getVarName(name)] = deep ? [arr] : arr;

            } else {
                let modified = false;
                for (const prevName in items) {
                    if (prevName === name) break; // stop search if reaches current pos (search for prev values only)
                    const prevValue = items[prevName];
                    if (Array.isArray(prevValue)) continue; // ignore prev value if it's kind of array
    
                    if (value === prevValue) {
                        varItems[this._getVarName(name)] = `var(${this._getVarName(prevName)})`;
    
                        modified = true;
                        break;
                    }
                }
    
                if (!modified) {
                    varItems[this._getVarName(name)] = this._toString(items[name]);
                }
            }
        }


        const styles = {
            '@global': {
                ':root': varItems
            }
        };
        this._css = jss.setup(preset()).createStyleSheet(styles);
        this._css.attach();
    }


    get items() { return this._itemsProxy; }
    get config() { return this._configProxy; }
}