'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import CompareApplicationsModal from './CompareApplicationsModal';

const CompareApplicationsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={() => setIsModalOpen(true)}
      >
        Compare Applications
      </Button>
      <CompareApplicationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CompareApplicationsButton;