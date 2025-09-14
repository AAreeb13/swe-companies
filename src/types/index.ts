export interface Application {
  id: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  dateApplied: string;
  notes: string;
  brainstorming: string;
  applicationUrl?: string;
  priority: 'low' | 'medium' | 'high';
  coverLetter?: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  location?: string;
  size?: string;
  industry?: string;
  notes?: string;
  tags: string[];
  applications: Application[];
  createdAt: string;
}

export type ApplicationStatus = Application['status'];
export type ApplicationPriority = Application['priority'];