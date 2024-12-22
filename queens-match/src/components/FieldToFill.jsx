import React from "react";
import "./FieldToFill.css";

const FieldToFill = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="field-to-fill">
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FieldToFill;
