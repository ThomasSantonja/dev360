import React, { Dispatch } from "react";
import { makeStyles, createStyles, Grid, Paper, Theme, Typography, Card, Chip, Avatar } from "@material-ui/core";
import { State } from "../redux/store";
import { connect } from "react-redux";
import { ElectronRequest } from "../../main/models/app-api-payload";
import { RefreshStrategy } from "../../main/main-api";
import { JiraApi } from "../../main/jira/jira-api";
import { FetchData, IncidentsState } from "../redux/viewModels/incidentsViewModel";
import DataTable from "../components/JiraIncidentsTable";
import TotalFilterNumbers from "../components/TotalFilterNumbers";
import TimeDisplay from "../components/TimeDisplay";
import { LineChart, Line, PieChart, Tooltip as ChartTooltip, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';
import CoolPieChart from "../components/CoolPieChart";
import { COLORS_PASTEL } from "../consts";
import StandardPieChart from "../components/StandardPieChart";
import { NameValuePair } from "src/main/utils/nvp-array";
import ChartLegend from "../components/chartLegend";

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
        fullWidth: {
            width: "100%"
        },
        title: {
            fontWeight: 700,
            margin: theme.spacing(2)
        }
    }),
);

export function IncidentsView(props: Readonly<{ incidents: IncidentsState, getData: () => void, hasLoaded: boolean }>) {

    const classes = incidentStyles();
    const [loaded, setLoaded] = React.useState(false);
    console.log(`rendering incidents, dataset is:`, props.incidents);

    if (!loaded) {
        console.log(`data not loaded, trying to request it from local cache`);
        setLoaded(true);
        props.getData();
    }

    const teams = props.incidents?.payload?.teams?.ToArray();
    const rootCauses = props.incidents?.payload?.rootCauses?.ToArray();
    const statuses = props.incidents?.payload?.statuses?.ToArray();

    return (
        <div className={classes.root}>
            <Grid
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
                    <TotalFilterNumbers itemName="incidents" delta={props.incidents?.increasedPayload} total={props.incidents?.payload?.total} />
                </Grid>
                <Grid
                    item
                    lg={4}
                    sm={4}
                    xl={4}
                    xs={12}
                >
                    <TimeDisplay selectedType="Average" average timeTotal={props.incidents?.payload} />
                </Grid>
                <Grid
                    item
                    lg={4}
                    sm={4}
                    xl={4}
                    xs={12}
                >
                    <TimeDisplay selectedType="Sum" timeTotal={props.incidents?.payload} />
                </Grid>
                <Grid
                    item
                    lg={9}
                    md={12}
                    xl={9}
                    xs={12}
                >
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Timeline
                        </Typography>
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Teams
                        </Typography>
                        <ChartLegend data={teams}/>
                        <StandardPieChart
                            minHeight="300px"
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
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Root causes
                        </Typography>
                        <ChartLegend data={rootCauses}/>
                        <StandardPieChart
                            minHeight="300px"
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
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Services
                        </Typography>
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={6}
                    xl={3}
                    xs={12}
                >
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Severities
                        </Typography>
                    </Card>
                </Grid>
                <Grid
                    item
                    lg={3}
                    md={4}
                    xl={3}
                    xs={12}
                >
                    <Card>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">Statuses
                        </Typography>
                        <ChartLegend data={statuses}/>
                        <StandardPieChart
                            minHeight="300px"
                            data={statuses} />
                    </Card>
                </Grid>
                <Grid item className={classes.fullWidth}>
                    <DataTable data={props.incidents?.payload?.issues} />
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