const breakpoints = {
    xs  : 0,
    sm  : 576,
    md  : 768,
    lg  : 992,
    xl  : 1200,
    xxl : 1400,
};
const breakpoints2 = breakpoints as (typeof breakpoints & { [name: string]: (undefined|number) });
export { breakpoints2 as breakpoints };



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

/**
 * Media of at least the minimum breakpoint width. No query for the smallest breakpoint.
 * @param name the name of the given breakpoint.
 * @param content the content to apply if the media meets the minimum breakpoint width.
 * @return the css rule object.
 */
export function mediaUp(name: string, content: object) {
    const minVal = min(name);
    if (minVal) {
        return {
            [`@media (min-width: ${minVal}px)`]: content,
        };
    }
    else {
        return content;
    }
}

/**
 * Media of at least the maximum breakpoint width. No query for the smallest breakpoint.
 * @param name the name of the given breakpoint.
 * @param content the content to apply if the media meets the maximum breakpoint width.
 * @return the css rule object.
 */
export function mediaDown(name: string, content: object) {
    const maxVal = max(name);
    if (maxVal) {
        return {
            [`@media (max-width: ${maxVal}px)`]: content,
        };
    }
    else {
        return content;
    }
}

/**
 * Media that spans multiple breakpoint widths.
 * @param lower the name of the minimum breakpoint.
 * @param upper the name of the maximum breakpoint.
 * @param content the content to apply if the media meets the minimum & maximum breakpoint width.
 * @return the css rule object.
 */
export function mediaBetween(lower: string, upper: string, content: object) {
    const minVal = min(lower);
    const maxVal = max(upper);
    if (minVal && maxVal) {
        return {
            [`@media (min-width: ${minVal}px) and (max-width: ${maxVal}px)`]: content,
        };
    }
    else if (minVal) {
        return {
            [`@media (min-width: ${minVal}px)`]: content,
        };
    }
    else if (maxVal) {
        return {
            [`@media (max-width: ${maxVal}px)`]: content,
        };
    }
    else {
        return content;
    }
}

/**
 * Media between the breakpoint's minimum and maximum widths.
 * @param name the name of the given breakpoint.
 * @param content the content to apply if the media meets the minimum & maximum breakpoint width.
 * @return the css rule object.
 */
export function mediaOnly(name: string, content: object) {
    const minVal  = min(name);
    const nextVal = next(name);
    const maxVal  = nextVal ? max(nextVal) : null;
    if (minVal && maxVal) {
        return {
            [`@media (min-width: ${minVal}px) and (max-width: ${maxVal}px)`]: content,
        };
    }
    else if (minVal) {
        return {
            [`@media (min-width: ${minVal}px)`]: content,
        };
    }
    else if (maxVal) {
        return {
            [`@media (max-width: ${maxVal}px)`]: content,
        };
    }
    else {
        return content;
    }
}