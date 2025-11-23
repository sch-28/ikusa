import type { HeaderColumn, Row, RowElement, RowObject } from "./table";

function toCellText(el: RowElement): string {
	if (el == null) return "";
	if (typeof el === "string" || typeof el === "number") return String(el);

	// RowObject-like
	const ro = el as Partial<RowObject>;
	if (ro && (ro.label !== undefined || ro.value !== undefined)) {
		// Prefer value if present, else label; unwrap primitives only
		const v = ro.value ?? ro.label;
		if (typeof v === "string" || typeof v === "number") return String(v);
		return ""; // component or non-serializable
	}

	// Component or unknown object
	return "";
}

function escapeCSVField(s: string): string {
	// RFC4180: quote if contains comma, quote or newline; double quotes inside
	const needsQuote = /[",\r\n]/.test(s);
	if (!needsQuote) return s;
	return `"${s.replace(/"/g, '""')}"`;
}

function rowsToCSV(headers: HeaderColumn[], rows: Row[]): string {
	const head = headers.map((h) => escapeCSVField(h.label ?? "")).join(",");
	const body = rows.map((r) =>
		headers.map((_, i) => escapeCSVField(toCellText(r.columns[i]))).join(","),
	);
	return [head, ...body].join("\r\n");
}

function downloadBlob(
	content: string,
	filename: string,
	mime = "text/csv;charset=utf-8",
) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export function exportTableCSV(
	filename: string,
	headers: HeaderColumn[],
	rows: Row[],
): void {
	const csv = rowsToCSV(headers, rows);
	// Add BOM for Excel compatibility
	const bom = "\uFEFF";
	downloadBlob(bom + csv, filename);
}
