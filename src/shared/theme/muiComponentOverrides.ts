import { Theme, Components } from '@mui/material/styles';

/**
 * MUI Component Style Overrides
 * Matches styling from custom-theme.tsx (theme-ui components)
 */
export const getMuiComponentOverrides = (theme: Theme): Components => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        fontSize: '0.775rem',
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
          outline: 'none',
          zIndex: 10,
        },
      },
      sizeSmall: {
        padding: '6px 12px',
        fontSize: '0.775rem',
      },
      sizeMedium: {
        padding: '8px 16px',
        fontSize: '0.775rem',
      },
      sizeLarge: {
        padding: '10px 20px',
        fontSize: '1rem',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
      containedError: {
        backgroundColor: theme.palette.error.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
        },
      },
      containedWarning: {
        backgroundColor: theme.palette.warning.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.warning.dark,
        },
      },
      containedInfo: {
        backgroundColor: theme.palette.info.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.info.dark,
        },
      },
      containedSuccess: {
        backgroundColor: theme.palette.success.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
        },
      },
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
        },
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          borderColor: theme.palette.primary.main,
        },
      },
      text: {
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: theme.shape.borderRadius,
          fontSize: '0.775rem',
          backgroundColor: 'transparent',
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.divider,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
          '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
          },
        },
        '& .MuiInputBase-input': {
          // padding: '10px 14px',
          fontSize: '0.775rem',
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.5,
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.775rem',
          fontWeight: 400,
          color: theme.palette.mode === 'light' ? theme.palette.grey[700] : '#ffffff',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem',
          marginLeft: 0,
          marginTop: '4px',
        },
      },
    },
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
        '&.Mui-focused': {
          boxShadow: 'none',
        },
      },
      notchedOutline: {
        borderColor: theme.palette.divider,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow:
          theme.palette.mode === 'light' ? '0px 2px 4px -1px rgba(175, 182, 201, 0.2)' : 'none',
        backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.grey[800],
        position: 'relative',
        width: '100%',
        wordWrap: 'break-word',
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': {
          paddingBottom: 0,
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
        marginBottom: '16px',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        padding: '4px',
        '&.Mui-checked': {
          color: theme.palette.primary.main,
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem',
          borderRadius: '2px',
        },
      },
    },
    defaultProps: {
      color: 'primary',
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        fontSize: '0.775rem',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
      },
      select: {
        padding: '10px 14px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.775rem',
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        '& .MuiInputLabel-root': {
          fontSize: '0.775rem',
          fontWeight: 400,
          color: theme.palette.mode === 'light' ? theme.palette.grey[700] : '#ffffff',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.775rem',
        fontWeight: 400,
        color: theme.palette.mode === 'light' ? theme.palette.grey[700] : '#ffffff',
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '0.75rem',
        marginLeft: 0,
        marginTop: '4px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
      },
      elevation1: {
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 4px -1px rgba(175, 182, 201, 0.2)'
            : 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px',
      },
    },
  },
  // MuiDialog: {
  //   styleOverrides: {
  //     paper: {
  //       borderRadius: theme.shape.borderRadius,
  //       padding: '24px',
  //     },
  //   },
  // },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '10px 12px 10px 24px',
      },
    },
  },
  // MuiDialogContent: {
  //   styleOverrides: {
  //     root: {
  //       padding: '16px 0',
  //     },
  //   },
  // },
  // MuiDialogActions: {
  //   styleOverrides: {
  //     root: {
  //       padding: '16px 0 0 0',
  //     },
  //   },
  // },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        // borderRadius: '4px',
        // fontWeight: 600,
        fontSize: '0.75rem',
      },
      // colorPrimary: {
      //   backgroundColor: theme.palette.primary.main,
      //   color: '#ffffff',
      // },
      // colorSecondary: {
      //   backgroundColor: theme.palette.secondary.main,
      //   color: '#ffffff',
      // },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          fontWeight: 600,
          fontSize: '0.775rem',
          textTransform: 'capitalize',
          color: theme.palette.mode === 'light' ? theme.palette.grey[700] : '#ffffff',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'transparent',
          padding: '16px',
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          padding: '10px 16px',
          backgroundColor: 'transparent',
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : 'transparent',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: '0.775rem',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 44,
        height: 24,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.primary.main,
              opacity: 1,
              border: 0,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          width: 20,
          height: 20,
        },
        '& .MuiSwitch-track': {
          borderRadius: 12,
          backgroundColor: theme.palette.grey[300],
          opacity: 1,
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 4px 20px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.08)'
            : '0px 4px 20px rgba(0, 0, 0, 0.3), 0px 2px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: theme.shape.borderRadius,
        marginTop: '4px',
        border: `1px solid ${theme.palette.divider}`,
      },
      listbox: {
        padding: '8px 0',
        fontSize: '0.775rem',
        '& .MuiAutocomplete-option': {
          padding: '10px 16px',
          fontSize: '0.775rem',
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
          },
          '&[aria-selected="true"]': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
      noOptions: {
        fontSize: '0.775rem',
        padding: '12px 16px',
        color: theme.palette.text.secondary,
      },
      loading: {
        fontSize: '0.775rem',
        padding: '12px 16px',
        color: theme.palette.text.secondary,
      },
    },
  },
});
