export interface Deal {
  id: string;
  clientName: string;
  contactPerson: string;
  phone: string;
  email: string;
  salesPerson: string;
  salesAvatar: string;
  dealValue: number;
  status: 'Won' | 'Lost';
  closeDate: string;
  duration: string;
  category: string;
  source: string;
  notes: string;
  commission: number;
}
