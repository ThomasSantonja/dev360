import React from "react";
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, makeStyles, Theme, createStyles, AppBar } from "@material-ui/core";
import DashboardIcon from "./icons/DashboardIcon";
import IncidentsIcon from "./icons/IncidentsIcon";
import BugsIcon from "./icons/BugsIcon";
import ProductivityIcon from "./icons/ProductivityIcon";
import RoadmapIcon from "./icons/RoadmapIcon";
import SlidersIcon from "./icons/SlidersIcon";
import SettingsIcon from "./icons/SettingsIcon";
import DownloadIcon from "./icons/DownloadIcon";
import { CustomTheme } from "../theme/CustomTheme";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import RefreshIcon from '@material-ui/icons/Refresh';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { RouteLogic } from "../App";
import { ClientRequestHandler } from "../data/clientRequestHandler";
import { ElectronResponse } from "src/main/models/app-api-payload";

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

export default function Navigation(props: Readonly<{ route: any }>) {
    const classes = localAppBarStyles();
    const [open, setOpen] = React.useState(false);

    console.log(`navigation refresh props: ${props}`);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const receiveRawData = (response: ElectronResponse) => {

    }

    const handleRefresh = () => {
        ClientRequestHandler.sendAsyncMessage(this.dataRequest, receiveRawData);
    };

    return (
        <div>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarSmall]: open,
                    [classes.appBarBig]: !open,
                })}>
                <Toolbar>
                    <IconButton color="inherit"
                        aria-label="drawer handler"
                        onClick={handleDrawer}
                        edge="start"
                        className={classes.menuButton}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.route}
                    </Typography>
                    <IconButton color="inherit"
                        edge="end"
                        className={classes.menuButtonEnd}
                        onClick={handleRefresh}>
                        <RefreshIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ className: classes.menuTypo }}>Dashboards</ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <Link to='/incidents' className={classes.link}>
                        <ListItem button key='Incidents'>
                            <ListItemIcon><IncidentsIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Incidents' />
                        </ListItem>
                    </Link>
                    <Link to='/Bugs' className={classes.link}>
                        <ListItem button key='Bugs'>
                            <ListItemIcon><BugsIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Bugs' />
                        </ListItem>
                    </Link>
                    <Link to='/Productivity' className={classes.link}>
                        <ListItem button key='Productivity'>
                            <ListItemIcon><ProductivityIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Productivity' />
                        </ListItem>
                    </Link>
                    <Link to='/Roadmap' className={classes.link}>
                        <ListItem button key='Roadmap'>
                            <ListItemIcon><RoadmapIcon /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Roadmap' />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <SlidersIcon />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button key='Preferences'>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Preferences' />
                    </ListItem>
                    <ListItem button key='Export'>
                        <ListItemIcon><DownloadIcon /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ className: classes.menuTypo }} primary='Export' />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
