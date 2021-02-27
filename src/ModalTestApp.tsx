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
    return (
        <JssProvider jss={jss}>
            <Container>
                <Modal
                    header=
                        'Modal Is Here'

                    footer={
                        <Button theme='primary' text='Close' />
                    }
                >
                    <h5>Card title</h5>
                    <p>This is a wider card with supporting text below as a natural lead-in to additional content.<br>
                    </br>This content is a little bit longer.</p>
                    <p>Last updated 3 mins ago</p>
                </Modal>
            </Container>
        </JssProvider>
    );
}