import React from 'react';

import UseStyles from './UseStyles';

import colors from './colors';
import * as border from './borders';



console.log(border.all());
const styles = {
    main: {
        '--control--': 'ok',
        extend: [
            {
                '--control-more-ext--': 'ok',
            },
            border.all()
        ],
        background: colors.white,
    },
    disabled: {
        opacity: 0.5,
        cursor: 'not-allow',
    }
}
export { styles };


export default class Control extends React.Component {
    render() {
        return (
            <UseStyles styles={styles}>{ classes =>
                <div className={classes.main}>
                    abstract base control
                </div>
            }</UseStyles>
        );
    }
}