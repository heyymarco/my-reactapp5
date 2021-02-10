import * as base        from './base';

import gens             from './general';



// define the css class:
base.declareCss({
    'del,s,ins,u,small,.small,strong,b,em,i': {
        display: 'inline',
    },
    'del,s': {
        textDecoration : 'line-through',
    },
    'ins,u': {
        textDecoration : 'underline',
    },
    'small,.small': {
        fontSize       : gens.fontSizeSm,
    },
    'strong,b': {
        fontWeight     : gens.fontWeightBolder,
    },
    'em,i': {
        fontStyle      : 'italic',
    },
});