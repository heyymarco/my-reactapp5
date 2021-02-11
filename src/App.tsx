import React from 'react';
import logo from './logo.svg';
import './App.css';
import Element from './Element';

import {ThemeProvider} from 'react-jss';
import {JssProvider} from 'react-jss'
import colors from './colors';

import { 
	create as createJss,
	Jss }                     from 'jss';
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


const theme = {
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

const App = (props: any) => (
	<JssProvider jss={jss}><ThemeProvider theme={theme}>
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
				<Element>hello element!</Element>
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
	</ThemeProvider></JssProvider>
);
export default App;