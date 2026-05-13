import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { type UseFormRegisterReturn } from "react-hook-form";
import { type LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  icon?: LucideIcon;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  error,
  registration,
  className,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className={error ? "text-destructive" : ""}>
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          {...registration}
          {...props}
          className={`${error ? "border-destructive focus-visible:ring-destructive" : ""} ${Icon ? "pl-9" : ""} ${className || ""}`}
        />
      </div>
      {error && (
        <p className="text-[13px] font-medium text-destructive animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
