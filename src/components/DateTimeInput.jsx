import React from "react";
import { TextInput } from "grommet";

const toLocalValue = (value) => {
	if (!value) return "";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const pad = (part) => String(part).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const DateTimeInput = ({ value, onChange, ...rest }) => (
	<TextInput
		{...rest}
		type="datetime-local"
		value={toLocalValue(value)}
		onChange={(event) => {
			const nextValue = event.target.value;
			onChange?.({ value: nextValue ? new Date(nextValue).toISOString() : undefined });
		}}
	/>
);

export default DateTimeInput;