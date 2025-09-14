'use client';

import React, { useState } from 'react';
import { Application, ApplicationStatus, ApplicationPriority } from '@/types';
import { useCompanies } from '@/context/CompaniesContext';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';

interface ApplicationCardProps {
  application: Application;
  companyId: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, companyId }) => {
  const { updateApplication, deleteApplication } = useCompanies();
  const [isEditing, setIsEditing] = useState(false);
  const [showBrainstorming, setShowBrainstorming] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [formData, setFormData] = useState({
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied,
    notes: application.notes,
    brainstorming: application.brainstorming,
    applicationUrl: application.applicationUrl || '',
    priority: application.priority,
    coverLetter: application.coverLetter || ''
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

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interviewing': return 'bg-yellow-100 text-yellow-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ApplicationPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplication(companyId, application.id, {
      position: formData.position.trim(),
      status: formData.status,
      dateApplied: formData.dateApplied,
      notes: formData.notes.trim(),
      brainstorming: formData.brainstorming.trim(),
      applicationUrl: formData.applicationUrl.trim() || undefined,
      priority: formData.priority,
      coverLetter: formData.coverLetter.trim() || undefined
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the application for ${application.position}?`)) {
      deleteApplication(companyId, application.id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <form onSubmit={handleSave}>
          <Input
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            
            <Input
              label="Date Applied"
              name="dateApplied"
              type="date"
              value={formData.dateApplied}
              onChange={handleChange}
              required
            />
          </div>
          
          <Input
            label="Application URL"
            name="applicationUrl"
            type="url"
            value={formData.applicationUrl}
            onChange={handleChange}
            placeholder="https://company.com/jobs/123"
          />
          
          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
          />
          
          <Textarea
            label="Brainstorming"
            name="brainstorming"
            value={formData.brainstorming}
            onChange={handleChange}
            rows={3}
          />
          
          <Textarea
            label="Cover Letter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={4}
          />
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h5 className="font-semibold text-lg text-gray-900">{application.position}</h5>
          <p className="text-sm text-gray-600">Applied: {formatDate(application.dateApplied)}</p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
          {application.priority} priority
        </span>
      </div>
      
      {application.applicationUrl && (
        <div className="mb-3">
          <a
            href={application.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            🔗 View Application
          </a>
        </div>
      )}
      
      {application.notes && (
        <div className="mb-3">
          <h6 className="font-medium text-sm text-gray-700 mb-1">Notes:</h6>
          <p className="text-sm text-gray-600">{application.notes}</p>
        </div>
      )}
      
      {application.brainstorming && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h6 className="font-medium text-sm text-gray-700">Brainstorming:</h6>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowBrainstorming(!showBrainstorming)}
            >
              {showBrainstorming ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showBrainstorming && (
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.brainstorming}</p>
            </div>
          )}
        </div>
      )}
      
      {application.coverLetter && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h6 className="font-medium text-sm text-gray-700">Cover Letter:</h6>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowCoverLetter(!showCoverLetter)}
            >
              {showCoverLetter ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showCoverLetter && (
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;