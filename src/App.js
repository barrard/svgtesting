import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./App.css";

const svgWidth = 1000;
const svgHeight = 500;
const width = 20;
const height = 20;
const animationTimer = 1000;
const shapes = 500;

function App() {
	const svgRef = useRef();
	// const [tick, setTick] = useState(0);
	const [data, setData] = useState([]);
	const [left, setLeft] = useState(-10);
	const [right, setRight] = useState(10);
	const [down, setDown] = useState(10);
	const [up, setUp] = useState(-10);
	const [speed, setSpeed] = useState(100);

	let leftRef = useRef(left);
	let rightRef = useRef(right);
	let downRef = useRef(down);
	let upRef = useRef(up);
	let speedRef = useRef(speed);

	useEffect(() => {
		let timer = setInterval(() => {
			let newData = makeSingleData(data, leftRef.current, upRef.current, downRef.current, rightRef.current);
			setData([...newData]);
		}, speed);
		return () => {
			console.log("cleanup draw");
			clearInterval(timer);
		};
	}, [speed]);

	useEffect(() => {
		draw();
		return () => {
			console.log("cleanup timer");
		};
	}, [data]);

	function draw() {
		console.log("draw");

		return data.map(({ x, y, color }, i) => (
			<rect fill={color} key={i} x={x} y={y} width={width} height={height} />
		));
	}

	function makeSingleData(data = [], left, up, down, right) {
		for (let i = 0; i < shapes; i++) {
			let x, y, color;
			if (!data[i]) {
				color = `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}`;
				x = rand(0, svgWidth);
				y = rand(0, svgHeight);
				data[i] = { color, y, x };
			}

			color = data[i].color;
			x = data[i].x;
			y = data[i].y;

			data[i] = {
				x: x + rand(rand(left, 0), rand(0, right)),
				y: y + rand(rand(up, 0), rand(0, down)),
				color,
			};
			console.log({ left, up, down, right });
		}
		return data;
	}

	return (
		<div className="App">
			<StyledSvg speed={speed} width={svgWidth} height={svgHeight}>
				{draw()}
			</StyledSvg>
			<InputContainer>
				<Input name="Speed" dataRef={speedRef} data={speed} setData={setSpeed} />
				<Input name="Right" dataRef={rightRef} data={right} setData={setRight} />
				<Input name="Left" dataRef={leftRef} data={left} setData={setLeft} />
				<Input name="Up" dataRef={upRef} data={up} setData={setUp} />
				<Input name="Down" dataRef={downRef} data={down} setData={setDown} />
			</InputContainer>
		</div>
	);
}

export default App;

const Input = ({ name, data, setData, dataRef }) => {
	return (
		<>
			<label htmlFor={name}>{name}</label>
			<input
				type="number"
				value={data}
				onChange={(e) => {
					dataRef.current = parseInt(e.target.value);
					setData(parseInt(e.target.value));
				}}
			/>
		</>
	);
};

const InputContainer = styled.div``;

const StyledSvg = styled.svg`
	transition: transform ${({ speed }) => speed + "ms"};

	border: 1px solid black;
	background-color: green;
`;

// function makeData() {
//     const shapes = 250;
//     const ticks = 250;
//     let data = [];
//     for (let tick = 0; tick < ticks; tick++) {
//         //make shapes
//         if (!data[tick]) {
//             data[tick] = [];
//         }

//         for (let i = 0; i < shapes; i++) {
//             console.log(data[i - 1]);
//             let color = data[tick - 1]
//                 ? data[tick - 1][i].color
//                 : `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}`;
//             let x = data[tick - 1] ? data[tick - 1][i].x : rand(0, svgWidth);
//             let y = data[tick - 1] ? data[tick - 1][i].y : rand(0, svgHeight);
//             data[tick][i] = { x: x + rand(rand(-10, 0), rand(0, 10)), y: y + rand(rand(-10, 0), rand(0, 10)), color };
//         }
//     }
//     debugger;
//     return data;
// }

function rand(min, max) {
	return parseInt((Math.random() * (max - min) + min).toFixed());
}
