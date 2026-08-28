// ----------------------------------------------------------------------

export interface Distortion {
  id: string;
  intensity: number;
}

export interface DialogTurn {
  speaker: 'cemas' | 'realistis';
  text: string;
}

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
  created_at: string;
}

export interface ReflectionSummary {
  id: string;
  thought: string;
  safety_triggered: boolean;
  created_at: string;
}

export interface GeminiCredential {
  key: string;
  model: string;
}
