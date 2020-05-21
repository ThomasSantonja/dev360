import React, { Component } from 'react';
import { createStyles, makeStyles, Theme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CssBaseline, SvgIcon, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, ThemeOptions } from '@material-ui/core';
import { CustomTheme } from './theme/CustomTheme';
import Navigation from './components/Navigation';
import InProgress from './views/InProgress';
import Incidents from './views/Incidents';
import { Switch, Route, MemoryRouter } from 'react-router-dom';

const theme = CustomTheme.Dark;

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

export default function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>
        <div className={classes.root}>
          <Navigation />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route exact path='/incidents' component={Incidents} />
              <Route component={InProgress} />
            </Switch>
          </main>
        </div>
      </MemoryRouter>
    </ThemeProvider>
  );
}
