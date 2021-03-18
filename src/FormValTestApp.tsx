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
import Form from './Form';
import ValidationProvider from './validations';
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
	const [enableVal, setEnableVal] = useState(false);

	const [size,  setSize ] = useState<'sm'|'lg'|undefined>(undefined);
	const [theme, setTheme] = useState<'primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|'dark'|undefined>(undefined);

	const handleChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSize((e.target.value || undefined) as ('sm'|'lg'|undefined));
	}
	const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTheme((e.target.value || undefined) as ('primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|undefined));
	}



	return (
        <JssProvider jss={jss}>
            <Container style={{minHeight: '100vh'}}>
				<ValidationProvider
					enableValidation={enableVal}
				>
					<Form size={size} theme={theme}>
						<Input 
							type='text'
							required={true}
							placeholder='your name?'
						/>
						<Input 
							type='email'
							required={true}
							defaultValue='abc@'
						/>
						<Input 
							type='text'
							required={false}
							minLength={3}
							placeholder='your pet name?'
						/>
						<Check text='I agree the terms'
							required={true}
						/>
						<hr/>

						<Button text='reset' />
						<Button text='reset' theme='warning' />
						<Button text='submit' theme='primary' onClick={() =>
							setEnableVal(true)
						} />

						<label>
							<input type='checkbox' checked={enableVal}
								onChange={(e) => setEnableVal(e.target.checked)}
							/>
							enable validation
						</label>
					</Form>
				</ValidationProvider>
				<hr />

				<p>
					Size:
					<label>
						<input type='radio'
							value='sm'
							checked={size==='sm'}
							onChange={handleChangeSize}
						/>
						sm
					</label>
					<label>
						<input type='radio'
							value=''
							checked={!size}
							onChange={handleChangeSize}
						/>
						unset
					</label>
					<label>
						<input type='radio'
							value='lg'
							checked={size==='lg'}
							onChange={handleChangeSize}
						/>
						lg
					</label>
				</p>
				<p>
					Theme:
					{
						[undefined,'primary','secondary','success','info','warning','danger','light','dark'].map(t =>
							<label key={t ?? ''}>
								<input type='radio'
									value={t}
									checked={theme===t}
									onChange={handleChangeTheme}
								/>
								{`${t}`}
							</label>
						)
					}
				</p>
            </Container>
        </JssProvider>
    );
}