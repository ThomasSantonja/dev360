import { hot } from "react-hot-loader/root";
import React, { Component } from "react";
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';


export default class App extends Component {
    render() {
      return (
        <div>
            <h1>
                Your Electron App
          </h1>
        </div>
      );
    }
  }
  

// export default hot((): JSX.Element =>
//     (
//         <div>
//             <h1>
//                 Your Electron App
//           </h1>
//         </div>
//     ));