import React from "react";

const fieldStyle = {
  background: "#ffffff",
  border: "1px solid #d8d0c4",
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
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
        <h3 className="font-serif font-bold text-[15px] text-[#000000]">Personal Information</h3>
        <p className="font-sans text-[11px] text-[#727272] mt-0.5">Your account and contact details</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
              {field.label}
            </label>
            <div className="font-sans text-sm text-[#000000] rounded-xl px-3.5 py-2.5" style={fieldStyle}>
              {field.value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
