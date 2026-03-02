import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { getUserId } from '../../utils/auth';
import { createCapsule } from '../../services/capsuleService';

const CreateCapsuleForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: '',
    privacy: '',
    scheduledFor: '',
    isBlockchainSecured: false,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // ... existing validation code ...

      // Create the capsule
      const capsule = await createCapsule({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        type: formData.type,
        privacy: formData.privacy,
        scheduledFor: formData.scheduledFor,
        isBlockchainSecured: formData.isBlockchainSecured,
        userId: getUserId(session)
      });

      if (!capsule) {
        throw new Error('Failed to create capsule');
      }

      toast({
        title: "Time Capsule Created",
        description: "Your encrypted time capsule has been created and scheduled.",
      });
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating capsule:', error);
      toast({
        title: "Failed to create time capsule",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default CreateCapsuleForm; 