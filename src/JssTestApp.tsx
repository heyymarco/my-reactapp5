import React, { useState }  from 'react';
import { createUseStyles }  from 'react-jss';
import {JssProvider}        from 'react-jss'


const useChildStyle = createUseStyles({
    main: {
        color: 'red'
    }
});
function ChildComponent(props: any) {
    const style = useChildStyle();
    return (
        <div className={style.main}>
            this color  should be red
        </div>
    );
}


const useParentStyle = createUseStyles({
    main: {
        color: 'blue'
    }
});
function ParentComponent(props: any) {
    const style = useParentStyle();


    // dynamic rendering
    if (!props.show) return null;
    return (
        <div className={style.main}>
            <ChildComponent />
        </div>
    )
}




export default function App (props: any) {
    const [show, setShow] = useState(false);

    return (
        <JssProvider>
            <label>
                <input type='checkbox' checked={show} onChange={(e) => setShow(e.target.checked)} />
                Show me
            </label>

            <ParentComponent show={show} />
        </JssProvider>
    );
}