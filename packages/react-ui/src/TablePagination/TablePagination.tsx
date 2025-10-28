import MuiTablePagination, { TablePaginationProps as MuiTablePaginationProps } from '@mui/material/TablePagination';
import React from 'react';
import { Box } from '@mui/material';

export type TablePaginationProps = MuiTablePaginationProps & {
  /**
   * Split layout: pisahkan "Rows per page" (kiri) dan pagination (kanan)
   * Default: true
   */
  splitLayout?: boolean;

  /**
   * Posisi layout saat splitLayout = false
   * Default: 'right'
   */
  align?: 'left' | 'center' | 'right';
};

export const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  ({ splitLayout = true, align = 'right', ...props }, ref) => {
    if (splitLayout) {
      // 🔹 Mode kiri–kanan terpisah
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          ref={ref}
        >
          {/* Kiri: Rows per page */}
          <MuiTablePagination
            component="div"
            count={props.count}
            page={props.page}
            onPageChange={props.onPageChange}
            rowsPerPage={props.rowsPerPage}
            onRowsPerPageChange={props.onRowsPerPageChange}
            rowsPerPageOptions={props.rowsPerPageOptions}
            labelDisplayedRows={() => ''}
            ActionsComponent={() => null}
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0,
                paddingRight: 0,
              },
            }}
          />

          {/* Kanan: Pagination */}
          <MuiTablePagination
            component="div"
            count={props.count}
            page={props.page}
            onPageChange={props.onPageChange}
            rowsPerPage={props.rowsPerPage}
            onRowsPerPageChange={props.onRowsPerPageChange}
            rowsPerPageOptions={[]} // hide rows-per-page selector
            labelRowsPerPage=""
          />
        </Box>
      );
    }

    // 🔸 Mode satu baris dengan posisi dinamis
    return (
      <Box
        display="flex"
        justifyContent={
          align === 'left'
            ? 'flex-start'
            : align === 'center'
            ? 'center'
            : 'flex-end'
        }
        alignItems="center"
        px={2}
        ref={ref}
      >
        <MuiTablePagination
          component="div"
          {...props}
          sx={{
            '& .MuiTablePagination-toolbar': {
              justifyContent:
                align === 'left'
                  ? 'flex-start'
                  : align === 'center'
                  ? 'center'
                  : 'flex-end',
              width: '100%',
              paddingLeft: 0,
              paddingRight: 0,
            },
            '& .MuiTablePagination-spacer': {
              display: 'none',
            },
          }}
        />
      </Box>
    );
  }
);

TablePagination.displayName = 'TablePagination';
