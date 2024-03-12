// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-dark.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-dark.js";
import "@spectrum-web-components/theme/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { ColorArea } from "@swc-react/color-area";
import { ColorSlider } from "@swc-react/color-slider";
import { OverlayTrigger } from "@swc-react/overlay";
import { Slider } from "@swc-react/slider";
import { Textfield } from "@swc-react/textfield";
import { Theme } from "@swc-react/theme";
import { Tooltip } from "@swc-react/tooltip";
import React, { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import "./App.css";

const App = ({ addOnUISdk }) => {
	const [color, setColor] = useState("#000");
	const [theme, setTheme] = useState(addOnUISdk.app.ui.theme);
	const [weight, setWeight] = useState(2);
	const [isColorPickerOpen, setColorPickerOpen] = useState(false);
	const [hasContent, setHasContent] = useState(false);
	const [error, setError] = useState(undefined);

	const canvas = useRef(null);
	const signaturePad = useRef(null);

	function resizeCanvas() {
		// When zoomed out to less than 100%, for some very strange reason,
		// some browsers report devicePixelRatio as less than 1
		// and only part of the canvas is cleared then.
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.current.width = canvas.current.offsetWidth * ratio;
		canvas.current.height = canvas.current.offsetHeight * ratio;
		canvas.current.getContext("2d").scale(ratio, ratio);
	}

	function checkContent() {
		if (signaturePad?.current) {
			setHasContent(!signaturePad?.current?.isEmpty());
			setError(undefined);
		}
	}

	useEffect(() => {
		resizeCanvas();
		const signPad = new SignaturePad(canvas.current, {
			// backgroundColor: "#fff", // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
			minWidth: 1,
			maxWidth: weight,
		});
		signaturePad.current = signPad;
		signPad.addEventListener("endStroke", checkContent);
		return () => {
			signaturePad.current.off();
		};
	}, []);

	useEffect(() => {
		addOnUISdk.app.on("themechange", (data) => {
			setTheme(data.theme);
		});
	}, []);

	useEffect(() => {
		function listenForEscape(e) {
			if (e.key === "Escape") {
				setColorPickerOpen(false);
			}
		}
		window.addEventListener("keydown", listenForEscape);
		return () => {
			window.removeEventListener("keydown", listenForEscape);
		};
	}, []);

	useEffect(() => {
		signaturePad.current.penColor = color;
	}, [color]);

	useEffect(() => {
		signaturePad.current.dotSize = weight;
		signaturePad.current.minWidth = weight;
		signaturePad.current.maxWidth = weight;
	}, [weight]);

	function undo() {
		var data = signaturePad.current.toData();
		if (data) {
			data.pop(); // remove the last dot or line
			signaturePad.current.fromData(data);
		}
		checkContent();
	}

	function clear() {
		signaturePad.current.clear();
		setHasContent(false);
	}

	function onColorChange(e) {
		setColor(e.target.color ?? e.target.value);
		e.stopPropagation();
	}

	function dataURLToBlob(dataURL) {
		// Code taken from https://github.com/ebidel/filer.js
		const parts = dataURL.split(";base64,");
		const contentType = parts[0].split(":")[1];
		const raw = window.atob(parts[1]);
		const rawLength = raw.length;
		const uInt8Array = new Uint8Array(rawLength);

		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}

		return new Blob([uInt8Array], { type: contentType });
	}

	function addToDocument() {
		if (!hasContent) {
			setError("Draw signature first to add to the document");
			return;
		}
		const dataURL = signaturePad.current.toDataURL();
		const blob = dataURLToBlob(dataURL);
		addOnUISdk.app.document.addImage(blob);
	}

	return (
		// Please note that the below "<Theme>" component does not react to theme changes in Express.
		// You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
		<Theme theme="express" scale="medium" color={theme}>
			<div
				className={`container ${theme}`}
				onClick={(e) => {
					if (isColorPickerOpen) {
						setColorPickerOpen(false);
					}
				}}
			>
				<div className="canvas-container">
					<p className="signature-label">Draw your signature</p>
					<div className={`wrapper ${error ? "error" : ""}`}>
						<canvas
							id="signature-pad"
							className="signature-pad"
							ref={canvas}
						></canvas>
					</div>
					{error ? <span className="error-message">{error}</span> : <></>}
				</div>
				<div className="btn-container">
					<Button
						size="m"
						onClick={clear}
						variant="secondary"
						disabled={!hasContent}
					>
						Clear
					</Button>
					<Button
						size="m"
						onClick={undo}
						variant="secondary"
						disabled={!hasContent}
					>
						Undo
					</Button>
				</div>
				<div className="color-box-container">
					<div className="row color-box-input-container">
						<span style={{ fontWeight: `bold` }}>Color</span>
						<button
							className={`color-box ${isColorPickerOpen ? "active" : ""}`}
							style={{ backgroundColor: `${color}` }}
							onClick={(e) => {
								setColorPickerOpen((isColorPickerOpen) => !isColorPickerOpen);
								e.stopPropagation();
							}}
						>
							<OverlayTrigger placement="bottom">
								<span slot="trigger"></span>
								<Tooltip placement="bottom" slot="hover-content">
									{color}
								</Tooltip>
							</OverlayTrigger>
						</button>
					</div>
					{isColorPickerOpen ? (
						<div
							className="color-picker"
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<ColorArea
								className="color-picker-area"
								color={color}
								change={onColorChange}
							></ColorArea>
							<ColorSlider
								className="color-picker-slider"
								color={color}
								input={onColorChange}
							></ColorSlider>
							<Textfield
								className="color-picker-input"
								value={color}
								change={onColorChange}
							></Textfield>
						</div>
					) : (
						<></>
					)}
				</div>
				<Slider
					className="weight-slider"
					size="l"
					value={weight}
					min={1}
					max={10}
					change={(e) => {
						setWeight(e.target.value);
						signaturePad.current.dotSize = e.target.value;
						signaturePad.current.maxWidth = e.target.value;
					}}
				>
					<span className="weight-slider-label">Weight</span>
				</Slider>
				<Button size="m" onClick={addToDocument} variant="accent">
					Add to Page
				</Button>
			</div>
		</Theme>
	);
};

export default App;
