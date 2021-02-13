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
 * removes a browser's default styling on list (ul > li) & (ol > li).
 */
export const list = {
    listStyleType      : none,
    marginBlockStart   : unset,
    marginBlockEnd     : unset,
    marginInlineStart  : unset,
    marginInlineEnd    : unset,
    paddingInlineStart : unset,

    '>li': {
        display        : 'inline',
        textAlign      : unset,
    }
};


const exports = { link, control, list };
export default exports;