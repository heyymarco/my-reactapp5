import type * as Css       from './Css';

import * as Checks         from './Check';
import {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,

    escapeSvg,
}                          from './Check';
import * as border         from './borders';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeave, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlur, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,

    escapeSvg,
};



export interface CssProps {
    img          : Css.Image

    borderRadius : Css.BorderRadius
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';

// internal css vars:
// const getVar = (name: string) => `var(${name})`;
export const vars = Object.assign({}, Checks.vars, {
});

// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // forked from Bootstrap 5:
    img          : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='2' fill='#000'/></svg>")}")`,

    borderRadius : border.radiuses.circle,
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'rad'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



const chkStyles = {
    extend: [
        filterValidProps(cssProps), // apply our filtered cssProps
    ],

    img : undefined as unknown as null, // delete



    '&::before': { // the main "icon" element:
        [vars.img]: cssProps.img,
    },
};
const styles = {
    main: {
        // the main "checkbox" element:
        '& >:first-child': chkStyles,
    },
};

const useStyles = createUseStyles(styles);
export { chkStyles, styles, useStyles };



export interface Props
    extends
        Checks.Props
{
}
export default function Radio(props: Props) {
    const styles = useStyles();
    return Checks.CheckBase(styles.main, props, 'radio');
}