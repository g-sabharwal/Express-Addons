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
import { MenuItem } from "@swc-react/menu";
import { OverlayTrigger } from "@swc-react/overlay";
import { Picker } from "@swc-react/picker";
import { Textfield } from "@swc-react/textfield";
import { Theme } from "@swc-react/theme";
import { Tooltip } from "@swc-react/tooltip";
import JsBarcode from "jsbarcode";
import React, { useEffect, useRef, useState } from "react";
import { barcodeFormats } from "../constants";
import "./App.css";

const barcodeOptions = Object.keys(barcodeFormats);

const App = ({ addOnUISdk }) => {
	const [theme, setTheme] = useState(addOnUISdk.app.ui.theme);
	const [type, setType] = useState(barcodeOptions[0]);
	const [isError, setIsError] = useState(false);
	const [data, setData] = useState("");
	const [color, setColor] = useState("#000");
	const [isColorPickerOpen, setColorPickerOpen] = useState(false);

	const canvas = useRef(null);

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
		let error = false;
		setIsError(error);
		JsBarcode("#barcode", data, {
			textAlign: "center",
			textPosition: "bottom",
			font: "adobe-clean",
			fontOptions: "bold",
			// fontSize: 40,
			textMargin: 15,
			format: type,
			valid: (isValid) => {
				if (!isValid) {
					error = true;
				}
			},
			lineColor: color,
		});
		setIsError(error);
		if (error) {
			return;
		}
		try {
			const dataURL = canvas.current.toDataURL();
			const blob = dataURLToBlob(dataURL);
			addOnUISdk.app.document.addImage(blob);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		// Please note that the below "<Theme>" component does not react to theme changes in Express.
		// You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
		<Theme theme="express" scale="medium" color={theme}>
			<canvas id="barcode" ref={canvas}></canvas>
			<div
				className={`container ${theme}`}
				onClick={() => {
					if (isColorPickerOpen) {
						setColorPickerOpen(false);
					}
				}}
			>
				<span>
					Enter the details of the barcode you wish to generate below.
				</span>

				<div className="input-container">
					<div className="input">
						<span htmlFor="picker-m" size="m">
							Selection type:
						</span>
						<Picker
							className="barcode-type-picker"
							size="m"
							label="Selection type"
							change={(e) => {
								setType(e.target.value);
							}}
						>
							{barcodeOptions.map((barcodeType) => (
								<MenuItem
									role="option"
									value={barcodeType}
									key={barcodeType}
									selected={barcodeType === type}
								>
									{barcodeType?.toUpperCase()}
								</MenuItem>
							))}
						</Picker>
					</div>
					<div className="input">
						<span htmlFor="picker-m" size="m">
							Data:
						</span>
						<Textfield
							className={`data-input ${isError ? "error-input" : ""}`}
							value={data}
							change={(e) => {
								setData(e.target.value);
							}}
						></Textfield>
						{isError ? (
							<p className="error-text">{barcodeFormats[type]?.errorMessage}</p>
						) : (
							<></>
						)}
					</div>
				</div>
				<div className="color-box-container">
					<div className="row color-box-input-container">
						<span style={{ fontWeight: `bold`, lineHeight: "1.25rem" }}>
							Barcode Color
						</span>
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
				<Button size="m" onClick={addToDocument} variant="accent">
					Generate Barcode
				</Button>
			</div>
		</Theme>
	);
};

export default App;
