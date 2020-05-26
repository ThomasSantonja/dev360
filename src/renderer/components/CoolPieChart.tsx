import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { NameValuePair } from '../../main/utils/nvp-array';
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
    value: any,
    textColor: string
}>) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value
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
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
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
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="currentColor">{value}</text>
        </g>
    );
};


export default function TimeDisplay(props: Readonly<any>) {
    const { className, data, textColor, ...rest } = props;

    const [state, setState] = React.useState({ activeIndex: 0 });

    const onPieEnter = (data: any, index: number) => {
        setState({
            activeIndex: index,
        });
    };

    return (
        <ResponsiveContainer width="100%" height="100%" {...rest}>
            <PieChart>
                <Pie
                    activeIndex={state.activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {
                        data?.map((entry: any, index: number) => <Cell key={index} fill={COLORS_PASTEL[index % COLORS_PASTEL.length]} />)
                    }
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}