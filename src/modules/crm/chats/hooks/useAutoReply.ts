import { useState, useCallback } from 'react';
import type { AutoReplyRule, AutoReplyStats } from '../types';

// Mock auto-reply rules data
const initialRules: AutoReplyRule[] = [
  {
    id: '1',
    name: 'Welcome Message - New Contacts',
    enabled: true,
    trigger: 'first_message',
    message:
      'Halo! Terima kasih sudah menghubungi kami. Tim sales kami akan segera merespons pesan Anda. Untuk informasi lebih lanjut, silakan kunjungi website kami di www.lakukan.com',
    conditions: {},
    delay: 30,
    priority: 1,
  },
  {
    id: '2',
    name: 'Business Hours Auto-Reply',
    enabled: true,
    trigger: 'outside_business_hours',
    message:
      'Terima kasih atas pesan Anda. Saat ini di luar jam kerja kami (09:00-17:00). Tim sales kami akan merespons pesan Anda pada jam kerja berikutnya.',
    conditions: {
      timeRange: {
        start: '17:00',
        end: '09:00',
      },
    },
    delay: 60,
    priority: 2,
  },
  {
    id: '3',
    name: 'Pricing Inquiry Response',
    enabled: true,
    trigger: 'keyword_match',
    message:
      'Halo! Terima kasih atas ketertarikan Anda pada produk kami. Untuk informasi harga dan paket yang tersedia, tim sales kami akan menghubungi Anda segera untuk memberikan penawaran yang sesuai dengan kebutuhan bisnis Anda.',
    conditions: {
      keywords: ['harga', 'price', 'biaya', 'cost', 'paket', 'package'],
    },
    delay: 45,
    priority: 3,
  },
  {
    id: '4',
    name: 'Demo Request Response',
    enabled: true,
    trigger: 'keyword_match',
    message:
      'Terima kasih atas minat Anda untuk melihat demo produk kami! Tim sales kami akan mengatur jadwal demo yang sesuai dengan waktu Anda. Biasanya demo berlangsung 30-45 menit.',
    conditions: {
      keywords: ['demo', 'presentasi', 'lihat produk', 'show product'],
    },
    delay: 20,
    priority: 4,
  },
];

export const useAutoReply = () => {
  const [autoReplyRules, setAutoReplyRules] = useState<AutoReplyRule[]>(initialRules);
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  // Stats - In real app, this would come from API
  const stats: AutoReplyStats = {
    totalRules: autoReplyRules.length,
    activeRules: autoReplyRules.filter((r) => r.enabled).length,
    keywordsDetected: 88, // Mock data
    messagesToday: 247, // Mock data
  };

  const handleToggleGlobal = useCallback((enabled: boolean) => {
    setGlobalEnabled(enabled);
  }, []);

  const handleToggleRule = useCallback((ruleId: string) => {
    setAutoReplyRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    );
  }, []);

  const handleDeleteRule = useCallback((ruleId: string) => {
    setAutoReplyRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  }, []);

  const handleSaveRule = useCallback(
    (rule: AutoReplyRule) => {
      if (editingRule) {
        // Update existing rule
        setAutoReplyRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
        setEditingRule(null);
      } else {
        // Create new rule
        const newRule = { ...rule, id: Date.now().toString() };
        setAutoReplyRules((prev) => [...prev, newRule]);
        setShowNewRuleForm(false);
      }
    },
    [editingRule],
  );

  const handleEditRule = useCallback((rule: AutoReplyRule) => {
    setEditingRule(rule);
    setShowNewRuleForm(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingRule(null);
    setShowNewRuleForm(false);
  }, []);

  const handleShowNewRuleForm = useCallback(() => {
    setShowNewRuleForm(true);
    setEditingRule(null);
  }, []);

  return {
    autoReplyRules: autoReplyRules.sort((a, b) => a.priority - b.priority),
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
  };
};
