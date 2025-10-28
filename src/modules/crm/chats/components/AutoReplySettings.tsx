import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Button,
  Switch,
  Tooltip,
  Typography,
} from '@venturo/react-ui';
import {
  IconSettings,
  IconMessageCircle,
  IconPlus,
  IconTrash,
  IconEdit,
  IconClock,
  IconRobot,
} from '@tabler/icons-react';
import { useAutoReply } from '../hooks/useAutoReply';
import { AutoReplyForm } from './AutoReplyForm';

interface AutoReplySettingsProps {
  open: boolean;
  onClose: () => void;
}

export const AutoReplySettings: React.FC<AutoReplySettingsProps> = ({ open, onClose }) => {
  const {
    autoReplyRules,
    globalEnabled,
    editingRule,
    showNewRuleForm,
    stats,
    handleToggleGlobal,
    handleToggleRule,
    handleDeleteRule,
    handleSaveRule,
    handleEditRule,
    handleCancelEdit,
    handleShowNewRuleForm,
  } = useAutoReply();

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle onClose={onClose}>Auto-Reply Settings & AI Training</DialogTitle>

        <DialogContent>
          <div className="space-y-6">
            {/* Header with Global Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IconRobot size={24} className="text-primary-500" />
                <div>
                  <Typography variant="body1" fontWeight={600}>
                    AI Auto-Reply System
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Manage automated responses and AI training data
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="body2" color="textSecondary">
                  {globalEnabled ? 'Active' : 'Inactive'}
                </Typography>
                <Switch checked={globalEnabled} onChange={(e) => handleToggleGlobal(e.target.checked)} />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        Total Rules
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {stats.totalRules}
                      </Typography>
                    </div>
                    <IconSettings size={28} className="text-primary-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        Active Rules
                      </Typography>
                      <Typography variant="h5" fontWeight={700} className="text-green-600">
                        {stats.activeRules}
                      </Typography>
                    </div>
                    <IconRobot size={28} className="text-green-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        Keywords Detected
                      </Typography>
                      <Typography variant="h5" fontWeight={700} className="text-blue-600">
                        {stats.keywordsDetected}
                      </Typography>
                    </div>
                    <IconClock size={28} className="text-blue-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        Messages Today
                      </Typography>
                      <Typography variant="h5" fontWeight={700} className="text-purple-600">
                        {stats.messagesToday}
                      </Typography>
                    </div>
                    <IconMessageCircle size={28} className="text-purple-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add New Rule Button */}
            <div className="flex justify-between items-center">
              <Typography variant="h6" fontWeight={600}>
                AI Training Data
              </Typography>
              <Button
                variant="solid"
                color="primary"
                size="md"
                onClick={handleShowNewRuleForm}
                className="flex items-center gap-2"
              >
                <IconPlus size={16} />
                Tambah Rule
              </Button>
            </div>

            {/* Rules List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {autoReplyRules.map((rule) => (
                <Card
                  key={rule.id}
                  className={`${rule.enabled ? '' : 'opacity-60'} hover:shadow-md transition-shadow`}
                >
                  <CardContent>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Typography variant="body1" fontWeight={600}>
                            {rule.name}
                          </Typography>
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                            Priority {rule.priority}
                          </span>
                          {rule.enabled && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                              Active
                            </span>
                          )}
                        </div>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="mb-3 line-clamp-2"
                        >
                          {rule.message}
                        </Typography>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <IconClock size={14} />
                            <span>{rule.delay}s delay</span>
                          </div>
                          {rule.conditions.keywords && rule.conditions.keywords.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              {rule.conditions.keywords.slice(0, 3).map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                                >
                                  {keyword}
                                </span>
                              ))}
                              {rule.conditions.keywords.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{rule.conditions.keywords.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          {rule.conditions.timeRange && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span>
                                {rule.conditions.timeRange.start} - {rule.conditions.timeRange.end}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Switch
                          checked={rule.enabled}
                          onChange={() => handleToggleRule(rule.id)}
                          size="small"
                        />
                        <Tooltip title="Edit">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <IconEdit size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <IconTrash size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {autoReplyRules.length === 0 && (
                <div className="text-center py-12">
                  <IconRobot size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <Typography variant="body2" color="textSecondary">
                    Belum ada auto-reply rule. Klik "Tambah Rule" untuk membuat rule baru.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Rule Form */}
      <AutoReplyForm
        open={showNewRuleForm}
        mode="create"
        onClose={handleCancelEdit}
        onSave={handleSaveRule}
      />

      {/* Edit Rule Form */}
      {editingRule && (
        <AutoReplyForm
          open={!!editingRule}
          mode="edit"
          rule={editingRule}
          onClose={handleCancelEdit}
          onSave={handleSaveRule}
        />
      )}
    </>
  );
};
