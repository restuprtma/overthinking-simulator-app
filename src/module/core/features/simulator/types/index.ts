// ----------------------------------------------------------------------

export interface Distortion {
  id: string;
  intensity: number;
}

export interface DialogTurn {
  speaker: 'cemas' | 'realistis';
  text: string;
  timestamp?: string;
}

export type ConversationState = 'initial' | 'continued' | 'final';

export interface Reflection {
  id: string;
  user_id: string;
  thought: string;
  detected_distortions: Distortion[];
  core_fear: string;
  dialog: DialogTurn[];
  actionable_suggestion: string;
  safety_triggered: boolean;
  safety_response?: string | null;
  conversation_state: ConversationState;
  total_turns: number;
  created_at: string;
}

export interface ReflectionSummary {
  id: string;
  thought: string;
  safety_triggered: boolean;
  conversation_state: ConversationState;
  total_turns: number;
  created_at: string;
}

export interface GroqCredential {
  key: string;
  model: string;
}

export interface ContinueRequest {
  user_message: string;
}

export interface ContinueResponse {
  new_turn: DialogTurn;
  dialog_updated: DialogTurn[];
  conversation_state: ConversationState;
  total_turns: number;
}
