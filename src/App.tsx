import
    React, {
    useState }            from 'react';
import logo from './logo.svg';
import './App.css';
import Element from './Element';
import Control from './Control';
import Button from './Button';

import {ThemeProvider} from 'react-jss';
import {JssProvider} from 'react-jss'
import colors from './colors';

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


// colors.red = '#ee0011';


const themeX = {
  colors: {
    warning: colors.warning,
  }
}

const jss = createJss().setup({
	plugins: [
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
	]
});

export default function App (props: any) {
	const [enabled, setEnabled] = useState(true);
	const [active, setActive] = useState(false);
	const [focus, setFocus] = useState(false);
	const [size, setSize] = useState<'sm'|'lg'|undefined>(undefined);
	const [theme, setTheme] = useState<'primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|'dark'|undefined>('primary');
	const [btnStyle, setBtnStyle] = useState<'outline'|'link'|'outlineLink'|undefined>('outline');

	const handleChangeEnabled = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnabled(e.target.checked);
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
	const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTheme((e.target.value || undefined) as ('primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|undefined));
	}
	const handleChangeBtnStyle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBtnStyle((e.target.value || undefined) as ('outline'|'link'|'outlineLink'|undefined));
	}

	return(<JssProvider jss={jss}><ThemeProvider theme={themeX}>
		<div className='App'>
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<Element theme={theme} enableGradient={true} size={size}></Element>
				<Control theme={theme} enableGradient={true} size={size} enabled={enabled} active={active} focus={focus}></Control>
				<Button  theme={theme} enableGradient={true} size={size} enabled={enabled} active={active} focus={focus} text='Hello Button' btnStyle={btnStyle}></Button>
				<p>
					Active status: {active ? 'actived' : 'deactived'}
				</p>
				<label>
					<input type='checkbox'
						checked={enabled}
						onChange={handleChangeEnabled}
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
					Theme:
					{
						[undefined,'primary','secondary','success','info','warning','danger','light'].map(t =>
							<label>
								<input type='radio' key={t}
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
					BtnStyle:
					<label>
						<input type='radio'
							value=''
							checked={!btnStyle}
							onChange={handleChangeBtnStyle}
						/>
						unset
					</label>
					<label>
						<input type='radio'
							value='outline'
							checked={btnStyle==='outline'}
							onChange={handleChangeBtnStyle}
						/>
						outline
					</label>
					<label>
						<input type='radio'
							value='link'
							checked={btnStyle==='link'}
							onChange={handleChangeBtnStyle}
						/>
						link
					</label>
					<label>
						<input type='radio'
							value='outlineLink'
							checked={btnStyle==='outlineLink'}
							onChange={handleChangeBtnStyle}
						/>
						outlineLink
					</label>
				</p>
				<p>this is normal text</p>
				<p className="txt-sec">this is secondary text</p>
				<p className="lead">this is lead text</p>
				<h1>this is title</h1>
				<h1 className="display-2">this is title</h1>
				<blockquote>this is blockquote</blockquote>
				<p>the <mark>marked text</mark> here</p>
				<p>the <code>body&#123; font-family: 'Arial' &#125;</code> here</p>
				<p>press <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>del</kbd></p>
				<p><del>deleted</del> <s>wrong</s> <ins>added new</ins> <u>please understand</u> <small>i'm tiny</small> <strong>please understand</strong> <b>important</b> <em>remember me</em> <i>forget me</i></p>
				<hr />
				<p>hello world</p>
			</header>
		</div>
	</ThemeProvider></JssProvider>);
};