import React from 'react';
import { Paper } from '../Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table';
import { TablePagination } from '../TablePagination';
import { VenturoTableLoading } from './components/VenturoTableLoading';
import { VenturoTableEmpty } from './components/VenturoTableEmpty';
import { VenturoTableActions } from './components/VenturoTableActions';
import type { VenturoTableProps } from './VenturoTable.types';

export function VenturoTable<TData = any>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onLimitChange,
  actions,
  emptyState = { title: 'No data found' },
  loadingText = 'Loading...',
  rowsPerPageOptions = [5, 10, 25, 50],
  getRowKey = (_row, index) => String(index),
}: VenturoTableProps<TData>) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage + 1); // Convert from 0-based to 1-based
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onLimitChange) {
      onLimitChange(parseInt(event.target.value, 10));
    }
  };

  // Check if pagination data is valid
  const isPaginationValid =
    pagination &&
    typeof pagination.total === 'number' &&
    typeof pagination.page === 'number' &&
    typeof pagination.limit === 'number';

  // Show loading state
  if (loading && data.length === 0) {
    return (
      <Paper>
        <VenturoTableLoading text={loadingText} />
      </Paper>
    );
  }

  // Determine if actions column should be shown
  const hasActions = Boolean(actions);
  const actionsColumnCount = hasActions ? 1 : 0;
  const totalColumns = columns.length + actionsColumnCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TableContainer
        sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    backgroundColor: '#fff !important',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell
                  align="right"
                  sx={{
                    backgroundColor: '#fff !important',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center">
                  <VenturoTableEmpty {...emptyState} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index);
                const rowActions = actions ? actions(row) : [];

                return (
                  <TableRow key={rowKey} hover>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render(row, index)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell align="right">
                        <VenturoTableActions row={row} actions={rowActions} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {isPaginationValid && onPageChange && onLimitChange && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={(pagination.page - 1)} // Convert from 1-based to 0-based
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </div>
  );
}
