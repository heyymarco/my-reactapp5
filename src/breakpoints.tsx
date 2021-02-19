const breakpoints = {
    xs  : 0,
    sm  : 576,
    md  : 768,
    lg  : 992,
    xl  : 1200,
    xxl : 1400,
};
export { breakpoints };



/**
 * Gets the name of the next breakpoint.
 * @param name the name of the current breakpoint.
 * @return the name of the next breakpoint, or undefined for the last breakpoint.
 */
export function next(name: string) {
    let wasFound = false;
    for (const breakpoint in breakpoints) {
        if (wasFound) return breakpoint;

        if (breakpoint === name) wasFound = true;
    }

    return undefined;
}

/**
 * Gets the minimum breakpoint width.
 * @param name the breakpoint's name to get the min width.
 * @return the minimum width of the given breakpoint's name, or null for the smallest breakpoint.
 */
export function min(name: string) {
    const value = (breakpoints as { [name: string]: (number|undefined) })?.[name];
    if (value === undefined) throw new Error(`Breakpoint '${name}' is not found in breakpoints.`);

    return value || null;
}

/**
 * Gets the maximum breakpoint width.
 * @param name the breakpoint's name to get the max width.
 * @return the maximum width of the given breakpoint's name, or null for the smallest breakpoint.
 */
export function max(name: string) {
    const value = min(name);

    if (value && (value >= 0.02)) return (value - 0.02);
    return null;
}

/**
 * Returns a blank string if smallest breakpoint, otherwise returns the name with a dash in front.
 * @param name the breakpoint's name to get the infix.
 * @return -${breakpoint-name} or null for the smallest breakpoint.
 */
export function infix(name: string) {
    if (!min(name)) return null;

    return `-${name}`;
}

export function mediaUp(name: string, content: object) {
    const minVal = min(name);
    if (minVal) {
        return {
            [`@media (min-width: ${minVal}px)`]: {
                extend: [content],
            }
        };
    }
    else {
        return content;
    }
}