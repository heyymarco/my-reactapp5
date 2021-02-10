import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './Button';

import {ThemeProvider} from 'react-jss';
import colors from './colors';


// colors.red = '#ee0011';


const theme = {
  colors: {
    warning: colors.warning,
  }
}

export default class App extends React.Component {
	render() {
		return (
			<div className='App'><ThemeProvider theme={theme}>
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
					<Button></Button>
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
			</ThemeProvider></div>
		);
	}
}
// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//     </ThemeProvider>
//   );
// }

// export default App;
