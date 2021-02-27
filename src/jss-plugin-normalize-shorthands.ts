import type { Plugin, Rule, JssStyle, StyleSheet } from 'jss';



const shorthands: { [index: string]: string } = {
    backg        : 'background',
    'backg-clip' : 'background-clip',
    anim         : 'animation',
    'gap-x'      : 'column-gap',
    'gap-y'      : 'row-gap',
};

type StyleEx = { [index: string]: any };
export default function normalizeShorthands(): Plugin {
    return {
        onProcessStyle: (style: JssStyle, rule: Rule, sheet?: StyleSheet): JssStyle => {
            
            for (const prop in shorthands) {
                if (prop in style) {
                    (style as StyleEx)[shorthands[prop]] = (style as StyleEx)[prop];
                    delete (style as StyleEx)[prop];
                }
            }

            
            const hasPaddingX = ('padding-x' in style);
            const hasPaddingY = ('padding-y' in style);
            if (hasPaddingX && hasPaddingY) {
                style.padding = [[(style as StyleEx)['padding-y'], (style as StyleEx)['padding-x']]];
                delete (style as StyleEx)['padding-x'];
                delete (style as StyleEx)['padding-y'];
            } else if (hasPaddingX) {
                style.paddingLeft = style.paddingRight = (style as StyleEx)['padding-x'];
                delete (style as StyleEx)['padding-x'];
            } else if (hasPaddingY) {
                style.paddingTop = style.paddingBottom = (style as StyleEx)['padding-y'];
                delete (style as StyleEx)['padding-y'];
            }

            const hasMarginX = ('margin-x' in style);
            const hasMarginY = ('margin-y' in style);
            const styleAny = style as {[key: string]: any};
            if (hasMarginX && hasMarginY) {
                const marginX = (style as StyleEx)['margin-x'];
                const marginY = (style as StyleEx)['margin-y'];
                if (Array.isArray(marginX) && Array.isArray(marginY)
                    && (marginX.length === 1) && (marginY.length === 1)
                    && Array.isArray(marginX[0]) && Array.isArray(marginY[0])
                ) {
                    style.margin = [[
                        marginY[0].join(' '),
                        marginX[0].join(' '),
                    ]];
                }
                else {
                    style.margin = [[
                        marginY,
                        marginX,
                    ]];
                }

                delete (style as StyleEx)['margin-x'];
                delete (style as StyleEx)['margin-y'];
            } else if (hasMarginX) {
                styleAny['margin-left'] = styleAny['margin-right'] = (style as StyleEx)['margin-x'];
                delete (style as StyleEx)['margin-x'];
            } else if (hasMarginY) {
                styleAny['margin-top'] = styleAny['margin-bottom'] = (style as StyleEx)['margin-y'];
                delete (style as StyleEx)['margin-y'];
            }


            return style;
        }
    };
}