import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell,
} from 'recharts';
import { COLORS_PASTEL } from '../consts';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import Timeline, { TimelineEntry } from '../../main/utils/timeline';

const chartStyles = makeStyles((theme: Theme) =>
    createStyles({
        customTooltip: {
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(1)
        }
    }),
);

function ChartTooltip(props: Readonly<{
    active?: boolean,
    label?: string,
    payload?: any
}>) {
    const { active, label, payload, ...rest } = props;
    const classes = chartStyles();

    if (active) {
        return (
            <div className={classes.customTooltip}>
                <div>{`${label}`}</div>
                {
                    payload?.map((p: any) =>
                        <div key={`crttltltp-${p.name}`}>{`${p.name}: ${p.payload[p.name]}`}</div>
                    )
                }
            </div>
        );
    }

    return null;
};

export default function ChartTimeline(props: Readonly<{
    className?: string,
    data: Array<{ [key: string]: any }>,
    series: Array<string>,
    isFiltered: boolean,
    minHeight: number
}>) {

    //
    const { data, series, isFiltered, className, minHeight, ...rest } = props;

    // const data = [
    //     { name: "January", "2020": 10, "2019": 5, "filtered-2020": 6, "filtered-2019": 0 },
    //     { name: "February", "2020": 8, "2019": 1, "filtered-2020": 2, "filtered-2019": 1 },
    //     { name: "March", "2020": 16, "2019": 0, "filtered-2020": 0, "filtered-2019": 0 },
    //     { name: "April", "2020": 4, "2019": 0, "filtered-2020": 5, "filtered-2019": 1 },
    // ]

    // const series = ["2019", "2020"];
    // const isFiltered = true;

    if (!isFiltered) {
        return (
            <ResponsiveContainer width="80%" height="90%" minHeight={minHeight} className={className}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5, right: 5, left: 20, bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: 'white' }} />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    {
                        series?.map((ser, idx) =>
                            <Bar key={`tmln-${idx}`}
                                dataKey={ser}
                                fill={COLORS_PASTEL[idx % COLORS_PASTEL.length]}
                                stroke={"white"}
                                radius={[2, 2, 0, 0]} />)
                    }
                </BarChart>
            </ResponsiveContainer >);
    }
    else {
        return (
            <ResponsiveContainer width="80%" height="90%" minHeight={minHeight} className={className}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5, right: 5, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: 'white' }} />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    {
                        series?.map((ser, idx) =>
                            <Bar key={`filtertmln-${idx}`}
                                dataKey={`${Timeline.FilteredPropName}-${ser}`}
                                fill={COLORS_PASTEL[idx % COLORS_PASTEL.length]}
                                stroke={"white"}
                                stackId={ser} />)
                    }
                    {
                        series?.map((ser, idx) =>
                            <Bar key={`tmln-${idx}`}
                                dataKey={ser}
                                fill={"rgba(0,0,0,0.2)"}
                                stroke={"white"}
                                stackId={ser} />)
                    }
                </BarChart>
            </ResponsiveContainer>)
    }
}
