import React, { useEffect } from "react";
import { Typography, makeStyles, createStyles, Grid, Paper, Theme } from "@material-ui/core";

const incidentStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

export default function IncidentsView(props: Readonly<any>) {

    const classes = incidentStyles();

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={4}
            >
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    Total Nb Incidents
        </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    Not sure yet
        </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    Same
        </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    Same
        </Grid>
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={9}
                    xs={12}
                >
                    Timeline
        </Grid>
                <Grid
                    item
                    lg={4}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    Root Cause
        </Grid>
                <Grid
                    item
                    lg={4}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    Highest hit repositories
        </Grid>
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={9}
                    xs={12}
                >
                    Teams
        </Grid>
            </Grid>
        </div>
    );
}
