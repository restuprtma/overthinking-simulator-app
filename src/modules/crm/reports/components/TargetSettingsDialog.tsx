import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from '@venturo/react-ui';
import {
  IconTarget,
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
  IconPlus,
  IconMinus,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

interface TargetSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (targets: MonthTarget[]) => void;
}

interface MonthTarget {
  month: string;
  year: number;
  teamTarget: number;
  individualTargets: SalesPersonTarget[];
}

interface SalesPersonTarget {
  name: string;
  target: number;
}

export const TargetSettingsDialog: React.FC<TargetSettingsDialogProps> = ({ open, onClose, onSave }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showIndividualTargets, setShowIndividualTargets] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  // Generate all 12 months for the selected year
  const generateMonthsForYear = (year: number): MonthTarget[] => {
    const months: MonthTarget[] = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let i = 0; i < 12; i++) {
      months.push({
        month: monthNames[i],
        year: year,
        teamTarget: 8000000000, // Default 8 Billion
        individualTargets: [
          { name: 'Ahmad', target: 2500000000 },
          { name: 'Sari', target: 2200000000 },
          { name: 'Linda', target: 2000000000 },
          { name: 'Budi', target: 1800000000 },
          { name: 'Eko', target: 1500000000 }
        ]
      });
    }
    return months;
  };

  const [monthTargets, setMonthTargets] = useState<MonthTarget[]>(generateMonthsForYear(selectedYear));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: amount >= 1000000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const formatInputCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const parseInputValue = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  // Update handlers
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    setMonthTargets(generateMonthsForYear(newYear));
  };

  const updateMonthTeamTarget = (monthIndex: number, target: number) => {
    const updated = [...monthTargets];
    updated[monthIndex].teamTarget = target;

    // If individual targets are shown, auto-distribute the new team target
    if (showIndividualTargets) {
      const totalIndividual = updated[monthIndex].individualTargets.reduce((sum, person) => sum + person.target, 0);
      if (totalIndividual > 0) {
        const ratio = target / totalIndividual;
        updated[monthIndex].individualTargets = updated[monthIndex].individualTargets.map(person => ({
          ...person,
          target: Math.round(person.target * ratio)
        }));
      }
    }

    setMonthTargets(updated);
  };

  const updateIndividualTarget = (monthIndex: number, personIndex: number, target: number) => {
    const updated = [...monthTargets];
    updated[monthIndex].individualTargets[personIndex].target = target;
    setMonthTargets(updated);
  };

  const updatePersonName = (monthIndex: number, personIndex: number, name: string) => {
    const updated = [...monthTargets];
    updated[monthIndex].individualTargets[personIndex].name = name;
    setMonthTargets(updated);
  };

  const addPersonToMonth = (monthIndex: number) => {
    const updated = [...monthTargets];
    updated[monthIndex].individualTargets.push({ name: '', target: 0 });
    setMonthTargets(updated);
  };

  const removePersonFromMonth = (monthIndex: number, personIndex: number) => {
    const updated = [...monthTargets];
    updated[monthIndex].individualTargets = updated[monthIndex].individualTargets.filter((_, i) => i !== personIndex);
    setMonthTargets(updated);
  };

  const getTotalIndividualForMonth = (monthIndex: number) => {
    return monthTargets[monthIndex].individualTargets.reduce((sum, person) => sum + person.target, 0);
  };

  const getTotalTargetsSum = () => {
    return monthTargets.reduce((sum, month) => sum + month.teamTarget, 0);
  };

  const toggleMonthExpand = (monthIndex: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthIndex)) {
      newExpanded.delete(monthIndex);
    } else {
      newExpanded.add(monthIndex);
    }
    setExpandedMonths(newExpanded);
  };

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 2; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  const handleSave = () => {
    // Validation logic can be added here
    if (onSave) {
      onSave(monthTargets);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle onClose={onClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconTarget size={20} />
          <span>Set Sales Targets - Multiple Months</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Summary Card */}
          <Card sx={{ bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconCalendar size={20} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Annual Target Summary - {selectedYear}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      All 12 months configured
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {formatCurrency(getTotalTargetsSum())}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Avg: {formatCurrency(getTotalTargetsSum() / 12)}/month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Individual Targets Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconUsers size={20} />
              <Typography variant="subtitle2" fontWeight={600}>
                Individual Targets (Optional)
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setShowIndividualTargets(!showIndividualTargets)}
            >
              {showIndividualTargets ? 'Hide Individual Targets' : 'Set Individual Targets'}
            </Button>
          </Box>

          {/* Year Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Monthly Targets</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Year:</Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select value={selectedYear.toString()} onChange={(e) => handleYearChange(e.target.value as string)}>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Monthly Targets List */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {monthTargets.map((month, monthIndex) => {
              const isExpanded = expandedMonths.has(monthIndex);
              return (
                <Card key={`${month.month}-${month.year}`}>
                  <CardHeader
                    title={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                        onClick={() => toggleMonthExpand(monthIndex)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {isExpanded ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
                          <IconCurrencyDollar size={18} />
                          <Typography variant="subtitle1">{month.month}</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {formatCurrency(month.teamTarget)}
                        </Typography>
                      </Box>
                    }
                    sx={{ pb: isExpanded ? 2 : 0 }}
                  />
                  {isExpanded && (
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0 }}>
                  {/* Team Target */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={500}>
                      Team Target
                    </Typography>
                    <Box sx={{ position: 'relative', width: 200 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'text.secondary',
                          zIndex: 1,
                        }}
                      >
                        Rp
                      </Typography>
                      <TextField
                        type="text"
                        size="small"
                        placeholder="8,000,000,000"
                        value={formatInputCurrency(month.teamTarget)}
                        onChange={(e) => updateMonthTeamTarget(monthIndex, parseInputValue(e.target.value))}
                        sx={{
                          '& input': {
                            paddingLeft: '32px',
                            textAlign: 'right',
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Individual Targets */}
                  {showIndividualTargets && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={500}>
                          Individual Breakdown
                        </Typography>
                        <Button
                          variant="outlined"
                          size="sm"
                          onClick={() => addPersonToMonth(monthIndex)}
                          startIcon={<IconPlus size={14} />}
                        >
                          Add Person
                        </Button>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {month.individualTargets.map((person, personIndex) => (
                          <Box
                            key={personIndex}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                            }}
                          >
                            <TextField
                              size="small"
                              placeholder="Sales Person Name"
                              value={person.name}
                              onChange={(e) => updatePersonName(monthIndex, personIndex, e.target.value)}
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              size="small"
                              placeholder="Target Amount"
                              value={person.target > 0 ? formatInputCurrency(person.target) : ''}
                              onChange={(e) => updateIndividualTarget(monthIndex, personIndex, parseInputValue(e.target.value))}
                              sx={{ flex: 1 }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removePersonFromMonth(monthIndex, personIndex)}
                            >
                              <IconMinus size={16} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>

                      {/* Individual Summary */}
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Individual Total:</Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {formatCurrency(getTotalIndividualForMonth(monthIndex))}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Team Target:</Typography>
                          <Typography variant="caption" fontWeight={600} color="primary">
                            {formatCurrency(month.teamTarget)}
                          </Typography>
                        </Box>
                        {getTotalIndividualForMonth(monthIndex) !== month.teamTarget && (
                          <Box
                            sx={{
                              mt: 1,
                              p: 1,
                              bgcolor: 'warning.lighter',
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'warning.main',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                              <IconAlertCircle size={16} color="#eab308" />
                              <Typography variant="caption" color="warning.dark">
                                Individual targets must equal team target. Difference:{' '}
                                {formatCurrency(Math.abs(getTotalIndividualForMonth(monthIndex) - month.teamTarget))}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              )}
            </Card>
              );
            })}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="grey" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="solid" color="primary" onClick={handleSave}>
          Save All Targets
        </Button>
      </DialogActions>
    </Dialog>
  );
};
