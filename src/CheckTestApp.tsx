import
    React, {
    useState }            from 'react';
import Container from './Container';
// import Button from './Button';
// import ButtonIcon from './ButtonIcon';
import type * as Checks from './Check';
import Check from './Check';
import Radio from './Radio';
// import Icon from './Icon';
import './CheckTestApp.css';

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
	const [active, 	   setActive    ] = useState(false);
	const [focus, 	   setFocus     ] = useState(false);
	const [size, 	   setSize      ] = useState<'sm'|'lg'|undefined>(undefined);
	const [check,      setCheck   ] = useState(false);
	const [isValid,    setIsValid   ] = useState<boolean|null|undefined>(undefined);

    const handleChangeEnableGrad = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnableGrad(e.target.checked);
	}
	const handleChangeEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnable(e.target.checked);
	}
	const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActive(e.target.checked);
	}
	const handleChangeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFocus(e.target.checked);
	}
	const handleChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSize((e.target.value || undefined) as ('sm'|'lg'|undefined));
	}
	const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheck(e.target.checked);
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


	const styles = [undefined,'outline','switch','switchOutline','btn','btnOutline'];
	const themes = [undefined,'primary','secondary','success','info','warning','danger','light','dark'];

	const [currentRadio, setCurrentRadio] = useState<string>('');
	let indexRadio = 0;
    return (
        <JssProvider jss={jss}>
            <Container style={{minHeight: '100vh'}}>
				{
					styles.map(style => (
						<p key={style ?? 'none'} className='ctrlList'>
							{
								themes.map(theme => (
									<Check key={theme ?? 'none'} text={theme ?? 'default'} theme={theme} enableGradient={enableGrad} size={size} enabled={enable} active={active} focus={focus}
										isValid={isValid}
										checked={check}
										onChange={handleChangeCheck}
										chkStyle={style as Checks.ChkStyle}
									/>
								))
							}
						</p>
					))
				}

				<hr style={{flexBasis: '100%'}} />

				{
					

					styles.map(style => (
						<p key={style ?? 'none'} className='ctrlList'>
							{
								themes.map(theme => (
									<Radio key={indexRadio++} text={theme ?? 'default'} theme={theme} enableGradient={enableGrad} size={size} enabled={enable} active={active} focus={focus}
										isValid={isValid}
										chkStyle={style as Checks.ChkStyle}

										value={indexRadio}
										checked={`${indexRadio}` === currentRadio}
										onChange={(e) => setCurrentRadio(e.target.value)}
									/>
								))
							}
						</p>
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
						checked={active}
						onChange={handleChangeActive}
					/>
					active
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
					<label>
						<input type='checkbox'
							checked={check}
							onChange={handleChangeCheck}
						/>
						checked
					</label>
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