import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  Typography,
} from '@venturo/react-ui';
import type { AutoReplyRule, AutoReplyTriggerType } from '../types';

interface AutoReplyFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  rule?: AutoReplyRule | null;
  onClose: () => void;
  onSave: (rule: AutoReplyRule) => void;
}

const triggerTypes: { value: AutoReplyTriggerType; label: string }[] = [
  { value: 'first_message', label: 'Kontak Baru - Data Training AI' },
  { value: 'outside_business_hours', label: 'Di Luar Jam Kerja - AI Response' },
  { value: 'keyword_match', label: 'Deteksi Keyword - AI Analysis' },
  { value: 'no_sales_available', label: 'Sales Unavailable - AI Takeover' },
  { value: 'high_priority_lead', label: 'Lead Priority Tinggi - AI Alert' },
  { value: 'ai_confidence_low', label: 'AI Confidence Rendah - Human Handoff' },
  { value: 'conversation_flow', label: 'Flow Conversation - AI Learning' },
];

export const AutoReplyForm: React.FC<AutoReplyFormProps> = ({
  open,
  mode,
  rule,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AutoReplyRule>({
    id: '',
    name: '',
    enabled: true,
    trigger: 'first_message',
    message: '',
    conditions: {},
    delay: 30,
    priority: 1,
  });

  useEffect(() => {
    if (rule && mode === 'edit') {
      setFormData(rule);
    } else {
      setFormData({
        id: '',
        name: '',
        enabled: true,
        trigger: 'first_message',
        message: '',
        conditions: {},
        delay: 30,
        priority: 1,
      });
    }
  }, [rule, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      id: '',
      name: '',
      enabled: true,
      trigger: 'first_message',
      message: '',
      conditions: {},
      delay: 30,
      priority: 1,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Tambah Auto-Reply Rule' : 'Edit Auto-Reply Rule'}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 pt-4">
            {/* Rule Name */}
            <div className="flex flex-col gap-2">
              <Typography variant="body2" fontWeight={500}>
                Nama Rule
              </Typography>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Welcome Message"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
              />
            </div>

            {/* Trigger Type */}
            <div className="flex flex-col gap-2">
              <Typography variant="body2" fontWeight={500}>
                Trigger Type
              </Typography>
              <select
                value={formData.trigger}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trigger: e.target.value as AutoReplyTriggerType,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
              >
                {triggerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <Typography variant="body2" fontWeight={500}>
                Pesan AI Response & Training Data
              </Typography>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Tulis response untuk customer dan training data untuk AI..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
              />
              <Typography variant="caption" color="textSecondary">
                Tips: Pesan ini akan digunakan untuk training AI dan sebagai response otomatis.
                Gunakan bahasa yang natural dan professional.
              </Typography>
            </div>

            {/* Conditional Fields - Keywords */}
            {formData.trigger === 'keyword_match' && (
              <div className="flex flex-col gap-2">
                <Typography variant="body2" fontWeight={500}>
                  Kata Kunci untuk AI Analysis
                </Typography>
                <input
                  type="text"
                  placeholder="Masukkan kata kunci untuk deteksi AI, pisahkan dengan koma"
                  value={formData.conditions.keywords?.join(', ') || ''}
                  onChange={(e) => {
                    const keywords = e.target.value
                      .split(',')
                      .map((k) => k.trim())
                      .filter((k) => k);
                    setFormData((prev) => ({
                      ...prev,
                      conditions: { ...prev.conditions, keywords },
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                />
                <Typography variant="caption" color="textSecondary">
                  AI akan menganalisis pesan customer dan mendeteksi kata kunci ini untuk trigger
                  response yang tepat.
                </Typography>
              </div>
            )}

            {/* Conditional Fields - Time Range */}
            {formData.trigger === 'outside_business_hours' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography variant="body2" fontWeight={500}>
                    Jam Mulai
                  </Typography>
                  <input
                    type="time"
                    value={formData.conditions.timeRange?.start || '09:00'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: {
                          ...prev.conditions,
                          timeRange: {
                            ...prev.conditions.timeRange,
                            start: e.target.value,
                            end: prev.conditions.timeRange?.end || '17:00',
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="body2" fontWeight={500}>
                    Jam Selesai
                  </Typography>
                  <input
                    type="time"
                    value={formData.conditions.timeRange?.end || '17:00'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: {
                          ...prev.conditions,
                          timeRange: {
                            ...prev.conditions.timeRange,
                            start: prev.conditions.timeRange?.start || '09:00',
                            end: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Delay & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Typography variant="body2" fontWeight={500}>
                  Delay (detik)
                </Typography>
                <input
                  type="number"
                  value={formData.delay || 30}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, delay: parseInt(e.target.value) || 30 }))
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="body2" fontWeight={500}>
                  Priority
                </Typography>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) || 1 }))
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                />
                <Typography variant="caption" color="textSecondary">
                  Lower number = higher priority
                </Typography>
              </div>
            </div>

            {/* Enabled Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Typography variant="body2" fontWeight={500}>
                Aktifkan Rule
              </Typography>
              <Switch
                checked={formData.enabled}
                onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
              />
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey">
          Cancel
        </Button>
        <Button type="button" variant="solid" color="primary" onClick={handleSubmit}>
          {mode === 'create' ? 'Simpan Rule' : 'Update Rule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
