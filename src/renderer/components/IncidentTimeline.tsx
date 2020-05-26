import { makeStyles, Card, CardContent, Grid, Typography, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem, IconButton, Menu, withStyles, createStyles, Theme } from "@material-ui/core";
import React from "react";
import clsx from 'clsx';
import { MoreVert } from '@material-ui/icons';
import { JiraModels } from "../../main/models/jira-models";
import RemoveIcon from '@material-ui/icons/Remove';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import UpdateIcon from '@material-ui/icons/Update';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import { TimeSpan } from "../../main/utils/timespan";
import humanizeDuration from "humanize-duration";
import dateFormat from "dateformat";
import HtmlTooltip from "./HtmlTooltip";
import { COLORS_PASTEL } from "../consts";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center"
    }
}));

const ValidEntry = withStyles((theme: Theme) =>
    createStyles({
        root: {
            color: COLORS_PASTEL[4]
        },
    }),
)(CheckCircleOutlineIcon);

const EmptyEntry = withStyles((theme: Theme) =>
    createStyles({
        root: {
            color: COLORS_PASTEL[9]
        },
    }),
)(HighlightOffIcon);

const ValidDuration = withStyles((theme: Theme) =>
    createStyles({
        root: {
            color: COLORS_PASTEL[4]
        },
    }),
)(PlayCircleOutlineIcon);

const EmptyDuration = withStyles((theme: Theme) =>
    createStyles({
        root: {
            color: COLORS_PASTEL[9]
        },
    }),
)(PauseCircleOutlineIcon);

export default function IncidentsTimeline(props: Readonly<{ className?: string, incident: JiraModels.Issue }>) {
    const { className, incident, ...rest } = props;

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            {incident?.fields?.customfield_14971
                ? (<HtmlTooltip title={"introduction date: " + dateFormat(incident.fields.customfield_14871, "yyyy-mm-dd HH:MM:ss")}>
                    <ValidEntry />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Introduction date undefined"}>
                    <EmptyEntry />
                </HtmlTooltip>)
            }
            {incident?.fields?.timeToDetection
                ? (<HtmlTooltip title={
                    <React.Fragment>
                        <div>Time to detect the incident: {humanizeDuration(incident.fields.timeToDetection.totalMilliSeconds, { largest: 2, maxDecimalPoints: 1 })}</div>
                        {"To be exact " + incident.fields.timeToDetection.toString()}
                    </React.Fragment>
                }>
                    <ValidDuration />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Missing information to calculate duration"}>
                    <EmptyDuration />
                </HtmlTooltip>)
            }

            {incident?.fields?.customfield_14976
                ? (<HtmlTooltip title={"Detection date: " + dateFormat(incident.fields.customfield_14976, "yyyy-mm-dd HH:MM:ss")}>
                    <ValidEntry />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Detection date undefined"}>
                    <EmptyEntry />
                </HtmlTooltip>)
            }
            {incident?.fields?.timeToFix
                ? (<HtmlTooltip title={
                    <React.Fragment>
                        <div>Time to fix the incident: {humanizeDuration(incident.fields.timeToFix.totalMilliSeconds, { largest: 2, maxDecimalPoints: 1 })}</div>
                        {"To be exact " + incident.fields.timeToFix.toString()}
                    </React.Fragment>
                }>
                    <ValidDuration />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Missing information to calculate duration"}>
                    <EmptyDuration />
                </HtmlTooltip>)
            }

            {incident?.fields?.customfield_14977
                ? (<HtmlTooltip title={"Resolution date: " + dateFormat(incident.fields.customfield_14977, "yyyy-mm-dd HH:MM:ss")}>
                    <ValidEntry />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Resolution date undefined"}>
                    <EmptyEntry />
                </HtmlTooltip>)
            }
            {incident?.fields?.timeToResolution
                ? (<HtmlTooltip title={
                    <React.Fragment>
                        <div>Total time to resolve the incident: {humanizeDuration(incident.fields.timeToResolution.totalMilliSeconds, { largest: 2, maxDecimalPoints: 1 })}</div>
                        {"To be exact " + incident.fields.timeToResolution.toString()}
                    </React.Fragment>
                }>
                    <ValidDuration />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Missing information to calculate duration"}>
                    <EmptyDuration />
                </HtmlTooltip>)
            }

            <ArrowForwardIosIcon />

            {incident?.fields?.resolutiondate
                ? (<HtmlTooltip title={"Report closure date: " + dateFormat(incident.fields.resolutiondate, "yyyy-mm-dd HH:MM:ss")}>
                    <ValidEntry />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Report not closed yet"}>
                    <EmptyEntry />
                </HtmlTooltip>)
            }
            {incident?.fields?.timeToClosure
                ? (<HtmlTooltip title={
                    <React.Fragment>
                        <div>Total time to close the incident: {humanizeDuration(incident.fields.timeToClosure.totalMilliSeconds, { largest: 2, maxDecimalPoints: 1 })}</div>
                        {"To be exact " + incident.fields.timeToClosure.toString()}
                    </React.Fragment>
                }>
                    <ValidDuration />
                </HtmlTooltip>)
                : (<HtmlTooltip title={"Missing information to calculate duration"}>
                    <EmptyDuration />
                </HtmlTooltip>)
            }
        </div>
    );
};
