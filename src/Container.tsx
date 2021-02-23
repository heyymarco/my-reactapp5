import  * as breakpoint    from './breakpoints';

import { 
    create as createJss,
}                          from 'jss';
import jssPluginGlobal     from 'jss-plugin-global';
import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



// define default cssProps' value to be stored into css vars:
const _cssProps = {
    x    : '12px',
    y    : '9px',

    xSm  : '24px',
    ySm  : '18px',

    xMd  : '36px',
    yMd  : '27px',

    xLg  : '48px',
    yLg  : '36px',

    xXl  : '60px',
    yXl  : '45px',

    xXxl : '72px',
    yXxl : '54px',
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps,
    /*config   :*/ { varPrefix: 'con'}
);
const config   = collection.config;
const cssProps = collection.varProps as (typeof _cssProps & { [key: string]: (undefined|string|number|(string|number)[][]) });
// export the configurable varPops:
export { config, cssProps as containers };
// export default cssProps;



const stylesMedia = { };
for (const bpName in breakpoint.breakpoints) {
    const BpName = pascalCase(bpName);

    const x = cssProps[`x${BpName}`];
    const y = cssProps[`y${BpName}`];
    if (x || y) {
        Object.assign(stylesMedia, breakpoint.mediaUp(bpName, {
            '@global': { ':root': {
                '--con-x': x || undefined,
                '--con-y': y || undefined,
            }},
        }));
    } // if
} // for

createJss().setup({plugins:[
    jssPluginGlobal(),
]})
.createStyleSheet(stylesMedia)
.attach();



const styles = {
    main: {
        paddingX : cssProps.x,
        paddingY : cssProps.y,
    },
};

const useStyles = createUseStyles(styles);
export { styles, useStyles };



export interface Props {
    className? : string
    style?     : React.CSSProperties
    children?  : React.ReactNode
}
export default function Container(props: Props) {
    const styles = useStyles();

    return (
        <div className={[
                styles.main,
                props.className,
            ].join(' ')}

            style={props.style}
        >
            {props.children}
        </div>
    );
}