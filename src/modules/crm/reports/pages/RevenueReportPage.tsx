import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button, LinearProgress, Avatar, Box, Typography, Select, MenuItem, FormControl } from '@venturo/react-ui';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconCurrencyDollar,
  IconAward,
  IconChartBar,
  IconDownload,
  IconAlertCircle,
  IconCircleCheck,
  IconUsers,
} from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useRevenueReport } from '../hooks/useRevenueReport';
import { TargetSettingsDialog } from '../components/TargetSettingsDialog';

const RevenueReportPage: React.FC = () => {
  const {
    timeFilter,
    setTimeFilter,
    salesFilter,
    setSalesFilter,
    comparisonFilter,
    setComparisonFilter,
    revenueData,
    salesPersonData,
    summaryStats,
    overallAchievement,
    formatCurrency,
    formatCompact,
  } = useRevenueReport();

  const [showTargetSettings, setShowTargetSettings] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', lg: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Revenue vs Target Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analisis mendalam performa revenue vs target dengan breakdown per sales person
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as any)}>
              <MenuItem value="last3Months">3 Bulan Terakhir</MenuItem>
              <MenuItem value="last6Months">6 Bulan Terakhir</MenuItem>
              <MenuItem value="last12Months">12 Bulan Terakhir</MenuItem>
              <MenuItem value="thisYear">Tahun Ini</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={salesFilter} onChange={(e) => setSalesFilter(e.target.value as string)}>
              <MenuItem value="all">Semua Sales</MenuItem>
              <MenuItem value="ahmad">Ahmad</MenuItem>
              <MenuItem value="sari">Sari</MenuItem>
              <MenuItem value="linda">Linda</MenuItem>
              <MenuItem value="budi">Budi</MenuItem>
              <MenuItem value="eko">Eko</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="sm"
            startIcon={<IconTarget size={16} />}
            onClick={() => setShowTargetSettings(true)}
          >
            Set Target
          </Button>

          <Button variant="outlined" size="sm" startIcon={<IconDownload size={16} />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #e34234 0%, #ff6b6b 100%)', color: 'white' }}>
          <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="white">Overall Achievement</Typography>
            <IconTarget size={24} />
          </Box>} />
          <CardContent>
            <Typography variant="h3" fontWeight={700}>{overallAchievement}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {overallAchievement >= 100 ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {overallAchievement >= 100 ? 'Above' : 'Below'} Target
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Total Revenue</Typography>
            <IconCurrencyDollar size={24} color="#16a34a" />
          </Box>} />
          <CardContent>
            <Typography variant="h6" fontWeight={700}>{formatCurrency(summaryStats.totalRevenue)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconTrendingUp size={16} color="#16a34a" />
              <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                YoY: +{summaryStats.yearOverYearGrowth.toFixed(1)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Best Month</Typography>
            <IconAward size={24} color="#eab308" />
          </Box>} />
          <CardContent>
            <Typography variant="h6" fontWeight={700}>{summaryStats.bestMonth.month}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconCircleCheck size={16} color="#16a34a" />
              <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                {summaryStats.bestMonth.percentage}% achieved
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Months Above Target</Typography>
            <IconChartBar size={24} color="#3b82f6" />
          </Box>} />
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              {summaryStats.monthsAboveTarget}/{revenueData.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round((summaryStats.monthsAboveTarget / revenueData.length) * 100)}% success rate
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Revenue vs Target Chart */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader
          title="Monthly Revenue vs Target Trend"
          action={
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={comparisonFilter} onChange={(e) => setComparisonFilter(e.target.value as any)}>
                <MenuItem value="monthOverMonth">Month over Month</MenuItem>
                <MenuItem value="yearOverYear">Year over Year</MenuItem>
                <MenuItem value="cumulative">Cumulative</MenuItem>
              </Select>
            </FormControl>
          }
        />
        <CardContent>
          <Box sx={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E34234" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E34234" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A65" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF8A65" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(value) => `${value}M`} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `Rp ${formatCompact(value)}`,
                    name === 'revenue' ? 'Actual Revenue' : name === 'target' ? 'Target' : 'Previous Year',
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E34234" strokeWidth={3} fill="url(#revenueGradient)" dot={{ fill: '#E34234', r: 6 }} />
                <Area type="monotone" dataKey="target" stroke="#FF8A65" strokeWidth={3} strokeDasharray="8 8" fill="url(#targetGradient)" dot={{ fill: '#FF8A65', r: 6 }} />
                {comparisonFilter === 'yearOverYear' && (
                  <Area type="monotone" dataKey="previousYear" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="none" dot={{ fill: '#94a3b8', r: 4 }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Monthly Performance Breakdown */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader title="Monthly Performance Breakdown" />
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2 }}>
            {revenueData.map((month, index) => (
              <Card
                key={index}
                elevation={1}
                sx={{
                  borderLeft: 4,
                  borderColor:
                    month.percentage >= 110 ? 'success.main' : month.percentage >= 100 ? 'info.main' : month.percentage >= 90 ? 'warning.main' : 'error.main',
                  bgcolor: month.percentage >= 110 ? 'success.lighter' : month.percentage >= 100 ? 'info.lighter' : month.percentage >= 90 ? 'warning.lighter' : 'error.lighter',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {month.month}
                    </Typography>
                    <Badge
                      badgeContent={`${month.percentage}%`}
                      color={month.percentage >= 110 ? 'success' : month.percentage >= 100 ? 'info' : month.percentage >= 90 ? 'warning' : 'error'}
                      sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none' } }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Revenue</Typography>
                      <Typography variant="caption" fontWeight={600}>{formatCompact(month.revenue)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Target</Typography>
                      <Typography variant="caption">{formatCompact(month.target)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Difference</Typography>
                      <Typography variant="caption" fontWeight={600} color={month.difference >= 0 ? 'success.main' : 'error.main'}>
                        {month.difference >= 0 ? '+' : ''}{formatCompact(month.difference)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Sales Person Performance */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader title="Sales Person Performance vs Target" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {salesPersonData.map((person, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{person.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{person.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {person.deals} deals • {formatCurrency(person.avgDeal)} avg
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={600}>{formatCurrency(person.revenue * 1000000)}</Typography>
                    <Typography variant="caption" color="text.secondary">Target: {formatCurrency(person.target * 1000000)}</Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {person.percentage >= 100 ? <IconCircleCheck size={16} color="#16a34a" /> : <IconAlertCircle size={16} color="#dc2626" />}
                      <Badge
                        badgeContent={`${person.percentage}%`}
                        color={person.percentage >= 110 ? 'success' : person.percentage >= 100 ? 'info' : person.percentage >= 90 ? 'warning' : 'error'}
                        sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none' } }}
                      />
                    </Box>
                    <Typography variant="caption" color={person.percentage >= 100 ? 'success.main' : 'error.main'}>
                      {person.percentage >= 100 ? '+' : ''}{formatCurrency((person.revenue - person.target) * 1000000)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 96 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(person.percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: person.percentage >= 110 ? 'success.main' : person.percentage >= 100 ? 'info.main' : person.percentage >= 90 ? 'warning.main' : 'error.main',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        <Card elevation={2}>
          <CardHeader title="Achievement Distribution" />
          <CardContent>
            <Box sx={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Achievement']} />
                  <Bar dataKey="percentage" fill="#E34234" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardHeader title="Key Insights" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2, border: 1, borderColor: 'success.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconCircleCheck size={20} color="#16a34a" />
                  <Typography variant="subtitle2" fontWeight={600} color="success.dark">Strong Performance</Typography>
                </Box>
                <Typography variant="body2" color="success.dark">
                  Overall achievement of {overallAchievement}% shows excellent performance with consistent growth trajectory.
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, border: 1, borderColor: 'info.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconTrendingUp size={20} color="#3b82f6" />
                  <Typography variant="subtitle2" fontWeight={600} color="info.dark">Growth Trend</Typography>
                </Box>
                <Typography variant="body2" color="info.dark">
                  Year-over-year growth of +{summaryStats.yearOverYearGrowth.toFixed(1)}% indicates strong business expansion.
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 2, border: 1, borderColor: 'warning.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconAlertCircle size={20} color="#eab308" />
                  <Typography variant="subtitle2" fontWeight={600} color="warning.dark">Area for Improvement</Typography>
                </Box>
                <Typography variant="body2" color="warning.dark">
                  Focus on months with lower achievement rates. {summaryStats.worstMonth.month} had the lowest performance at {summaryStats.worstMonth.percentage}%.
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'secondary.lighter', borderRadius: 2, border: 1, borderColor: 'secondary.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconUsers size={20} color="#9333ea" />
                  <Typography variant="subtitle2" fontWeight={600}>Top Performer</Typography>
                </Box>
                <Typography variant="body2">
                  {salesPersonData[0].name} leads the team with {salesPersonData[0].percentage}% target achievement.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quarterly Summary */}
      <Card elevation={2}>
        <CardHeader title="Quarterly Performance Summary" />
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, qIndex) => {
              const quarterData = revenueData.slice(qIndex * 3, (qIndex + 1) * 3);
              const qRevenue = quarterData.reduce((sum, month) => sum + month.revenue, 0);
              const qTarget = quarterData.reduce((sum, month) => sum + month.target, 0);
              const qPercentage = Math.round((qRevenue / qTarget) * 100);

              return (
                <Card
                  key={quarter}
                  elevation={1}
                  sx={{
                    borderLeft: 4,
                    borderColor: qPercentage >= 110 ? 'success.main' : qPercentage >= 100 ? 'info.main' : qPercentage >= 90 ? 'warning.main' : 'error.main',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>{quarter}</Typography>
                    <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>{qPercentage}%</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatCompact(qRevenue)} / {formatCompact(qTarget)}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color={qPercentage >= 100 ? 'success.main' : 'error.main'} display="block" sx={{ mt: 0.5 }}>
                      {qPercentage >= 100 ? '+' : ''}{formatCompact(qRevenue - qTarget)} vs target
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Target Settings Dialog */}
      <TargetSettingsDialog
        open={showTargetSettings}
        onClose={() => setShowTargetSettings(false)}
        onSave={(targets) => {
          console.log('Saving targets:', targets);
          // TODO: Implement save target logic to backend
        }}
      />
    </Box>
  );
};

export default RevenueReportPage;
