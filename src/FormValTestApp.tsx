import type * as Css       from './Css';

import
    React, {
    useState }            from 'react';
import Container from './Container';
// import Button from './Button';
// import ButtonIcon from './ButtonIcon';
import type * as Inputs from './Input';
import Input from './Input';
import Check from './Check';
import Button from './Button';
// import Icon from './Icon';

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
	const [enabled, setEnabled] = useState(true);
	const [active, setActive] = useState(false);
	const [agree, setAgree] = useState(false);

	return (
        <JssProvider jss={jss}>
            <Container style={{minHeight: '100vh'}}>
				<form>
					<Input 
						type='email'
						required={true}
						defaultValue='abc@'
					/>

					<label>
						<input type='checkbox' checked={agree}
							onChange={(e) => setAgree(e.target.checked)}
						/>
						checked
					</label>

					<label>
						<input type='checkbox' checked={enabled}
							onChange={(e) => setEnabled(e.target.checked)}
						/>
						enabled
					</label>

					<label>
						<input type='checkbox' checked={active}
							onChange={(e) => setActive(e.target.checked)}
						/>
						active
					</label>
				</form>
            </Container>
        </JssProvider>
    );
}