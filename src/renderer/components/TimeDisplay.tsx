import { makeStyles, Card, CardContent, Grid, Typography, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem, IconButton, Menu } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { MoreVert } from '@material-ui/icons';
import humanizeDuration from "humanize-duration";

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
        "&:last-child": {
            paddingBottom: 0
        }
    }
}));

const timeExplanation = [
    { fieldName: "totalDetection", title: "Time to detection", explanation: "The time it take from the incident introduction to its detection" },
    { fieldName: "totalFix", title: "Time to fix", explanation: "The time it take from the incident detection to its resolution (the cost of fixing it)" },
    { fieldName: "totalResolution", title: "Time to resolution", explanation: "The time it take from the incident introduction to its resolution (also the length of impact of the incident)" },
    { fieldName: "totalClosure", title: "Time to closure", explanation: "The time it take from the report creation to its closure" }
];

export default function TimeDisplay(props: Readonly<any>) {
    const { className, timeTotal, timeFiltered, average, selectedType, ...rest } = props;

    const classes = useStyles();
    const [index, setIndex] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (index: number) => {
        setAnchorEl(null);
        if (index >= 0 && index < timeExplanation.length && timeTotal) {
            setIndex(index);         
        }
    };

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.cardRoot}>
                <div className={classes.root}>
                    <div className={classes.data}>
                        <Tooltip title={timeExplanation[index].explanation}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">{selectedType} of {timeExplanation[index].title}</Typography>
                        </Tooltip>
                        <Typography variant="h4">{
                            humanizeDuration(timeTotal
                                ? (average
                                    ? timeTotal[timeExplanation[index].fieldName].totalMilliSeconds / timeTotal.issues.length
                                    : timeTotal[timeExplanation[index].fieldName].totalMilliSeconds
                                )
                                : 0, { largest: 2, maxDecimalPoints: 1 })
                        }
                        </Typography>
                    </div>
                    <IconButton className={classes.button} aria-haspopup="true" onClick={handleClick}>
                        <MoreVert className={classes.buttonIcon} />
                    </IconButton>
                    <Menu
                        id="timeoptionsMenu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem key={0} onClick={() => handleClose(0)}>Time to detection</MenuItem>
                        <MenuItem key={1} onClick={() => handleClose(1)}>Time to fix</MenuItem>
                        <MenuItem key={2} onClick={() => handleClose(2)}>Time to resolution</MenuItem>
                        <MenuItem key={3} onClick={() => handleClose(3)}>Time to closure</MenuItem>
                    </Menu>
                </div>
            </CardContent>
        </Card>
    );
};
