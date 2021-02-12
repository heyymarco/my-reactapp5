import { 
    create as createJss
}                                from 'jss';
import type * as Jss             from 'jss';
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
import jssPluginNormalizeShorthands from '../jss-plugin-normalize-shorthands';



export type Expression = (string | number | Expression)[] | (string | number | Expression)[][];
export interface Props {
    fontSize       : string | number   | Expression;
    fontFamily     : string | string[] ;
    fontWeight     : string | number   ;
    fontStyle      : string            ;
    textDecoration : string            ;
    lineHeight     : string | number   ;
}



let customJssCache: Jss.Jss | null = null;
const getCustomJss = () => {
    if (customJssCache) return customJssCache;

    customJssCache = createJss().setup({
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
    });

    return customJssCache;
}
export function declareCss(css : object) {
    getCustomJss()
    .createStyleSheet({
        '@global': css
    }).attach();
}