import React from 'react';

import UseStyles from './UseStyles';

import colors from './colors';
import borders, * as border from './borders';
import spacers from './spacers';
import stripOuts from './strip-outs';
import './typos/index';



const styles = {
    main: {
        '--control--': 'ok',
        extend: [
            {
                '--control-more-ext--': 'ok',
            },
            stripOuts.control(),
            border.all(),
        ],
        background: colors.white,
        padding: spacers.xs
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