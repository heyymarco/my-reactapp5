import type * as Css       from './Css';

import
    React, {
    useState }            from 'react';
import Container from './Container';
// import Button from './Button';
// import ButtonIcon from './ButtonIcon';
import type * as Inputs from './Input';
import Input from './Input';
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
    const [enableGrad, setEnableGrad] = useState(false);
	const [enable,     setEnable    ] = useState(true);
	const [focus, 	   setFocus     ] = useState(false);
	const [size, 	   setSize      ] = useState<'sm'|'lg'|undefined>(undefined);
	const [theme, 	   setTheme     ] = useState<'primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|'dark'|undefined>(undefined);
	const [inpStyle,   setInpStyle  ] = useState<'outline'|undefined>(undefined);
	const [isValid,    setIsValid   ] = useState<boolean|null|undefined>(undefined);

    const handleChangeEnableGrad = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnableGrad(e.target.checked);
	}
	const handleChangeEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnable(e.target.checked);
	}
	const handleChangeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFocus(e.target.checked);
	}
	const handleChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSize((e.target.value || undefined) as ('sm'|'lg'|undefined));
	}
	const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTheme((e.target.value || undefined) as ('primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|undefined));
	}
	const handleChangeInpStyle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInpStyle((e.target.value || undefined) as ('outline'|undefined));
	}
	const handleChangeIsValid = (e: React.ChangeEvent<HTMLInputElement>) => {
		switch(e.target.value) {
			case ' ':
				setIsValid(null);
				break;
			case '1':
				setIsValid(true);
				break;
			case '0':
				setIsValid(false);
				break;
			default:
				setIsValid(undefined);
		} // switch
	}


	return (
        <JssProvider jss={jss}>
            <Container style={{minHeight: '100vh'}}>
				{
					['text','number','email','tel','password','search','url','date','time','datetime-local','week','month'].map(type => (
						<Input key={type} defaultValue={`type ${type}`} theme={theme} enableGradient={enableGrad} size={size} enabled={enable} isValid={isValid} focus={focus ? true : undefined}
							inpStyle={inpStyle as Inputs.InpStyle} type={type as Css.InputType}

							customValidator={((type==='email') && ((state, val) => state.valid && (!val || val.endsWith('gmail.com')))) || undefined}
						/>
					))
				}


                <hr style={{flexBasis: '100%'}} />
				<label>
					<input type='checkbox'
						checked={enableGrad}
						onChange={handleChangeEnableGrad}
					/>
					enable gradient
				</label>
				<label>
					<input type='checkbox'
						checked={enable}
						onChange={handleChangeEnable}
					/>
					enabled
				</label>
				<label>
					<input type='checkbox'
						checked={focus}
						onChange={handleChangeFocus}
					/>
					focus
				</label>
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
				<p>
					Style:
					{
						[undefined,'outline'].map(s =>
							<label key={s ?? ''}>
								<input type='radio'
									value={s}
									checked={inpStyle===s}
									onChange={handleChangeInpStyle}
								/>
								{`${s}`}
							</label>
						)
					}
				</p>
				<p>
					IsValid:
					{
						[undefined, null, true, false].map(v =>
							<label key={(v===undefined) ? '?' : ((v===null) ? ' ' : (v ? 1 : 0))}>
								<input type='radio'
									value={(v===undefined) ? undefined : ((v===null) ? ' ' : (v ? 1 : 0))}
									checked={isValid===v}
									onChange={handleChangeIsValid}
								/>
								{(v===undefined) ? 'auto' : ((v===null) ? 'uncheck' : (v ? 'valid' : 'invalid'))}
							</label>
						)
					}
				</p>
            </Container>
        </JssProvider>
    );
}