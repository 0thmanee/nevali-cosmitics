"use client";

import React, { useState } from "react";
import { inputCls, inputFocusStyle, inputStyle } from "./auth-layout";

type AuthInputProps = {
	type?: string;
	name?: string;
	placeholder?: string;
	value: string;
	onChange: (v: string) => void;
	required?: boolean;
	minLength?: number;
	autoComplete?: string;
};

export function AuthInput({
	type = "text",
	name,
	placeholder,
	value,
	onChange,
	required,
	minLength,
	autoComplete,
}: AuthInputProps) {
	const [focused, setFocused] = useState(false);
	return (
		<input
			autoComplete={autoComplete}
			className={inputCls}
			minLength={minLength}
			name={name}
			onBlur={() => setFocused(false)}
			onChange={(e) => onChange(e.target.value)}
			onFocus={() => setFocused(true)}
			placeholder={placeholder}
			required={required}
			style={focused ? inputFocusStyle : inputStyle}
			type={type}
			value={value}
		/>
	);
}
