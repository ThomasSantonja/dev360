import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Theme, createStyles, withStyles, TablePagination, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { JiraModels } from "src/main/models/jira-models";
import dateFormat from "dateformat";
import humanizeDuration from "humanize-duration";
import IncidentsTimeline from "./IncidentTimeline";

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
        timeline:{
            minWidth: "300px"
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

const NONE_VALUE = "None";

export default function JiraIncidentsTable(props: { data: Array<JiraModels.Issue> }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const classes = incidentTableStyles();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                                    <TableCell><Tooltip title={row.fields?.summary}><Typography className={classes.keyText}>{row.key}</Typography></Tooltip></TableCell>
                                    <TableCell align="left">{row.fields?.status?.name ?? NONE_VALUE}</TableCell>
                                    <TableCell align="left">{row.fields?.project?.name ?? NONE_VALUE}</TableCell>
                                    <TableCell align="center">{row.fields?.customfield_10201?.value ?? NONE_VALUE}</TableCell>
                                    <TableCell align="left">{row.fields?.assignee?.displayName ?? NONE_VALUE}</TableCell>
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