import React from "react";

const fieldStyle = {
  background: "var(--color-paper)",
  border: "1px solid var(--color-cream-dark)",
};

type Props = {
  fullName: string;
  email: string;
  phone: string;
};

export function ProfilePersonalSection({ fullName, email, phone }: Props) {
  const fields = [
    { label: "Full Name", value: fullName },
    { label: "Email Address", value: email },
    { label: "Phone Number", value: phone },
    { label: "Preferred Language", value: "French / Arabic" },
  ];

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
        <h3 className="font-serif font-bold text-[15px] text-text-dark">Personal Information</h3>
        <p className="font-sans text-[11px] text-text-muted mt-0.5">Your account and contact details</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
              {field.label}
            </label>
            <div className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5" style={fieldStyle}>
              {field.value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
