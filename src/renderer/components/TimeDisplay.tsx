import { makeStyles, Card, CardContent, Grid, Typography, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem, IconButton, Menu } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { MoreVert } from '@material-ui/icons';
import humanizeDuration from "humanize-duration";
import { LineChart, Line, Tooltip as ChartTooltip } from "recharts";
import { TimeTypes, JiraIncidentRootObject } from "../redux/viewModels/incidentsViewModel";
import { COLORS_PASTEL } from "../consts";
import { TimeSpan } from "../../main/utils/timespan";
import { NameValuePair } from "src/main/utils/nvp-array";

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
    customTooltip: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(0.5),
        fontSize: 9
    }
}));

function LineTooltip(props: Readonly<any>) {
    const { active, label, payload, ...rest } = props;
    const classes = useStyles();

    if (active && payload) {

        return (
            <div className={classes.customTooltip}>
                <div>{`${payload[0].payload.name} : ${humanizeDuration(payload[0].payload.value, { largest: 2, maxDecimalPoints: 1 })}`}</div>
            </div>
        );
    }

    return null;
};

const timeExplanation = [
    { fieldType: TimeTypes.Detection, fieldUnitName: "timeToDetection", fieldName: "totalDetection", title: "Time to detection", explanation: "The time it take from the incident introduction to its detection" },
    { fieldType: TimeTypes.Fix, fieldUnitName: "timeToFix", fieldName: "totalFix", title: "Time to fix", explanation: "The time it take from the incident detection to its resolution (the cost of fixing it)" },
    { fieldType: TimeTypes.Resolution, fieldUnitName: "timeToResolution", fieldName: "totalResolution", title: "Time to resolution", explanation: "The time it take from the incident introduction to its resolution (also the length of impact of the incident)" },
    { fieldType: TimeTypes.Closure, fieldUnitName: "timeToClosure", fieldName: "totalClosure", title: "Time to closure", explanation: "The time it take from the report creation to its closure" }
];

function compare(a: NameValuePair, b: NameValuePair) {
    // Use toUpperCase() to ignore character casing
    const dateA = a.name.toUpperCase();
    const dateB = b.name.toUpperCase();
  
    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }
  

export default function TimeDisplay(props: Readonly<{
    className: string,
    payload: JiraIncidentRootObject,
    payloadFiltered?: JiraIncidentRootObject,
    average?: boolean,
    selectedType: string
}>) {
    const { className, payload, payloadFiltered, average, selectedType, ...rest } = props;

    const classes = useStyles();
    const [index, setIndex] = React.useState(0);

    const calculateTimeValues = (): Array<{ name: string, value: number }> => {
        //calculating the time for this chart
        if (!payload) {
            return new Array();
        }
        var data = new Array<{ key: string, value: number[] }>();

        var issuesWithValues = payload.issues.filter((val) => {
            if (!val) {
                return false;
            }
            var value = (val.fields as any)[timeExplanation[index].fieldUnitName];
            if (!value) { return false; }
            return true;
        })

        issuesWithValues.map((val, idx) => {
            var actualDate = val.fields.customfield_14871 ?? val.fields.created;
            var dateAsKey = (new Date(actualDate).getFullYear()) + "-" + (new Date(actualDate).getMonth() + 1);
            var valArray = data.find(el => el.key === dateAsKey)?.value ?? [];
            if (valArray.length == 0) { data.push({ key: dateAsKey, value: valArray }); }
            valArray.push(Math.abs((val.fields as any)[timeExplanation[index].fieldUnitName].totalMilliSeconds));
        });

        var calculatedData = new Array<{ name: string, value: number }>();
        data.map((val) => {
            if (average) {
                calculatedData.push({ name: val.key, value: val.value.reduce((a, b) => a + b, 0) / val.value.length });
            } else {
                calculatedData.push({ name: val.key, value: val.value.reduce((a, b) => a + b, 0) });
            }
        });
        calculatedData.sort(compare);
        return calculatedData;
    }

    const [chartTimes, setChartTimes] = React.useState(calculateTimeValues());
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (index: number) => {
        setAnchorEl(null);
        if (index >= 0 && index < timeExplanation.length && payload) {
            setIndex(index);
            setChartTimes(calculateTimeValues());
        }
    };

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.cardRoot}>
                <div className={classes.root}>
                    <div className={classes.data}>
                        <Tooltip title={timeExplanation[index].explanation}>
                            <Typography className={classes.title}
                                gutterBottom>{selectedType} of {timeExplanation[index].title}</Typography>
                        </Tooltip>
                        <Typography variant="h5">{
                            humanizeDuration(payload
                                ? (average
                                    ? (payload as any)[timeExplanation[index].fieldName].totalMilliSeconds / payload.issues.length
                                    : (payload as any)[timeExplanation[index].fieldName].totalMilliSeconds
                                )
                                : 0, { largest: 2, maxDecimalPoints: 1 })
                        }
                        </Typography>
                    </div>
                    <LineChart
                        data={chartTimes}
                        className={classes.miniChart}
                        width={100} height={60}>
                        <ChartTooltip content={<LineTooltip />} />
                        <Line dot={false}
                            dataKey="value"
                            strokeWidth={4}
                            fill={COLORS_PASTEL[7]} />
                    </LineChart>
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
