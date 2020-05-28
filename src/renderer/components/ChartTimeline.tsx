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

export default function ChartTimeline(props: Readonly<{
    className?: string,
    data: Array<{ [key: string]: any }>,
    series: Array<string>,
    minHeight: number
}>) {

    const { className, minHeight, data, series, ...rest } = props;

    return (
        <ResponsiveContainer width="80%" height="90%" minHeight={minHeight} className={className}>
            <BarChart
                data={data}
                margin={{
                    top: 5, right: 5, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={ {fill: 'white' }}/>
                <YAxis tick={ {fill: 'white' }} />
                <Tooltip />
                <Legend />
                {series?.map((ser, idx) => 
                    <Bar key={`tmln-${idx}`}
                        dataKey={ser}
                        fill={COLORS_PASTEL[idx % COLORS_PASTEL.length]}
                        stroke={"white"}
                        radius={[6, 6, 0, 0]} />
                )}
            </BarChart>
        </ResponsiveContainer >
    );
}
