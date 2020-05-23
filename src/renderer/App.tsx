import React, { useEffect, ReactElement, useState, Dispatch } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { CustomTheme } from './theme/CustomTheme';
import IncidentsView from './views/Incidents';
import { Switch, Route, MemoryRouter } from 'react-router-dom';
import InProgressView from './views/InProgress';
import { connect } from 'react-redux';
import { State } from './redux/store';
import StatefulNavigation from './components/Navigation';
import { ChangeRouteCommand, ChangeRoute } from "./redux/viewModels/appViewModel";

const theme = CustomTheme.Dark;

export class RouteLogic {
  static Name: string;
  static Svg: Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      backgroundColor: CustomTheme.DARK_DARKER,
      minHeight: '100vh'
    },
  }),
);

export function App(props: Readonly<{ route?: string, routeChangeHandler?: any }>) {
  const classes = useStyles();

  //const [currentRoute, setRoute] = useState<string>("Welcome");


  // function handleRouteChange(componentName: string, componentIcon: ReactElement) {
  //   console.log(`app event on route changed from ${componentName}`);
  //   //setRoute(componentName); <- Not allowed, since the execution is triggered from the child a ugly fix:
  //   //setTimeout(() => { setRoute(componentName); }, 0); <- this works because it swaps the execution context
  //   //setRoute.bind(this)(componentName); <- this does not work because I do not understand this in react yet
  //   useEffect(() => { setRoute(componentName); });
  // }

  //console.log(`app props parameter: ${props?.length}, ${props[0]}, ${props[1]}`);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter >
          <div className={classes.root}>
            <StatefulNavigation />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <Route exact path='/incidents' render={
                  () => {
                    props.routeChangeHandler("Incidents");
                    return (<IncidentsView />);
                  }
                } />
                <Route render={
                  () => {
                    props.routeChangeHandler("In Progress");
                    return (<InProgressView />);
                  }
                } />
              </Switch>
            </main>
          </div>
        </MemoryRouter>
      </ThemeProvider>
  );
}

const mapStateToProps = (state: State) => (
  {
    route: state.UpdateApplicationState.Route
  });

const mapDispatchToProps = (dispatch: Dispatch<ChangeRouteCommand>) => {
  return {
    routeChangeHandler: (newRoute: string) => {
      dispatch(ChangeRoute(newRoute));
    }
  }
}

const StatefulApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default StatefulApp;