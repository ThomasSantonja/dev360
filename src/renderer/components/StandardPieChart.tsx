import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, Sector } from 'recharts';
import { NameValuePair, NvpArray } from '../../main/utils/nvp-array';
import { COLORS_PASTEL } from '../consts';

const renderActiveShape = (props: Readonly<{
    cx: number,
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    fill: string,
    payload: NameValuePair,
    percent: number,
    stroke: string,
    textColor: string,
    value: number
}>) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, stroke, value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy - 8} dy={8} textAnchor="middle" fill="currentColor">{payload.name}</text>
            <text x={cx} y={cy} dy={18} textAnchor="middle" fill="currentColor">
                {`${value} (${(percent * 100).toFixed(2)}%)`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke={stroke}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};


export default function StandardPieChart(props: Readonly<{
    className?: string,
    data: Array<NameValuePair>,
    minHeight: string
}>) {
    const { className, data, minHeight, ...rest } = props;

    const [state, setState] = React.useState({ activeIndex: 0 });

    const onPieEnter = (data: any, index: number) => {
        setState({
            activeIndex: index,
        });
    };

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={minHeight} className={className}>
            <PieChart>
                <Pie dataKey="value"
                    activeIndex={state.activeIndex}
                    activeShape={renderActiveShape}
                    innerRadius="60%"
                    outerRadius="90%"
                    onMouseEnter={onPieEnter}
                    data={data}>
                    {
                        data?.map((entry, index) => <Cell key={index} fill={COLORS_PASTEL[index % COLORS_PASTEL.length]} />)
                    }
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}