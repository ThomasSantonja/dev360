import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Theme, createStyles, withStyles, TablePagination, Tooltip, Typography, Avatar, Chip, Button, ButtonBaseActions } from "@material-ui/core";
import React, { Dispatch } from "react";
import { JiraModels } from "../../main/models/jira-models";
import IncidentsTimeline from "./IncidentTimeline";
import { LocalCache } from "../../main/storage/store";
import { FetchAvatar } from "../redux/viewModels/avatarsViewModel";
import { JiraApi } from "../../main/jira/jira-api";
import { ElectronRequest } from "../../main/models/app-api-payload";
import { State } from "../redux/store";
import { connect } from "react-redux";
import { shell } from "electron";

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "rgba(0,0,0,0.2)"
        },
        body: {
            fontSize: "0.875rem",
        }
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: "rgba(0,0,0,0.05)",
            },
        },
    }),
)(TableRow);

const incidentTableStyles = makeStyles((theme: Theme) =>
    createStyles({
        keyText: {
            fontSize: "0.875rem",
        },
        root: {
            width: "100%"
        },
        timeline: {
            minWidth: "300px"
        },
        smallAvatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: theme.spacing(1)
        },
        nameCell: {
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
            alignItems: "center"
        }
    }));

//   function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein };
//   }

//   const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
//   ];

export interface TableHeader<T> {
    displayName: string;
    accessor: (itm: T) => string;
}

//the idea is that the client should only request once any icon, if it failed, then so be it (optimisation)
//the whole concept, and management should move to the view model later, for now moving fast track on the MVP
const requestedKey: Array<string> = new Array<string>();

const NONE_VALUE = "None";

function JiraIncidentsTable(props: Readonly<{ data: Array<JiraModels.Issue>, avatarSrc: LocalCache, getAvatar: (key: string) => void }>) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const classes = incidentTableStyles();

    const { data, avatarSrc, ...rest } = props;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getAvatar = (key: string): string | undefined => {
        if (!key || key === "" || !avatarSrc) {
            return undefined;
        }
        if (!avatarSrc.Get(key)) {
            if (requestedKey.indexOf(key) !== -1) {
                //not requesting again
                return undefined;
            }
            //saving the fact we requested
            requestedKey.push(key);
            props.getAvatar(key);
        }
        else {
            return avatarSrc.Get(key);
        }
    }

    const incidentClick = (event: any) => {
        if (event?.currentTarget?.innerText) {
            shell.openExternal(`https://ssense.atlassian.net/browse/${event.currentTarget.innerText}`);
        }
    }

    return (
        <Paper className={classes.root}>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Key</StyledTableCell>
                            <StyledTableCell align="left">Status</StyledTableCell>
                            <StyledTableCell align="left">Project</StyledTableCell>
                            <StyledTableCell align="center">Severity</StyledTableCell>
                            <StyledTableCell align="left">Assignee</StyledTableCell>
                            <StyledTableCell align="left">Root Cause</StyledTableCell>
                            <StyledTableCell align="right">Services</StyledTableCell>
                            <StyledTableCell align="center" className={classes.timeline}>Timeline</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: JiraModels.Issue) => (
                                <StyledTableRow key={row.key}>
                                    <TableCell>
                                        <Tooltip title={row.fields?.summary}>
                                            <Button onClick={incidentClick}>
                                                {row.key}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="left">{row.fields?.status?.name ?? NONE_VALUE}</TableCell>
                                    <TableCell align="left">{row.fields?.project?.name ?? NONE_VALUE}
                                        {/* <Chip
                                            label={row.fields?.project?.name ?? NONE_VALUE}
                                            avatar={<Avatar src={getAvatar(row.fields?.project?.avatarUrls?.["24x24"])} />}
                                        /> */}
                                    </TableCell>
                                    <TableCell align="center">{row.fields?.customfield_10201?.value ?? NONE_VALUE}</TableCell>
                                    <TableCell align="left">
                                        <div className={classes.nameCell}>
                                            <Avatar className={classes.smallAvatar} alt={row.fields?.assignee?.displayName} src={getAvatar(row.fields?.assignee?.avatarUrls?.["24x24"])} />
                                            <div>{row.fields?.assignee?.displayName ?? NONE_VALUE}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="left">{row.fields?.customfield_14918?.value ?? NONE_VALUE}</TableCell>
                                    <TableCell align="right">{row.fields?.customfield_14971?.length ?? NONE_VALUE}</TableCell>
                                    <TableCell align="center" className={classes.timeline}><IncidentsTimeline incident={row} /></TableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.data?.length ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        getAvatar: (key: string) => {
            console.log(`jira table incident trying to get the avatar:`, key);
            dispatch(FetchAvatar({
                contract: JiraApi.GET_AVATAR,
                provider: JiraApi.JIRA_PROVIDER,
                parameters: key
            } as ElectronRequest));
        }
    }
}

const mapStateToProps = (state: State) => (
    {
        avatarSrc: state.UpdateAvatarsState.avatars
    });

const StatefulJiraIncidentsTable = connect(mapStateToProps, mapDispatchToProps)(JiraIncidentsTable);
export default StatefulJiraIncidentsTable;