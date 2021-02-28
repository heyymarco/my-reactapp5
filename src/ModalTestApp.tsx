import
    React, {
    useState }            from 'react';
import Container from './Container';
import Button from './Button';
import Modal from './Modal';

import {JssProvider}             from 'react-jss'
import { create as createJss }   from 'jss';
import jssPluginFunctions        from 'jss-plugin-rule-value-function';
// import jssPluginObservable       from 'jss-plugin-rule-value-observable';
// import jssPluginTemplate         from 'jss-plugin-template';
import jssPluginGlobal           from 'jss-plugin-global';
import jssPluginExtend           from 'jss-plugin-extend';
import jssPluginNested           from 'jss-plugin-nested';
// import jssPluginCompose          from 'jss-plugin-compose';
import jssPluginCamelCase        from 'jss-plugin-camel-case';
// import jssPluginDefaultUnit      from 'jss-plugin-default-unit';
import jssPluginExpand           from 'jss-plugin-expand';
// import jssPluginVendorPrefixer   from 'jss-plugin-vendor-prefixer';
// import jssPluginPropsSort        from 'jss-plugin-props-sort';
import jssPluginNormalizeShorthands from './jss-plugin-normalize-shorthands';



const jss = createJss().setup({plugins:[
	jssPluginFunctions(),
	// jssPluginObservable({}),
	// jssPluginTemplate(),
	jssPluginGlobal(),
	jssPluginExtend(),
	jssPluginNested(),
	// jssPluginCompose(),
	jssPluginCamelCase(),
	// jssPluginDefaultUnit({}),
	jssPluginExpand(),
	// jssPluginVendorPrefixer(),
	// jssPluginPropsSort(),
	jssPluginNormalizeShorthands()
]});
export default function App (props: any) {
    const [longContent, setLongContent] = useState(false);
    const [scrollable, setScrollable] = useState(false);
    const [theme, 	   setTheme      ] = useState<string|undefined>(undefined);
    const [active, setActive] = useState(false);

    return (
        <JssProvider jss={jss}>
            <Container>
                <Button theme='primary' text='Show Modal' onClick={() => setActive(true)} />
                <Modal scrollable={scrollable} theme={theme} active={active}
                    header=
                        'Modal Is Here'

                    footer={undefined}

                    onClose={() => setActive(false)}
                >
                    <h5>Card title</h5>
                    <p>
                        Long Content:
                        <input type='checkbox' checked={longContent} onChange={(e) => setLongContent(e.target.checked)} />
                    </p>
                    <p>
                        Scrollable:
                        <input type='checkbox' checked={scrollable} onChange={(e) => setScrollable(e.target.checked)} />
                    </p>
                    <p>
                        Theme:
                        {
                            [undefined,'primary','secondary','success','info','warning','danger','light','dark'].map(t =>
                                <label key={t ?? ''}>
                                    <input type='radio'
                                        value={t}
                                        checked={theme===t}
                                        onChange={(e) => setTheme(e.target.value || undefined)}
                                    />
                                    {`${t}`}
                                </label>
                            )
                        }
                    </p>
                    <p>This is a wider card with supporting text below as a natural lead-in to additional content.<br>
                    </br>This content is a little bit longer.</p>
                    {longContent && <p>
                        Lorem<br/>
                        ipsum<br/>
                        dolor<br/>
                        sit,<br/>
                        amet<br/>
                        consectetur<br/>
                        adipisicing<br/>
                        elit.<br/>
                        Obcaecati,<br/>
                        fugiat<br/>
                        quam<br/>
                        corrupti<br/>
                        doloremque<br/>
                        mollitia<br/>
                        fuga<br/>
                        tempora<br/>
                        sequi<br/>
                        repellat?<br/>
                        Sint<br/>
                        quia<br/>
                        doloremque,<br/>
                        accusantium<br/>
                        perferendis<br/>
                        autem<br/>
                        cupiditate!<br/>
                        Sapiente<br/>
                        odio<br/>
                        sit<br/>
                        voluptatem<br/>
                        accusamus.
                    </p>}
                    <p>Last updated 3 mins ago</p>
                </Modal>
            </Container>
        </JssProvider>
    );
}