import React, { Dispatch } from "react";
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, makeStyles, Theme, createStyles, AppBar, CircularProgress, Tooltip } from "@material-ui/core";
import DashboardIcon from "./icons/DashboardIcon";
import IncidentsIcon from "./icons/IncidentsIcon";
import BugsIcon from "./icons/BugsIcon";
import ProductivityIcon from "./icons/ProductivityIcon";
import RoadmapIcon from "./icons/RoadmapIcon";
import SettingsIcon from "./icons/SettingsIcon";
import DownloadIcon from "./icons/DownloadIcon";
import { CustomTheme } from "../theme/CustomTheme";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import RefreshIcon from '@material-ui/icons/Refresh';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ElectronRequest } from "../../main/models/app-api-payload";
import { State } from "../redux/store";
import { ToggleDrawerOpenStatus } from "../redux/viewModels/appViewModel";
import { connect } from "react-redux";
import { FetchData, IncidentsFilters } from "../redux/viewModels/incidentsViewModel";
import { RefreshStrategy } from "../../main/main-api";
import { JiraApi } from "../../main/jira/jira-api";

const theme = CustomTheme.Dark;
const drawerOpenWidth = 200;
const drawerClosedWidth = theme.spacing(8) + 2;

const localAppBarStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {

        },
        appBarSmall: {
            zIndex: theme.zIndex.drawer - 1,
            marginLeft: drawerOpenWidth,
            width: `calc(100% - ${drawerOpenWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarBig: {
            marginLeft: drawerClosedWidth,
            width: `calc(100% - ${drawerClosedWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuReload: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        menuButtonEnd: {
            marginLeft: "Auto",
        },
        menuTypo: {
            lineHeight: theme.spacing(4) + "px",
        },
        link: {
            color: theme.palette.text.primary,
            textDecoration: "none"
        },
        titleText: {
            marginLeft: theme.spacing(3),
        },
        titleImage: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        drawer: {
            width: drawerClosedWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerOpenWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: drawerClosedWidth,
            // [theme.breakpoints.up('sm')]: {
            //   width: theme.spacing(9) + 1,
            // },
        },
        drawerPaper: {
            backgroundColor: CustomTheme.DARK_DARK
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        }
    }),
);

export function Navigation(props: Readonly<{
    open?: boolean,
    route?: any,
    handleDrawerClick?: any,
    handleRefreshClick?: any,
    isLoading?: boolean,
    lastUpdate?: Date,
    filters?: IncidentsFilters
}>) {
    const classes = localAppBarStyles();

    return (
        <div>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarSmall]: props.open,
                    [classes.appBarBig]: !props.open,
                })}>
                <Toolbar>
                    <IconButton color="inherit"
                        aria-label="drawer handler"
                        onClick={() => props.handleDrawerClick(!props.open)}
                        edge="start"
                        className={classes.menuButton}>
                        {props.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.route}
                    </Typography>
                    {
                        props.isLoading
                            ?
                            <div className={classes.menuButtonEnd}>
                                <CircularProgress color="secondary" size={"2rem"} />
                            </div>
                            :
                            <Tooltip title={`last updated on : ${props.lastUpdate?.toLocaleString()}`}>
                                <IconButton color="inherit"
                                    edge="end"
                                    disabled={props.isLoading}
                                    className={classes.menuButtonEnd}
                                    onClick={() => props.handleRefreshClick(props.route, props.filters)}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: props.open,
                    [classes.drawerClose]: !props.open,
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: props.open,
                        [classes.drawerClose]: !props.open,
                    }),
                }}
            >
                {/* <List>
                    <ListItem>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ className: classes.menuTypo }}>Dashboards</ListItemText>
                    </ListItem>
                </List> 
                <Divider />*/}
                <List>
                    <Link to='/incidents' className={classes.link}>
                        <ListItem button key='Incidents'>
                            <ListItemIcon><IncidentsIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Incidents' />
                        </ListItem>
                    </Link>
                    <Link to='/Bugs' className={classes.link}>
                        <ListItem button key='Bugs' disabled>
                            <ListItemIcon><BugsIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Bugs' />
                        </ListItem>
                    </Link>
                    <Link to='/Productivity' className={classes.link}>
                        <ListItem button key='Productivity' disabled>
                            <ListItemIcon><ProductivityIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Productivity' />
                        </ListItem>
                    </Link>
                    <Link to='/Roadmap' className={classes.link}>
                        <ListItem button key='Roadmap' disabled>
                            <ListItemIcon><RoadmapIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Roadmap' />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                {/* <List>
                    <ListItem>
                        <ListItemIcon>
                            <SlidersIcon />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </ListItem>
                </List> */}
                <Divider />
                <List>
                    <Link to='/Preferences' className={classes.link}>
                        <ListItem button key='Preferences' disabled>
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Preferences' />
                        </ListItem>
                    </Link>
                    <Link to='/Export' className={classes.link}>
                        <ListItem button key='Export' disabled>
                            <ListItemIcon><DownloadIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Export' />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </div>
    );
}

const mapStateToProps = (state: State) => (
    {
        open: state.UpdateApplicationState.DrawerOpen,
        route: state.UpdateApplicationState.Route,
        //all of this will need to be turned into an abstract generic layer when moving to more than one page
        isLoading: state.UpdateIncidentsState.isFetching,
        lastUpdate: state.UpdateIncidentsState.lastUpdate,
        filters: state.UpdateIncidentsState.filters
    });



//we build the request based on the state


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        handleDrawerClick: (open: boolean) => {
            dispatch(ToggleDrawerOpenStatus(open));
        },
        handleRefreshClick: (route: string, filters: IncidentsFilters) => {
            let request: ElectronRequest = { parameters: RefreshStrategy.force_remote } as ElectronRequest;
            switch (route) {
                case "Incidents":
                    request.contract = JiraApi.INCIDENTS;
                    request.provider = JiraApi.JIRA_PROVIDER;
                    break;
                default:
                    console.warn(`Unknown route ${route}, no action taken`);
                    return;
            };

            dispatch(FetchData(request, !filters.noFilters));
        }
    }
}

const StatefulNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);
export default StatefulNavigation;