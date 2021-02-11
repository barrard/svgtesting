import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./App.css";

const svgWidth = 1000;
const svgHeight = 500;
const width = 20;
const height = 20;
const animationTimer = 100;
let recs = [];
function App() {
    const svgRef = useRef();
    const [tick, setTick] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        let data = makeData();
        setData(data);
        let timer;
        setTimeout(() => {
            timer = setInterval(() => {
                setTick((tick) => {
                    console.log({ tick: tick + 1 });
                    return tick + 1;
                });
            }, animationTimer);
        }, 10);
        return () => {
            console.log("cleanup timer");
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        draw();
        return () => {
            console.log("cleanup draw");
        };
    }, [svgRef, tick]);

    function draw() {
        console.log("draw");
        if (!data.length) return console.log("no data yet");
        console.log({ tick });
        let index = Math.floor(tick % data.length);
        console.log({ data: data[index] });
        if (!recs.length) {
            debugger;
            recs = data[index].map((rectData, i) => {
                let rectRef = useRef();
                let r = <Rect ref={rectRef} key={i} id={i} data={rectData} tick={tick} />;
                return rectRef;
            });
        }
        recs.forEach((rec, iRec) => {
            debugger;
            // rec.props.x = data[index][iRec].x;
            console.log(rec);
            debugger;
            // rec.setTick(tick);
        });

        console.log(recs);
        debugger;
        return;
    }

    return (
        <div className="App">
            <StyledSvg width={svgWidth} height={svgHeight} ref={svgRef}>
                {draw()}
            </StyledSvg>
        </div>
    );
}

export default App;

class Rect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // currentTheta: 0
            data: props.data,
            tick: props.tick,
        };
        this.setTick = this.setTick.bind(this);
    }

    componentDidMount() {
        console.log(`Mounting rect ${this.props.id}`);
        // const animate = () => {
        //     const nextTheta = this.state.currentTheta > this.props.angularLimit ? 0 : this.state.currentTheta + this.props.thetaDelta;

        //     this.setState({ currentTheta: nextTheta });
        //     this.rafId = requestAnimationFrame(animate);
        // };

        // this.rafId = requestAnimationFrame(animate);
    }

    componentWillUnmount() {
        // cancelAnimationFrame(this.rafId);
        console.log(`DIS-Mounting rect ${this.props.id}`);
    }

    setTick(tick) {
        this.setState({ tick });
    }
    render() {
        let { x, y, width, height, color } = this.state.data[this.state.tick];
        debugger;
        return <rect fill={color} key={this.props.id} x={x} y={y} width={width} height={height} />;
    }
}

const StyledSvg = styled.svg`
    border: 1px solid black;
    background-color: green;
`;

function makeData() {
    const shapes = 500;
    const ticks = 50;
    let data = [];
    for (let tick = 0; tick < ticks; tick++) {
        //make shapes
        if (!data[tick]) {
            data[tick] = [];
        }

        for (let i = 0; i < shapes; i++) {
            console.log(data[i - 1]);
            let color = data[tick - 1]
                ? data[tick - 1][i].color
                : `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}`;
            let x = data[tick - 1] ? data[tick - 1][i].x : rand(0, svgWidth);
            let y = data[tick - 1] ? data[tick - 1][i].y : rand(0, svgHeight);
            data[tick][i] = { x: x + rand(rand(-10, 0), rand(0, 10)), y: y + rand(rand(-10, 0), rand(0, 10)), color };
        }
    }
    debugger;
    return data;
}

function rand(min, max) {
    return parseInt((Math.random() * (max - min) + min).toFixed());
}
