import React, { Dispatch, Props } from "react";
import { Typography, Container, makeStyles, createStyles, Theme } from "@material-ui/core";
import InProgress from "../components/icons/InProgress";

const inProgressStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: "column",
            alignItems: "center"
        },
        icon: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: theme.spacing(10),
            width: theme.spacing(10)
        },
    }),
);


export default function InProgressView(props: Readonly<any>) {
    const classes = inProgressStyles();

    return (
        <Container className={classes.root} maxWidth="sm">
            <InProgress />
            <Typography paragraph>
                Work in progress
            </Typography>
        </Container>
    );
}
