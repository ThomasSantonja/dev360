import React, { Dispatch } from "react";
import { makeStyles, createStyles, Grid, Paper, Theme, Typography, Card, Chip, Avatar, IconButton, MenuItem } from "@material-ui/core";
import { State } from "../redux/store";
import { connect } from "react-redux";
import { ElectronRequest } from "../../main/models/app-api-payload";
import { RefreshStrategy } from "../../main/main-api";
import { JiraApi } from "../../main/jira/jira-api";
import { FetchData, IncidentsState, IncidentFilterTypes } from "../redux/viewModels/incidentsViewModel";
import TotalFilterNumbers from "../components/TotalFilterNumbers";
import TimeDisplay from "../components/TimeDisplay";
import FilterIcon from "../components/icons/FilterIcon";
import StandardPieChart from "../components/StandardPieChart";
import ChartLegend from "../components/ChartLegend";
import VerticalBarChart from "../components/VerticalBarChart";
import ChartTimeline from "../components/ChartTimeline";
import StatefulJiraIncidentsTable from "../components/JiraIncidentsTable";
import clsx from 'clsx';
import { Menu } from "electron";
import StatefulFilterMenu from "../components/FilterMenu";

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
        cardWithFilter: {
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "flexStart"
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
        },
        buttonIcon: {
            width: theme.spacing(2),
            height: theme.spacing(2),
            color: theme.palette.text.secondary
        },
        filterButton: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            marginLeft: "auto",
            marginBottom: "auto",
            marginTop: "auto",
            marginRight: theme.spacing(1)
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

    const assignees = props.incidents?.payload?.assignees?.ToArray();
    const teams = props.incidents?.payload?.teams?.ToArray();
    const rootCauses = props.incidents?.payload?.rootCauses?.ToArray();
    const statuses = props.incidents?.payload?.statuses?.ToArray();
    const services = props.incidents?.payload?.services?.ToArray();
    const severities = props.incidents?.payload?.severities?.ToArray();
    const timeline = props.incidents?.payload?.timeline?.ToBasicJs();

    const isFiltered = !(props.incidents?.filters?.noFilters ?? true);

    const filteredAssignees = props.incidents?.filteredPayload?.assignees?.ToArray();
    const filteredteams = props.incidents?.filteredPayload?.teams?.ToArray();
    const filteredrootCauses = props.incidents?.filteredPayload?.rootCauses?.ToArray();
    const filteredstatuses = props.incidents?.filteredPayload?.statuses?.ToArray();
    const filteredservices = props.incidents?.filteredPayload?.services?.ToArray();
    const filteredseverities = props.incidents?.filteredPayload?.severities?.ToArray();
    //next version, out of scope for MVP
    //const filteredtimeline = props.incidents?.filteredPayload?.timeline?.ToBasicJs();
    const testingTimeline = props.incidents?.payload?.timeline?.FilterWith(props.incidents?.filteredPayload?.timeline);
    const yearFilters = props.incidents?.payload?.timeline?.series.map(s => { return { name: s } });

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
                        total={props.incidents?.payload?.total}
                        filters={props.incidents?.filters}
                        filteredTotal={props.incidents?.filteredPayload?.total} />
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
                        average
                        payload={props.incidents?.payload}
                        payloadFiltered={props.incidents?.filteredPayload} />
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
                        payload={props.incidents?.payload}
                        payloadFiltered={props.incidents?.filteredPayload} />
                </Grid>
                <Grid
                    item
                    xs={3}
                >
                    <Card className={classes.gridItemSecondRow}>
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Assignee
                            </Typography>
                            <StatefulFilterMenu
                                data={assignees}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.assignees]} />
                        </div>
                        <StandardPieChart
                            minHeight={chartMinHeight}
                            className={classes.gridSubItemCenter}
                            data={isFiltered ? filteredAssignees : assignees} />
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={6}
                >
                    <Card className={classes.gridItemSecondRow}>
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Timeline
                            </Typography>
                            <StatefulFilterMenu
                                data={yearFilters}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.years]} />
                        </div>
                        <ChartTimeline
                            className={classes.gridSubItemCenter}
                            data={isFiltered ? testingTimeline : timeline}
                            isFiltered={isFiltered}
                            series={props.incidents?.payload?.timeline?.series} minHeight={280} />
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={3}
                >
                    <Card className={classes.gridItemSecondRow}>
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Teams
                            </Typography>
                            <StatefulFilterMenu
                                data={teams}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.teams]} />
                        </div>

                        <StandardPieChart
                            minHeight={chartMinHeight}
                            className={classes.gridSubItemCenter}
                            data={isFiltered ? filteredteams : teams} />
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
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Root causes
                            </Typography>
                            <StatefulFilterMenu
                                data={rootCauses}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.rootCauses]} />
                        </div>
                        <ChartLegend data={isFiltered ? filteredrootCauses : rootCauses} />
                        <StandardPieChart
                            className={classes.gridSubItemCenter}
                            minHeight={"266px"}
                            data={isFiltered ? filteredrootCauses : rootCauses} />
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
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Services
                            </Typography>
                            <StatefulFilterMenu
                                data={services}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.services]} />
                        </div>
                        <StandardPieChart
                            className={classes.gridSubItemCenter}
                            minHeight={chartMinHeight}
                            data={isFiltered ? filteredservices : services} />
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
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Severities
                            </Typography>
                            <StatefulFilterMenu
                                data={severities}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.severities]} />
                        </div>
                        <VerticalBarChart className={clsx([classes.gridSubItemCenter, classes.title])}
                            data={isFiltered ? filteredseverities : severities}
                            minHeight={280} />
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
                        <div className={classes.cardWithFilter}>
                            <Typography className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                variant="body2">Statuses
                        </Typography>
                            <StatefulFilterMenu
                                data={statuses}
                                filterName={IncidentFilterTypes[IncidentFilterTypes.statuses]} />
                        </div>
                        <VerticalBarChart className={clsx([classes.gridSubItemCenter, classes.title])}
                            data={isFiltered ? filteredstatuses : statuses}
                            minHeight={280} />
                    </Card>
                </Grid>
                <Grid item className={classes.fullWidth}>
                    <StatefulJiraIncidentsTable
                        data={isFiltered
                            ? props.incidents?.filteredPayload?.issues
                            : props.incidents?.payload?.issues} />
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