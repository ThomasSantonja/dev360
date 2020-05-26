import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell,
} from 'recharts';
import { NameValuePair, NvpArray } from 'src/main/utils/nvp-array';
import { COLORS_PASTEL } from '../consts';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { Label } from '@material-ui/icons';

const chartStyles = makeStyles((theme: Theme) =>
    createStyles({
        customTooltip: {
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(1)
        }
    }),
);

function BarTooltip(props: Readonly<{
    active?: boolean,
    total: number,
    payload: Array<NameValuePair>,
    label?: string,
}>) {
    const { active, label, payload, total, ...rest } = props;
    const classes = chartStyles();

    if (active) {
        const percent = (payload[0].value) / total;
        return (
            <div className={classes.customTooltip}>
                <p>{`${label} : ${payload[0].value}`}</p>
                <p>{`${(percent * 100).toFixed(2)}%`}</p>
            </div>
        );
    }

    return null;
};

function BarLabel(props: Readonly<{ x?: number, y?: number, width?: number, height?: number, stroke: string, value?: any }>) {
    const { x, y, stroke, value, width, height, ...rest } = props;

    var locx = (x ?? 0) + ((width ?? 0) / 2);
    var locy = (y ?? 0) + ((height ?? 0) / 2);

    return (
        <text x={locx} y={locy} dy={8} fill={stroke} textAnchor="middle">{value}</text>
    );
}

export default function VerticalBarChart(props: Readonly<{
    className?: string,
    data: Array<NameValuePair>,
    minHeight: number
}>) {

    const { className, data, minHeight, ...rest } = props;

    const total = (data?.reduce((a, b) => a + (b.value || 0), 0)) ?? 1;

    return (
        <ResponsiveContainer width="80%" height="90%" minHeight={minHeight} className={className}>
            <BarChart layout="vertical" data={data}>
                <XAxis hide type="number" />
                <YAxis type="category" dataKey="name"  tick={{ fill: 'white' }} />
                <Tooltip content={<BarTooltip total={total} />} />
                <Bar isAnimationActive={false}
                    dataKey="value"
                    fill="#8884d8"
                    stroke={"white"}>
                    {data?.map((entry, index) => (
                        <Cell key={`cell-${index + 1}`} fill={COLORS_PASTEL[index % COLORS_PASTEL.length]} />
                    ))}
                    {/* <LabelList
                        dataKey="value"
                        position="insideRight"

                        content={<BarLabel stroke={"white"} payload={data} />}
                    /> */}
                </Bar>
            </BarChart>
        </ResponsiveContainer >
    );
}
