import React from 'react';
import { CardContent, Chip, InputAdornment, Typography, TextField } from '@venturo/react-ui';
import { IconSearch } from '@tabler/icons-react';
import type { Chat } from '../types';
import moment from 'moment';

interface ChatSessionListProps {
  chats: Chat[];
  selectedChat: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onChatSelect: (chatId: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

const formatTimestamp = (timestamp: string | null): string => {
  if (!timestamp) return '';

  const messageDate = moment(timestamp);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  if (messageDate.isSame(today, 'day')) {
    return messageDate.format('HH:mm');
  }

  if (messageDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }

  return messageDate.format('DD/MM/YYYY');
};

export const ChatSessionList: React.FC<ChatSessionListProps> = ({
  chats,
  selectedChat,
  searchTerm,
  onSearchChange,
  onChatSelect,
  hasMore,
  onLoadMore,
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-175px)]">
      {/* Search Box - Sticky */}
      <div className="pb-3 px-3 pt-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <TextField
          fullWidth
          size="small"
          placeholder="Search customer or number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Chat List - Scrollable */}
      <CardContent sx={{ p: 0 }} className="flex-1 overflow-y-auto">
        <div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                selectedChat === chat.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {/* Customer Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {chat.customer_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {chat.phone}
                  </Typography>
                </div>

                <div className="text-right">
                  <Typography variant="caption" color="text.secondary" className="block">
                    {formatTimestamp(chat.last_message_at)}
                  </Typography>
                  {chat.unread_count > 0 && (
                    <Chip
                      label={chat.unread_count}
                      size="small"
                      color="error"
                      sx={{ height: 18, minWidth: 18, fontSize: '0.65rem' }}
                    />
                  )}
                </div>
              </div>

              {/* Last Message */}
              <div className="mb-2">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {chat.last_message_preview || 'No messages yet'}
                </Typography>
              </div>

              {/* Status, AI Score, and Tags */}
              {/* <div className="flex flex-wrap gap-1">
                {chat.category && (
                  <Chip
                    label={chat.category.toUpperCase()}
                    color={getStatusColor(chat.category)}
                    size="small"
                  />
                )}
                {chat.sentiment_score !== null && (
                  <Chip
                    label={
                      <div className="flex items-center gap-1">
                        <IconBolt size={12} />
                        <span>{(chat.sentiment_score * 100).toFixed(0)}%</span>
                      </div>
                    }
                    size="small"
                    color="default"
                  />
                )}
                {chat.tags && chat.tags.slice(0, 2).map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </div> */}
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div
              onClick={onLoadMore}
              className="p-4 text-center cursor-pointer text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Typography variant="body2">Load More ({chats.length} more)</Typography>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
