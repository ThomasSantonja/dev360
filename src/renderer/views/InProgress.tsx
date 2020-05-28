import React, { Dispatch, Props } from "react";
import { Typography, Container, makeStyles, createStyles, Theme, Grid, Paper } from "@material-ui/core";
import InProgress from "../components/icons/InProgress";

const inProgressStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            // flexDirection: "column",
            // alignItems: "center"
        },
        icon: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: theme.spacing(10),
            width: theme.spacing(10)
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);


export default function InProgressView(props: Readonly<any>) {
    const classes = inProgressStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3} alignItems="stretch">
                <Grid item xs>
                    <Paper className={classes.paper}>
                        <Container className={classes.root} maxWidth="sm">
                            <InProgress />
                            <Typography paragraph>
                                Work in progress
                            </Typography>
                        </Container></Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>xs=6</Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
            </Grid>
        </div>

    );
}
