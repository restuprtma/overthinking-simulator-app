import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@venturo/react-ui';
import { StatsCards } from '../components/StatsCards';
import { LeadDistributionCard } from '../components/LeadDistributionCard';
import { LeadSourceCard } from '../components/LeadSourceCard';
import { SalesPerformanceCard } from '../components/SalesPerformanceCard';
import { LeadInfoModal } from '../components/LeadInfoModal';
import { PerformanceModal } from '../components/PerformanceModal';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * DashboardPage Component
 * Main CRM Dashboard with sales metrics, lead distribution, and performance tracking
 */
const DashboardPage: React.FC = () => {
  const {
    dateFilter,
    salesFilter,
    setDateFilter,
    setSalesFilter,
    statsData,
    leadDistribution,
    leadSourceData,
    salesPerformanceData,
  } = useDashboardData();

  const [isLeadInfoModalOpen, setIsLeadInfoModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Filters */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Sales Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monitor performa tim sales dan insights real-time
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Date Filter */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Filter Tanggal</InputLabel>
            <Select
              value={dateFilter}
              label="Filter Tanggal"
              onChange={(e) => setDateFilter(e.target.value as any)}
            >
              <MenuItem value="today">Hari Ini</MenuItem>
              <MenuItem value="week">Minggu Ini</MenuItem>
              <MenuItem value="month">Bulan Ini</MenuItem>
            </Select>
          </FormControl>

          {/* Sales Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter Sales</InputLabel>
            <Select
              value={salesFilter}
              label="Filter Sales"
              onChange={(e) => setSalesFilter(e.target.value as any)}
            >
              <MenuItem value="all">Semua Sales</MenuItem>
              <MenuItem value="ahmad">Ahmad</MenuItem>
              <MenuItem value="sari">Sari</MenuItem>
              <MenuItem value="budi">Budi</MenuItem>
              <MenuItem value="linda">Linda</MenuItem>
              <MenuItem value="eko">Eko</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Stats Cards Section */}
      <Box sx={{ mb: 3 }}>
        <StatsCards data={statsData} />
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <LeadDistributionCard
          data={leadDistribution}
          onInfoClick={() => setIsLeadInfoModalOpen(true)}
        />
        <LeadSourceCard data={leadSourceData} />
      </Box>

      {/* Sales Performance Section */}
      <SalesPerformanceCard
        data={salesPerformanceData}
        onInfoClick={() => setIsPerformanceModalOpen(true)}
      />

      {/* Modals */}
      <LeadInfoModal
        open={isLeadInfoModalOpen}
        onClose={() => setIsLeadInfoModalOpen(false)}
      />
      <PerformanceModal
        open={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
      />
    </Box>
  );
};

export default DashboardPage;
