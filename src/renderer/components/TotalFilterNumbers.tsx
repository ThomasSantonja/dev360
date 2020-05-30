import { makeStyles, Card, CardContent, Grid, Typography, Tooltip, Chip, IconButton, Badge } from "@material-ui/core";
import React, { Dispatch } from "react";
import clsx from 'clsx';
import { COLORS_PASTEL } from "../consts";
import FilterIconReset from "./icons/FilterIconReset";
import { connect } from "react-redux";
import { ResetFilters } from "../redux/viewModels/incidentsViewModel";
import { State } from "../redux/store";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    data: {
        margin: theme.spacing(1),
        minWidth: theme.spacing(5),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    content: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
    },
    miniChart: {
        margin: theme.spacing(1),
        marginLeft: "auto",
        alignSelf: "center"
    },
    button: {
        marginLeft: "auto",
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    buttonIcon: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
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
    customTooltip: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(0.5),
        fontSize: 9
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
        backgroundColor: COLORS_PASTEL[9]
    },
    differencePositive: {
        backgroundColor: COLORS_PASTEL[5]
    }
}));


export function TotalFilterNumbers(props: Readonly<any>) {
    const { className, itemName, delta, total, filters, filteredTotal, ...rest } = props;

    const classes = useStyles();

    const handleClick = () => {
        props.resetFilters();
    }

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.cardRoot}>

                <div className={classes.root}>
                    <div className={classes.data}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            variant="body2"
                            gutterBottom>
                            {filteredTotal && filteredTotal !== total
                                ? "Filtered / Total "
                                : "Total "}
                            {itemName}
                        </Typography>
                        <div className={classes.content}>
                            <Typography variant="h5">
                                {filteredTotal && filteredTotal !== total
                                    ? (filteredTotal + " / " + total)
                                    : total}
                            </Typography>
                            {filteredTotal && filteredTotal !== total
                                ?
                                (<Chip label={`${((filteredTotal / total) * 100).toFixed(2)}%`} className={classes.differenceValue} />)
                                :
                                (<Tooltip title="Since last week">
                                    <Chip
                                        label={delta + " new incidents"}
                                        className={clsx(classes.differenceValue, {
                                            [classes.differenceNegative]: delta > 0,
                                            [classes.differencePositive]: delta < 0
                                        })} />
                                </Tooltip>)
                            }
                        </div>
                    </div>
                    <Tooltip title="Reset the filters">
                        <IconButton className={classes.button} onClick={handleClick} disabled={filters?.noFilters}>
                            <FilterIconReset className={classes.buttonIcon} />
                        </IconButton>
                    </Tooltip>
                </div>
            </CardContent>
        </Card>
    );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        resetFilters: () => {
            dispatch(ResetFilters());
        }
    }
}

const mapStateToProps = (state: State) => ({});

const StatefulTotalFilterNumber = connect(mapStateToProps, mapDispatchToProps)(TotalFilterNumbers);
export default StatefulTotalFilterNumber;