import type { Plugin, Rule, JssStyle, StyleSheet } from 'jss';



const shorthands: { [index: string]: string } = {
    backg   : 'background',
    anim    : 'animation',
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


            return style;
        }
    };
}