import { Checkbox, CheckboxPropsColorOverrides, FormControlLabel } from "@mui/material";
import { OverridableStringUnion } from '@mui/types';
import React from "react";

type customCheckBoxProps = {
    disabled: boolean;
    checked: boolean;
    onChange: () => void;
    label: string;
    color: OverridableStringUnion<"warning" | "primary" | "secondary" | "error" | "info" | "success" | "default", CheckboxPropsColorOverrides> | undefined
}

export const CustomCheckBox = ({disabled, checked, onChange, label, color} : customCheckBoxProps) => (
  <FormControlLabel
    disabled={disabled}
    control={
      <Checkbox
        checked={checked}
        onChange={onChange}
        color={color}
      />
    }
    label={label}
  />
);
