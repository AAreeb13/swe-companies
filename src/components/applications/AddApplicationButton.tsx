'use client';

import React, { useState } from 'react';
import { useCompanies } from '@/context/CompaniesContext';
import { ApplicationStatus, ApplicationPriority } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input, { Textarea, Select } from '@/components/ui/Input';

interface ApplicationFormProps {
  companyId: string;
  onClose: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ companyId, onClose }) => {
  const { addApplication } = useCompanies();
  const [formData, setFormData] = useState({
    position: '',
    status: 'applied' as ApplicationStatus,
    dateApplied: new Date().toISOString().split('T')[0],
    notes: '',
    brainstorming: '',
    applicationUrl: '',
    priority: 'medium' as ApplicationPriority,
    coverLetter: '',
    tagsInput: ''
  });

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position.trim()) return;
    
    // Parse tags from comma-separated input
    const tags = formData.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    addApplication(companyId, {
      position: formData.position.trim(),
      status: formData.status,
      dateApplied: formData.dateApplied,
      notes: formData.notes.trim(),
      brainstorming: formData.brainstorming.trim(),
      applicationUrl: formData.applicationUrl.trim() || undefined,
      priority: formData.priority,
      coverLetter: formData.coverLetter.trim() || undefined,
      tags
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Position *"
        name="position"
        value={formData.position}
        onChange={handleChange}
        required
        placeholder="e.g., Software Engineer, Frontend Developer"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
        
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date Applied"
          name="dateApplied"
          type="date"
          value={formData.dateApplied}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Application URL"
          name="applicationUrl"
          type="url"
          value={formData.applicationUrl}
          onChange={handleChange}
          placeholder="https://company.com/jobs/123"
        />
      </div>
      
      <Input
        label="Tags"
        name="tagsInput"
        value={formData.tagsInput}
        onChange={handleChange}
        placeholder="e.g., React, TypeScript, Remote, Senior (comma-separated)"
        help="Enter skills, keywords, or tags for this specific application, separated by commas"
      />
      
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Any notes about the application, interview process, etc..."
        rows={3}
      />
      
      <Textarea
        label="Brainstorming"
        name="brainstorming"
        value={formData.brainstorming}
        onChange={handleChange}
        placeholder="Ideas, questions to ask, research notes, salary expectations..."
        rows={4}
      />
      
      <Textarea
        label="Cover Letter"
        name="coverLetter"
        value={formData.coverLetter}
        onChange={handleChange}
        placeholder="Your cover letter content for this specific application..."
        rows={6}
      />
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Application
        </Button>
      </div>
    </form>
  );
};

interface AddApplicationButtonProps {
  companyId: string;
}

const AddApplicationButton: React.FC<AddApplicationButtonProps> = ({ companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsModalOpen(true)}>
        Add Application
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Application"
      >
        <ApplicationForm companyId={companyId} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default AddApplicationButton;