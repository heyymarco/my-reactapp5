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
