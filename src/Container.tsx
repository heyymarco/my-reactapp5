import
    * as breakpoint        from './breakpoints';

import { 
    create as createJss,
}                          from 'jss';
import jssPluginGlobal     from 'jss-plugin-global';
import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



// define default props' value to be stored into css vars:
const props = {
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



// convert props => varProps:
const collection = new JssVarCollection(
    /*props  :*/ props,
    /*config :*/ { varPrefix: 'con'}
);
const config   = collection.config;
const varProps = collection.varProps as (typeof props & { [key: string]: (undefined|string|number|(string|number)[][]) });
// export the configurable props:
export { config, varProps as containers };
// export default varProps;



const stylesMedia = { };
for (const bpName in breakpoint.breakpoints) {
    const BpName = pascalCase(bpName);

    const x = varProps[`x${BpName}`];
    const y = varProps[`y${BpName}`];
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
        paddingX : varProps.x,
        paddingY : varProps.y,
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