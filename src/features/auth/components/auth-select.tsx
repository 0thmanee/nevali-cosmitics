"use client";

import React, { useState } from "react";
import { inputCls, inputFocusStyle, inputStyle } from "./auth-layout";

type AuthSelectProps = {
	value: string;
	onChange: (v: string) => void;
	options: readonly string[] | string[];
	placeholder?: string;
};

export function AuthSelect({
	value,
	onChange,
	options,
	placeholder,
}: AuthSelectProps) {
	const [focused, setFocused] = useState(false);
	return (
		<select
			className={inputCls + "appearance-none"}
			onBlur={() => setFocused(false)}
			onChange={(e) => onChange(e.target.value)}
			onFocus={() => setFocused(true)}
			style={focused ? inputFocusStyle : inputStyle}
			value={value}
		>
			{placeholder && <option value="">{placeholder}</option>}
			{options.map((o) => (
				<option
					key={o}
					style={{
						background: "var(--color-paper)",
						color: "var(--color-ink)",
					}}
					value={o}
				>
					{o}
				</option>
			))}
		</select>
	);
}
