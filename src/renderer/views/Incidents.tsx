import React, { Dispatch } from "react";
import { makeStyles, createStyles, Grid, Paper, Theme, Typography, Card, Chip, Avatar } from "@material-ui/core";
import { State } from "../redux/store";
import { connect } from "react-redux";
import { ElectronRequest } from "../../main/models/app-api-payload";
import { RefreshStrategy } from "../../main/main-api";
import { JiraApi } from "../../main/jira/jira-api";
import { FetchData, IncidentsState } from "../redux/viewModels/incidentsViewModel";
import TotalFilterNumbers from "../components/TotalFilterNumbers";
import TimeDisplay from "../components/TimeDisplay";
import { LineChart, Line, PieChart, Tooltip as ChartTooltip, Pie, Legend, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from 'recharts';
import StandardPieChart from "../components/StandardPieChart";
import ChartLegend from "../components/ChartLegend";
import VerticalBarChart from "../components/VerticalBarChart";
import ChartTimeline from "../components/ChartTimeline";
import StatefulJiraIncidentsTable from "../components/JiraIncidentsTable";
import clsx from 'clsx';

const incidentStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        chartCardsContainer: {
            alignItems: "stretch"
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        fullWidth: {
            width: "100%"
        },
        title: {
            fontWeight: 700,
            margin: theme.spacing(2)
        },
        gridItemFirstRow: {
        },
        gridItemSecondRow: {
            minHeight: "430px",
            maxHeight: "430px",
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flexStart"
        },
        gridItemThirdRow: {
            minHeight: "480px",
            maxHeight: "480px",
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flexStart"
        },
        gridSubItemCenter: {
            marginTop: "auto",
            marginBottom: "auto"
        }
    }),
);

const chartMinHeight = "280px";

export function IncidentsView(props: Readonly<{ incidents: IncidentsState, getData: () => void, hasLoaded: boolean }>) {

    const classes = incidentStyles();
    const [loaded, setLoaded] = React.useState(false);

    if (!loaded) {
        console.log(`data not loaded, trying to request it from local cache`);
        setLoaded(true);
        props.getData();
    }

    const teams = props.incidents?.payload?.teams?.ToArray();
    const rootCauses = props.incidents?.payload?.rootCauses?.ToArray();
    const statuses = props.incidents?.payload?.statuses?.ToArray();
    const services = props.incidents?.payload?.services?.ToArray();
    const severities = props.incidents?.payload?.severities?.ToArray();
    const timeline = props.incidents?.payload?.timeline?.ToBasicJs();

    return (
        <div className={classes.root}>
            <Grid
                className={classes.chartCardsContainer}
                container
                spacing={4}
            >
                <Grid
                    item
                    lg={4}
                    sm={4}
                    xl={4}
                    xs={12}
                >
                    <TotalFilterNumbers
                        className={classes.gridItemFirstRow}
                        itemName="incidents"
                        delta={props.incidents?.payload?.lastWeek}
                        total={props.incidents?.payload?.total} />
                </Grid>
                <Grid
                    item
                    lg={4}
                    sm={4}
                    xl={4}
                    xs={12}
                >
                    <TimeDisplay
                        className={classes.gridItemFirstRow}
                        selectedType="Average"
                        average payload={props.incidents?.payload} />
                </Grid>
                <Grid
                    item
                    lg={4}
                    sm={4}
                    xl={4}
                    xs={12}
                >
                    <TimeDisplay
                        className={classes.gridItemFirstRow}
                        selectedType="Sum"
                        payload={props.incidents?.payload}  />
                </Grid>
                <Grid
                    item
                    lg={9}
                    md={12}
                    xl={9}
                    xs={12}
                >
                    <Card className={classes.gridItemSecondRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Timeline
                        </Typography>
                        <ChartTimeline className={classes.gridSubItemCenter} data={timeline} series={props.incidents?.payload?.timeline?.series} minHeight={280} />
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card className={classes.gridItemSecondRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Teams
                        </Typography>
                        <ChartLegend data={teams} />
                        <StandardPieChart
                            minHeight={chartMinHeight}
                            className={classes.gridSubItemCenter}
                            data={teams} />
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card className={classes.gridItemThirdRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Root causes
                        </Typography>
                        <ChartLegend data={rootCauses} />
                        <StandardPieChart
                            className={classes.gridSubItemCenter}
                            minHeight={"266px"}
                            data={rootCauses} />
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card className={classes.gridItemThirdRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Services
                        </Typography>
                        <StandardPieChart
                            className={classes.gridSubItemCenter}
                            minHeight={chartMinHeight}
                            data={services} />
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card className={classes.gridItemThirdRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Severities
                        </Typography>
                        <VerticalBarChart className={clsx([classes.gridSubItemCenter, classes.title])} data={severities} minHeight={280} />
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={4}
                    xl={3}
                    xs={12}
                >
                    <Card className={classes.gridItemThirdRow}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Statuses
                        </Typography>
                        <VerticalBarChart className={clsx([classes.gridSubItemCenter, classes.title])} data={statuses} minHeight={280} />
                    </Card>
                </Grid>
                <Grid item className={classes.fullWidth}>
                    <StatefulJiraIncidentsTable data={props.incidents?.payload?.issues} />
                </Grid>
            </Grid>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        getData: () => {
            dispatch(FetchData({
                contract: JiraApi.INCIDENTS,
                provider: JiraApi.JIRA_PROVIDER,
                parameters: RefreshStrategy.only_local
            } as ElectronRequest));
        }
    }
}

const mapStateToProps = (state: State) => (
    {
        incidents: state.UpdateIncidentsState,
        hasLoaded: state.UpdateIncidentsState.hasFetched
    });

const StatefulIncidentsView = connect(mapStateToProps, mapDispatchToProps)(IncidentsView);
export default StatefulIncidentsView;