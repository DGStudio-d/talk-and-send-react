import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { QuizManagement } from '../../components/QuizManagement';

// Mock languages data - in real app this would come from API
const mockLanguages = [
  { id: 1, name: 'English', code: 'en' },
  { id: 2, name: 'Spanish', code: 'es' },
  { id: 3, name: 'French', code: 'fr' },
  { id: 4, name: 'German', code: 'de' },
  { id: 5, name: 'Arabic', code: 'ar' },
  { id: 6, name: 'Chinese', code: 'zh' },
];

export const AdminQuizManagementPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Quiz Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create, edit, and manage quizzes for your language learning platform
        </Typography>
      </Box>
      
      <QuizManagement languages={mockLanguages} />
    </Container>
  );
};

export default AdminQuizManagementPage;