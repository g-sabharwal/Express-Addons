export const barcodeFormats = {
	EAN13: {
		regex: /^\d{13}$/,
		errorMessage:
			"EAN-13 barcodes must be of either 12 or 13 digits. If there are 13 digits, the 13th digit should be a valid check digit.",
	},
	CODE39: {
		regex: /^[0-9A-Z\-\.\ \$\/\+\%]+$/,
		errorMessage:
			"CODE39 barcodes must contain only alphanumeric characters and the following symbols: - . $ / + % and space.",
	},
	ITF: {
		regex: /^\d{2}(\d{2})+$/,
		errorMessage: "ITF barcodes must contain an even number of digits.",
	},
	codabar: {
		regex: /^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/,
		errorMessage:
			"Codabar barcodes must start and end with one of the following characters: A, B, C, or D. The data in between must contain only numeric characters, plus (+), minus (-), colon (:), period (.), dollar sign ($), or slash (/).",
	},
	CODE128: {
		regex: /^[\x00-\x7F]+$/,
		errorMessage: "CODE128 barcodes must contain ASCII characters 0-127.",
	},
	Pharmacode: {
		regex: /^\d+$/,
		errorMessage:
			"Pharmacode barcodes must contain numbers greater than 2 and less than 131071.",
	},
	CODE128A: {
		regex: /^[\x00-\x7F]+$/,
		errorMessage: "CODE128A barcodes must contain ASCII characters 0-95.",
	},
	CODE128B: {
		regex: /^[\x00-\x7F]+$/,
		errorMessage: "CODE128B barcodes must contain ASCII characters 32-127.",
	},
	CODE128C: {
		regex: /^[\x00-\x7F]+$/,
		errorMessage: "CODE128C barcodes must contain ASCII characters 0-99.",
	},
	EAN2: {
		regex: /^\d{2}$/,
		errorMessage: "EAN2 barcodes must be 2 digits.",
	},
	EAN5: {
		regex: /^\d{5}$/,
		errorMessage: "EAN5 barcodes must be 5 digits.",
	},
	EAN8: {
		regex: /^\d{8}$/,
		errorMessage: "EAN8 barcodes must be 8 digits.",
	},
	UPC: {
		regex: /^\d{12}$/,
		errorMessage:
			"UPC barcodes must be of either 11 or 12 digits. If there are 12 digits, the 12th digit should be a valid check digit.",
	},
	UPCE: {
		regex: /^\d{6}$/,
		errorMessage: "UPC (E) barcodes must be 6 digits.",
	},
	ITF14: {
		regex: /^\d{14}$/,
		errorMessage: "ITF-14 barcodes must be 14 digits.",
	},
	MSI: {
		regex: /^\d+$/,
		errorMessage: "MSI barcodes must contain only numeric characters.",
	},
	MSI10: {
		regex: /^\d+$/,
		errorMessage: "MSI10 barcodes must contain only numeric characters.",
	},
	MSI11: {
		regex: /^\d+$/,
		errorMessage: "MSI11 barcodes must contain only numeric characters.",
	},
	MSI1010: {
		regex: /^\d+$/,
		errorMessage: "MSI1010 barcodes must contain only numeric characters.",
	},
	MSI1110: {
		regex: /^\d+$/,
		errorMessage: "MSI1110 barcodes must contain only numeric characters.",
	},
};
