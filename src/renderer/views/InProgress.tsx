import React from "react";
import { Typography, Container, makeStyles, createStyles, Theme } from "@material-ui/core";
import { RouteLogic } from "../App";
import InProgress from "../components/icons/InProgress";
import { ViewModelProps } from "./Incidents";

const inProgressStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: "column",
            alignItems: "center"
        },
        icon: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: theme.spacing(10),
            width: theme.spacing(10)
        },
    }),
);

const pageName = "InProgress";

export default function InProgressView(props: Readonly<ViewModelProps>) {
    const classes = inProgressStyles();

    if (props?.routeSetter) {
        if (props?.route !== pageName) {
            props.routeSetter(pageName), 0;
        }
    }

    return (
        <Container className={classes.root} maxWidth="sm">
            <InProgress />
            <Typography paragraph>
                Work in progress
            </Typography>
            <Clock />
            <Calculator />
        </Container>
    );
}

class Clock extends React.Component<{}, { date: Date }> {

    timerID: any;

    constructor(props: Readonly<{ date: Date }>) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

function BoilingVerdict(props: Readonly<{ celsius: number }>) {
    if (props.celsius >= 100) {
        return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
}

class Calculator extends React.Component<{}, { temperature: any, scale: string }> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = { temperature: '', scale: 'c' };
    }

    handleCelsiusChange(temperature: string) {
        this.setState({ scale: 'c', temperature });
    }

    handleFahrenheitChange(temperature: string) {
        this.setState({ scale: 'f', temperature });
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

        return (
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange} />
                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange} />
                <BoilingVerdict
                    celsius={parseFloat(celsius)} />
            </div>
        );
    }
}

interface IScale { [key: string]: string }

const scaleNames: IScale = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component<{ scale: string, temperature: number, onTemperatureChange: any }, { temperature: any }> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { temperature: '' };
    }

    handleChange(e: any) {
        this.props.onTemperatureChange(e.target.value);
        //this.setState({ temperature: e.target.value });
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature}
                    onChange={this.handleChange} />
            </fieldset>
        );
    }
}

function toCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius: number): number {
    return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature: string, convert: (val: number) => number) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}