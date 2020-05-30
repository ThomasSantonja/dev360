import { IconButton, makeStyles, Theme, createStyles, Menu, MenuItem, Checkbox, ListItemText, ThemeProvider, withStyles } from "@material-ui/core";
import React, { Dispatch } from "react";
import FilterIcon from "./icons/FilterIcon";
import { NameValuePair } from "../../main/utils/nvp-array";
import { connect } from "react-redux";
import { State } from "../redux/store";
import { IncidentsFilters, UpdateFilters, IncidentFilterTypesStrings } from "../redux/viewModels/incidentsViewModel";

const menuStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: "auto",
            marginBottom: "auto",
            marginTop: "auto",
            marginRight: theme.spacing(1)
        },
        buttonIcon: {
            width: theme.spacing(2),
            height: theme.spacing(2),
            color: theme.palette.text.secondary
        },
        filterButton: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        menuList: {
            paddingTop: 0,
            paddingBottom: 0
        },
        menuItem: {
            padding: theme.spacing(0.25)
        },
        menuCb: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            color: theme.palette.primary.light,
            '&$checked': {
                color: theme.palette.primary.dark,
            },
        },
        menuItemText: {
            fontSize: "0.875rem",
            marginRight: theme.spacing(2)
        }
    }),
);

export function FilterMenu(props: Readonly<{
    className?: string,
    data: Array<NameValuePair>,
    filterName: IncidentFilterTypesStrings,
    currentFilter: IncidentsFilters,
    updateFilter: (key: Array<string>, name: string) => void
}>) {
    const { className, data, currentFilter, filterName, ...rest } = props;
    const classes = menuStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: any) => {
        setAnchorEl(null);
    };

    const selectOne = (event: any) => {
        var selectedValue = event.currentTarget.innerText as string;
        props.updateFilter([selectedValue], filterName);
    }

    const multiSelect = (event: any, key: string) => {
        event.stopPropagation();
        var filters = (currentFilter as any)[filterName] as Array<string>;
        var idx = filters.indexOf(key);
        if (idx !== -1) {
            filters.splice(idx, 1);
        } else {
            filters.push(key)
        }        
        props.updateFilter(filters, filterName);
    }

    return (
        <div className={classes.root}>
            <IconButton className={classes.filterButton} onClick={handleClick}>
                <FilterIcon className={classes.buttonIcon} />
            </IconButton>
            <Menu id={`menuFilter-${filterName}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menuList}>
                {data?.map((value) => (
                    <MenuItem
                        key={`menukey-${value.name}`}
                        value={value.name}
                        className={classes.menuItem}
                        onClick={selectOne}>
                        <Checkbox
                            size="small"
                            checked={currentFilter.noFilters || ((currentFilter as any)[filterName]).includes(value.name)}
                            onClick={(ev) => multiSelect(ev, value.name)} />
                        <ListItemText
                            primary={value.name}
                            primaryTypographyProps={{ className: classes.menuItemText }} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        updateFilter: (key: string[], name: IncidentFilterTypesStrings) => {
            console.log(`updating the filter with:`, key);
            dispatch(UpdateFilters(key, name));
        }
    }
}

const mapStateToProps = (state: State) => (
    {
        currentFilter: state.UpdateIncidentsState.filters
    });

const StatefulFilterMenu = connect(mapStateToProps, mapDispatchToProps)(FilterMenu);
export default StatefulFilterMenu;