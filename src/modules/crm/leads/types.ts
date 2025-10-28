export interface Lead {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: 'hot' | 'warm' | 'cold';
  assignedTo: string;
  assignedToAvatar: string;
  lastContact: Date;
  nextFollowUp: string;
  source: string;
  deal_value: string;
  status: string;
  aiHighlights: string[];
  responseTime: string;
}

export interface SalesTeamMember {
  id: string;
  name: string;
  avatar: string;
}
