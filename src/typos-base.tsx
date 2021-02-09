import jss           from 'jss';
import presetDefault from 'jss-preset-default';



export interface Props {
    fontSize       : string | number   ;
    fontFamily     : string | string[] ;
    fontWeight     : string | number   ;
    fontStyle      : string            ;
    textDecoration : string            ;
    lineHeight     : string | number   ;
}



export function declareCss(css : object) {
    jss.setup(presetDefault()).createStyleSheet({
        '@global': css
    }).attach();
}