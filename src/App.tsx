import
    React, {
    useState }            from 'react';
import logo from './logo.svg';
import './App.css';
import Element from './Element';
import Indicator from './Indicator';
import Control from './Control';
import Content from './Content';
import Button from './Button';
import Icon from './Icon';
import ButtonIcon from './ButtonIcon';
import Container from './Container';
import ListGroup from './ListGroup';
import ListGroupItem from './ListGroupItem';

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
	const [enableGrad, setEnableGrad ] = useState(false);
	const [enabled,    setEnabled    ] = useState(true);
	const [active, 	   setActive     ] = useState(false);
	const [focus, 	   setFocus      ] = useState(false);
	const [size, 	   setSize       ] = useState<'sm'|'lg'|undefined>(undefined);
	const [theme, 	   setTheme      ] = useState<'primary'|'secondary'|'success'|'info'|'warning'|'danger'|'light'|'dark'|undefined>('primary');
	const [btnStyle,   setBtnStyle   ] = useState<'outline'|'link'|'outlineLink'|undefined>(undefined);


	const handleChangeEnableGrad = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnableGrad(e.target.checked);
	}
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
			<Container className="App-header">
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
				<Element theme={theme} enableGradient={enableGrad} size={size}></Element>
				<Indicator theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active}></Indicator>
				<Control theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active} focus={focus}></Control>
				<Content theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum aliquam aperiam magni sint eum!
				</Content>
				<Button  theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active} focus={focus} text='Hello Button' btnStyle={btnStyle}></Button>
				<Icon icon="face" theme={theme} size={size}/>
				<Icon icon="instagram" theme={theme} size={size} aria-hidden={false} />
				<ButtonIcon icon="whatsapp" theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active} focus={focus} text='Hello Button Icon' btnStyle={btnStyle}>
					<span>hey</span>
				</ButtonIcon>
				<ButtonIcon icon="whatsapp" theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active} focus={focus} btnStyle={btnStyle}>
					<span>hey</span>
				</ButtonIcon>
				<ButtonIcon icon="instagram" theme={theme} enableGradient={enableGrad} size={size} enabled={enabled} active={active} focus={focus} text='Hello Button Icon' btnStyle={btnStyle}>
				</ButtonIcon>
				<ListGroup theme={theme} enableGradient={enableGrad} size={size}>{[
					'An item',
					'A second item',
					<ListGroupItem key={2} enabled={enabled} active={active}>A third item</ListGroupItem>,
					'A fourth item',
					<Button key={123}  theme='none' size={size} enabled={enabled} active={active} focus={focus} text='Hello Button' btnStyle={btnStyle}></Button>,
					'A fifth item',
					<ListGroupItem key={99} enabled={enabled} active={active}>
						<Button  theme='none' size={size} enabled={enabled} active={active} focus={focus} text='Hello Button' btnStyle={btnStyle}></Button>
					</ListGroupItem>,
					'A sixth item',
					<ListGroupItem key={55} enabled={enabled} active={active}>A seventh item</ListGroupItem>,
					'A eighth item',
				]}
				</ListGroup>
				<ListGroup theme={theme} enableGradient={enableGrad} size={size}>
					An item
				</ListGroup>
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
			</Container>
		</div>
	</ThemeProvider></JssProvider>);
};