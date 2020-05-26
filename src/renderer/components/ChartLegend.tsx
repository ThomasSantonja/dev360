import { NameValuePair } from "src/main/utils/nvp-array";
import React from "react";
import { Chip, makeStyles, Theme, createStyles, Avatar } from "@material-ui/core";
import { COLORS_PASTEL } from "../consts";

const legendStyles = makeStyles((theme: Theme) =>
    createStyles({
        
        legend: {
            flexFlow: "row wrap",
            justifyContent: "center",
            margin: theme.spacing(1),
            display: "flex"
        },
        legendContent: {
            margin: theme.spacing(0.25)
        }
    }),
);

export default function ChartLegend(props: Readonly<{
    className?: string,
    data: Array<NameValuePair>
}>) {
    const { className, data, ...rest } = props;

    const classes = legendStyles();

    return (
        <div className={classes.legend}>
            {
                data?.map((value: NameValuePair, index: number) => {
                    return (<Chip
                        key={`legend-${index}`}
                        variant="outlined"
                        size="small"
                        className={classes.legendContent}
                        avatar={<Avatar style={{ backgroundColor: COLORS_PASTEL[index % COLORS_PASTEL.length] }}> </Avatar>}
                        label={value.name}
                    />)
                })}
        </div>)
}