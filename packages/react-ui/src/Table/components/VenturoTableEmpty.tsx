import React from 'react';
import { Box } from '../../Box';
import { Typography } from '../../Typography';
import type { VenturoTableEmptyState } from '../VenturoTable.types';

export const VenturoTableEmpty: React.FC<VenturoTableEmptyState> = ({
  icon,
  title,
  description
}) => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      {icon && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: description ? 1 : 0 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
  );
};
