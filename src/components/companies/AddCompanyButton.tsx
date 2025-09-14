'use client';

import React, { useState } from 'react';
import { useCompanies } from '@/context/CompaniesContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input, { Textarea } from '@/components/ui/Input';

const CompanyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addCompany } = useCompanies();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    size: '',
    industry: '',
    notes: '',
    tagsInput: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    // Parse tags from comma-separated input
    const tags = formData.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    addCompany({
      name: formData.name.trim(),
      website: formData.website.trim() || undefined,
      location: formData.location.trim() || undefined,
      size: formData.size.trim() || undefined,
      industry: formData.industry.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      tags
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Company Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter company name"
      />
      
      <Input
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        onChange={handleChange}
        placeholder="https://company.com"
      />
      
      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="San Francisco, CA"
      />
      
      <Input
        label="Company Size"
        name="size"
        value={formData.size}
        onChange={handleChange}
        placeholder="e.g., 1-10, 11-50, 51-200, 201-500, 500+"
      />
      
      <Input
        label="Industry"
        name="industry"
        value={formData.industry}
        onChange={handleChange}
        placeholder="e.g., Fintech, Healthcare, E-commerce"
      />
      
      <Input
        label="Tags"
        name="tagsInput"
        value={formData.tagsInput}
        onChange={handleChange}
        placeholder="e.g., React, TypeScript, Remote, Startup (comma-separated)"
        help="Enter skills or keywords that describe what this company is looking for, separated by commas"
      />
      
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Any additional notes about the company..."
        rows={3}
      />
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Company
        </Button>
      </div>
    </form>
  );
};

const AddCompanyButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Add Company
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Company"
      >
        <CompanyForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default AddCompanyButton;