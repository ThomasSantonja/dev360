import { makeStyles, Card, CardContent, Grid, Typography, Tooltip, Chip } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import IncidentsIcon from "./icons/IncidentsIcon";
import { COLORS_PASTEL } from "../consts";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    incidentInfo: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    data: {
        margin: theme.spacing(1),
        minWidth: theme.spacing(5),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    button: {
        marginLeft: "auto",
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    buttonIcon: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    title: {
        fontWeight: 700
    },
    cardRoot: {
        width: "100%",
        padding: theme.spacing(1),
        "&:last-child": {
            paddingBottom: theme.spacing(1)
        }
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        backgroundColor: COLORS_PASTEL[0]
    },
    differenceNegative: {
        backgroundColor:  COLORS_PASTEL[9]
    },
    differencePositive: {
        backgroundColor:  COLORS_PASTEL[5]
    }
}));


export default function TotalFilterNumbers(props: Readonly<any>) {
    const { className, itemName, delta, total, ...rest } = props;

    const classes = useStyles();

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.cardRoot}>
                <div className={classes.data}>
                    <Typography className={classes.title} 
                        gutterBottom>
                        Total {itemName}
                    </Typography>
                    <div className={classes.incidentInfo}>
                        <Typography variant="h5">{total}</Typography>
                        <Tooltip title="Since last week">
                            <Chip
                                label={delta + " new incidents"}
                                className={clsx(classes.differenceValue, {
                                    [classes.differenceNegative]: delta > 0,
                                    [classes.differencePositive]: delta < 0
                                })} />
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};