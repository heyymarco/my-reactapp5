const unset = 'unset';
const none  = 'none';


/**
 * removes a browser's default styling on hyperlink.
 */
export const link = {
    color             : unset, // reset blue color
    textDecoration    : unset, // reset underline
    cursor            : unset, // reset hand pointer

    '&:active': {
        color         : unset, // reset blue color
    },

    '&:focus': {
        outline       : unset, // reset focus outline
        outlineOffset : unset, // reset focus outline
    },
};


/**
 * removes a browser's default styling on control (input, textarea, button, etc).
 */
export const control = {
    appearance        : none,

    textRendering     : unset,
    color             : unset,
    letterSpacing     : unset,
    wordSpacing       : unset,
    textTransform     : unset,
    textIndent        : unset,
    textShadow        : unset,
    textAlign         : unset,
    backgroundColor   : unset,
    cursor            : unset,
    margin            : unset,
    font              : unset,
    padding           : unset,
    border            : unset,
    boxSizing         : unset,

    '&:focus': {
        outline       : unset, // reset focus outline
        outlineOffset : unset, // reset focus outline
    },
};

/**
 * removes a browser's default styling on input[type=**text**].
 * **text** = text|number|email|tel|password|search|url|date|time|datetime-local|week|month
 */
 export const textbox = {
     extend: [
        control,
     ],


    '&::-webkit-calendar-picker-indicator, &::-webkit-inner-spin-button, &::-webkit-search-cancel-button': {
        appearance : none,
        display    : none,
    },
    
    '-moz-appearance': 'textfield',
    '&:valid, &:invalid': {
        boxShadow  : unset,
    },
 };


/**
 * removes a browser's default styling on list (ul > li) & (ol > li).
 */
export const list = {
    listStyleType      : none,
    marginBlockStart   : unset,
    marginBlockEnd     : unset,
    marginInlineStart  : unset,
    marginInlineEnd    : unset,
    paddingInlineStart : unset,

    '& >li': {
        display        : unset,
        textAlign      : unset,
    }
};

/**
 * removes a browser's default styling on figure.
 */
export const figure = {
    display           : unset,
    marginBlockStart  : unset,
    marginBlockEnd    : unset,
    marginInlineStart : unset,
    marginInlineEnd   : unset,
};

/**
 * removes a browser's default styling on focusable element.
 */
export const focusableElement = {
    '&:focus': {
        outline: unset,
    }
};
