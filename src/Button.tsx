import React from 'react';

import UseStyles from './UseStyles';

import Control, { styles as base_styles } from './Control';
import colors from './colors';


const styles = {
    '@global': {
        ':root': {
            '--test': 'ok'
        }
    },
    main: {
        extend: [
            base_styles.main,
        ],
        color: colors.red,
    },
    disabled: {
        extend: base_styles.disabled
    },
};
export { styles };


export default class Button extends Control {
    render() {
        return (
            <UseStyles styles={styles}>{ classes =>
                <button className={classes.main}>
                    hello world
                </button>
            }</UseStyles>
        );
    }
}