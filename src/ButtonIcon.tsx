import
    React,
    { useMemo }            from 'react';

import Button              from './Button';
import type * as Buttons   from './Button';
import Icon                from './Icon';
import type * as Icons     from './Icon';



export interface Props
    extends
        Buttons.Props
{
    icon?          : string
    'aria-hidden'? : boolean
}
export default function ButtonIcon(props: Props) {
    const [btnProps, iconProps] = useMemo(() => {
        if (!props.icon) return [props, null];


        const iconProps = Object.assign({}, props, {
            size     : '1em',
        });
        delete iconProps.theme;
        delete iconProps.children;
        delete iconProps.text;


        const btnProps = Object.assign({}, props);
        delete btnProps.icon;
        delete btnProps['aria-hidden'];
        delete btnProps.children;
        delete btnProps.text;


        return [btnProps, iconProps];
    }, [props]);


    if (iconProps) {
        btnProps.children = (
            <>
                {Icon(iconProps as Icons.Props)}
                {props.text}
                {props.children}
            </>
        );
    } // if
    return <Button {...btnProps} />;
}