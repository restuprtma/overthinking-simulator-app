import { Controller, useFormContext, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Select, FormControl, InputLabel, MenuItem } from './Select';
import { FormHelperText } from '../FormHelperText';
import type { SelectProps } from '@mui/material/Select';

const shouldLabelShrink = (value: any): boolean => {
  return value !== undefined && value !== '' && value !== null;
};

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<SelectProps, 'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'> {
  name: TName;
  label?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  emptyOption?: {
    value: string | number;
    label: string;
  };
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  rules,
  defaultValue,
  options,
  emptyOption,
  fullWidth = true,
  required = false,
  disabled = false,
  ...selectProps
}: FormSelectProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const labelId = label ? `${name}-label` : undefined;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} required={required} error={!!error} disabled={disabled}>
          {label && (
            <InputLabel id={labelId} shrink={shouldLabelShrink(field.value)} sx={{ color: 'text.secondary' }}>
              {label}
            </InputLabel>
          )}
          <Select
            {...field}
            {...selectProps}
            labelId={labelId}
            label={label}
            value={field.value ?? ''}
            notched={shouldLabelShrink(field.value)}
          >
            {emptyOption && (
              <MenuItem value={emptyOption.value}>
                <em>{emptyOption.label}</em>
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={String(option.value)} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
