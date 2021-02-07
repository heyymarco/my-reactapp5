import { ReactElement } from 'react';

import { Styles, Classes } from 'jss';
import { createUseStyles, DefaultTheme } from 'react-jss'



export default function UseStyles<Theme = DefaultTheme>(props: {
        styles   : Styles | ((theme: Theme) => Styles),
        children: (classes: Classes) => ReactElement
    }) {
    const useStyles = createUseStyles(props.styles);
    const classes   = useStyles();
    return props.children(classes);
}