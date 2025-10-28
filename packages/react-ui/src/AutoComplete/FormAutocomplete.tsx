import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import {
  Autocomplete,
  TextField,
  Checkbox,
  AutocompleteProps,
  TextFieldProps,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export interface AutocompleteOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

export interface FormAutocompleteProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: AutocompleteOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  showCheckboxes?: boolean;
  rules?: any;
  textFieldProps?: Partial<TextFieldProps>;
  autocompleteProps?: Partial<Omit<AutocompleteProps<AutocompleteOption, boolean, boolean, boolean>, 'renderInput' | 'options'>>;
}

export const FormAutocomplete = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  multiple = false,
  fullWidth = true,
  helperText,
  showCheckboxes = true,
  rules,
  textFieldProps,
  autocompleteProps,
}: FormAutocompleteProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
        // Convert value to selected options
        const selectedOptions = multiple
          ? options.filter((option) => {
              if (!Array.isArray(value)) return false;
              // Convert both to string for comparison to handle type mismatches
              return value.some((v: string | number) => String(v) === String(option.value));
            })
          : options.find((option) => String(option.value) === String(value)) || null;

        return (
          <Autocomplete
            multiple={multiple}
            options={options}
            value={selectedOptions}
            disabled={disabled}
            disableCloseOnSelect={multiple}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
            isOptionEqualToValue={(option, value) =>
              (typeof option === 'string' ? option : option.value) === (typeof value === 'string' ? value : value.value)
            }
            onChange={(_, newValue) => {
              if (multiple) {
                // For multiple selection, extract array of values
                const values = Array.isArray(newValue)
                  ? newValue.map((item) => {
                      const option = item as AutocompleteOption;
                      return typeof option === 'string' ? option : option.value;
                    })
                  : [];
                onChange(values);
              } else {
                // For single selection, extract single value
                const singleValue = newValue as AutocompleteOption | null;
                onChange(singleValue ? (typeof singleValue === 'string' ? singleValue : singleValue.value) : null);
              }
            }}
            onBlur={onBlur}
            renderOption={
              multiple && showCheckboxes
                ? (props, option, { selected }) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.label}
                      </li>
                    );
                  }
                : undefined
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                required={required}
                error={!!error}
                helperText={error ? error.message : helperText}
                {...textFieldProps}
              />
            )}
            fullWidth={fullWidth}
            {...autocompleteProps}
          />
        );
      }}
    />
  );
};
