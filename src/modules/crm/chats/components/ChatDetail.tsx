import React from 'react';
import { Card, CardContent, Tabs, Chip, Box, Typography, Tab } from '@venturo/react-ui';
import { IconMessage, IconBrain, IconAlertCircle, IconCalendar } from '@tabler/icons-react';
import type { Chat, ChatMessage, GroupedMessage } from '../types';
import moment from 'moment';

interface ChatDetailProps {
  chat: Chat | null;
  messages: ChatMessage[];
}

const formatDateBadge = (timestamp: string) => {
  const messageDate = moment(timestamp);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  if (messageDate.isSame(today, 'day')) {
    return 'Hari ini';
  } else if (messageDate.isSame(yesterday, 'day')) {
    return 'Kemarin';
  } else {
    return messageDate.format('DD MMMM YYYY');
  }
};

const groupMessagesByDate = (messages: ChatMessage[]): GroupedMessage[] => {
  const grouped: GroupedMessage[] = [];
  let currentDate = '';

  messages.forEach((message) => {
    const messageDate = moment(message.sent_at).format('YYYY-MM-DD');

    if (messageDate !== currentDate) {
      currentDate = messageDate;
      grouped.push({
        type: 'dateSeparator',
        date: messageDate,
        dateText: formatDateBadge(message.sent_at),
        id: `date-${messageDate}`,
      });
    }

    grouped.push({
      ...message,
      type: 'message',
    });
  });

  return grouped;
};

export const ChatDetail: React.FC<ChatDetailProps> = ({ chat, messages }) => {
  const [tabValue, setTabValue] = React.useState(0);

  if (!chat) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              color: 'text.secondary',
            }}
          >
            <IconMessage size={48} opacity={0.3} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Pilih chat session untuk melihat detail conversation
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Card elevation={2} sx={{ padding: 0 }}>
      <div className="flex flex-row justify-between items-center p-4">
        <Typography variant="subtitle2" fontWeight={600}>
          {chat.customer_name}
        </Typography>

        <div className="flex gap-2 items-center">
          <Chip label={`${chat.message_count} messages`} size="small" />
          {chat.assigned_to && (
            <Chip label={`Sales: ${chat.assigned_to.full_name}`} size="small" />
          )}
          {chat.sentiment_score !== null && (
            <Chip
              icon={<IconBrain size={16} />}
              label={`Sentiment: ${(chat.sentiment_score * 100).toFixed(0)}%`}
              size="small"
              color="secondary"
            />
          )}
        </div>
      </div>

      <Tabs
        variant="fullWidth"
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        className="bg-primary-50"
      >
        <Tab label="Messages" />
        <Tab label="AI Insights" />
      </Tabs>

      <CardContent>
        {tabValue === 0 && (
          <div className="overflow-y-auto px-4 py-2 space-y-3 h-[calc(100vh-280px)]">
            {groupedMessages.map((item, index) => {
              if (item.type === 'dateSeparator') {
                return (
                  <div key={item.id || index} className="flex justify-center my-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                      <IconCalendar size={14} className="text-gray-500" />
                      <span>{item.dateText}</span>
                    </div>
                  </div>
                );
              }

              const isSales = item.sender_type === 'sales';
              const hasAIHighlight = false; // TODO: implement AI highlight from sentiment/tags

              return (
                <div
                  key={item.id}
                  className={`flex ${isSales ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`flex flex-col max-w-[75%] ${isSales ? 'items-end' : 'items-start'}`}
                  >
                    {/* AI Highlight Badge */}
                    {hasAIHighlight && (
                      <div className="flex items-center gap-1 mb-1 px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-md">
                        <IconAlertCircle size={12} className="text-orange-500" />
                        <span className="text-[10px] font-semibold text-orange-700 uppercase tracking-wide">
                          Important
                        </span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`
                        relative px-4 py-2.5 rounded-2xl shadow-sm
                        ${
                          isSales
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : hasAIHighlight
                            ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-400 text-gray-800 rounded-bl-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }
                      `}
                    >
                      {/* Message Text */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {item.content}
                      </p>

                      {/* Timestamp */}
                      <span
                        className={`
                          text-[10px] mt-1 block
                          ${isSales ? 'text-blue-100' : 'text-gray-500'}
                        `}
                      >
                        {item.sent_at ? moment(item.sent_at).format('HH:mm') : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tabValue === 1 && (
          <div className="flex flex-col gap-2 p-4">
            <Card sx={{ bgcolor: 'success.lighter', border: 1, borderColor: 'success.light' }}>
              <CardContent>
                <div className="flex items-center gap-1 mb-1">
                  <IconAlertCircle size={16} color="#16a34a" />
                  <Typography variant="subtitle2" fontWeight={600} color="success.dark">
                    Positive Signals
                  </Typography>
                </div>
                <ul className="pl-6 m-0 text-sm text-green-800 dark:text-green-600 space-y-1 list-disc">
                  <li>Customer mentioned specific budget (50 juta)</li>
                  <li>Urgent timeline indicated (butuh bulan ini)</li>
                  <li>Strong buying signal ("kalau cocok langsung deal")</li>
                  <li>Requested demo and proposal</li>
                </ul>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
              <CardContent>
                <div className="flex items-center gap-1 mb-1">
                  <IconBrain size={16} color="#e34234" />
                  <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                    AI Recommendations
                  </Typography>
                </div>
                <ul className="pl-6 m-0 text-sm text-primary space-y-1 list-disc">
                  <li>Prioritize this lead - high conversion probability (92%)</li>
                  <li>Follow up immediately after demo with proposal</li>
                  <li>Prepare enterprise package details</li>
                  <li>Schedule implementation timeline discussion</li>
                </ul>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'warning.lighter', border: 1, borderColor: 'warning.light' }}>
              <CardContent>
                <div className="flex items-center gap-1 mb-1">
                  <IconAlertCircle size={16} color="#ea580c" />
                  <Typography variant="subtitle2" fontWeight={600} color="warning.dark">
                    Next Actions
                  </Typography>
                </div>
                <ul className="pl-6 m-0 text-sm text-warning-dark space-y-1 list-disc">
                  <li>Demo scheduled for tomorrow 2 PM</li>
                  <li>Prepare detailed proposal with pricing</li>
                  <li>Set follow-up reminder for after demo</li>
                  <li>Prepare implementation timeline</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
