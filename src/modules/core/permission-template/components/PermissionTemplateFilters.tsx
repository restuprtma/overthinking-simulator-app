import { Select, MenuItem } from '@venturo/react-ui';
import React from 'react';

interface PermissionTemplateFiltersProps {
  includeSystem: boolean;
  onIncludeSystemChange: (include: boolean) => void;
}

export const PermissionTemplateFilters: React.FC<PermissionTemplateFiltersProps> = ({
  includeSystem,
  onIncludeSystemChange,
}) => {
  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={includeSystem ? 'all' : 'custom'}
            onChange={(e) => {
              const value = e.target.value;
              onIncludeSystemChange(value === 'all');
            }}
            size="small"
            className="flex-1"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '9px',
                bgcolor: 'white',
                fontSize: '12px',
                height: '40px',
                '& fieldset': {
                  borderColor: '#e7e9e9',
                },
              },
            }}
          >
            <MenuItem value="all">All Templates</MenuItem>
            <MenuItem value="custom">Custom Templates Only</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};
