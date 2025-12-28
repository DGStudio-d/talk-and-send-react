import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Pagination,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { useQuizDashboard } from '../hooks/useQuiz';
import { Quiz, QuizLevel, CreateQuizRequest, UpdateQuizRequest } from '../api/types';

const QUIZ_LEVELS: QuizLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface QuizManagementProps {
  languages?: Array<{ id: number; name: string; code: string }>;
}

export const QuizManagement: React.FC<QuizManagementProps> = ({ languages = [] }) => {
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    language_id: undefined as number | undefined,
    level: undefined as QuizLevel | undefined,
    is_active: undefined as boolean | undefined,
  });

  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Use the quiz dashboard hook
  const {
    quizzes,
    pagination,
    loading,
    error,
    refreshQuizzes,
    goToPage,
    nextPage,
    previousPage,
    changePerPage,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    toggleActive,
    duplicateQuiz,
    operationLoading,
    operationError,
    clearOperationError,
    importQuiz,
    importProgress,
    importLoading,
    importError,
    clearImportError,
    exportQuizzes,
    exportLoading,
    exportError,
    clearExportError,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    clearSearch,
  } = useQuizDashboard(filters);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    handleFilterChange('search', query);
  }, [setSearchQuery, handleFilterChange]);

  // Handle create quiz
  const handleCreateQuiz = useCallback(async (data: CreateQuizRequest) => {
    try {
      await createQuiz(data);
      setCreateDialogOpen(false);
      refreshQuizzes();
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  }, [createQuiz, refreshQuizzes]);

  // Handle update quiz
  const handleUpdateQuiz = useCallback(async (id: number, data: UpdateQuizRequest) => {
    try {
      await updateQuiz(id, data);
      setEditDialogOpen(false);
      setSelectedQuiz(null);
      refreshQuizzes();
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  }, [updateQuiz, refreshQuizzes]);

  // Handle delete quiz
  const handleDeleteQuiz = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        refreshQuizzes();
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  }, [deleteQuiz, refreshQuizzes]);

  // Handle toggle active
  const handleToggleActive = useCallback(async (id: number) => {
    try {
      await toggleActive(id);
      refreshQuizzes();
    } catch (error) {
      console.error('Failed to toggle quiz status:', error);
    }
  }, [toggleActive, refreshQuizzes]);

  // Handle duplicate quiz
  const handleDuplicateQuiz = useCallback(async (id: number) => {
    try {
      await duplicateQuiz(id);
      refreshQuizzes();
    } catch (error) {
      console.error('Failed to duplicate quiz:', error);
    }
  }, [duplicateQuiz, refreshQuizzes]);

  // Handle import
  const handleImport = useCallback(async (file: File, languageId?: number) => {
    try {
      const result = await importQuiz(languageId)(file);
      setImportDialogOpen(false);
      refreshQuizzes();
      alert(`Successfully imported ${result.imported_count} quizzes`);
    } catch (error) {
      console.error('Failed to import quizzes:', error);
    }
  }, [importQuiz, refreshQuizzes]);

  // Handle export
  const handleExport = useCallback(async (quizIds?: number[]) => {
    try {
      await exportQuizzes('quizzes.csv', quizIds);
    } catch (error) {
      console.error('Failed to export quizzes:', error);
    }
  }, [exportQuizzes]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Management
      </Typography>

      {/* Error Display */}
      {(error || operationError || importError || exportError) && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => {
            clearOperationError();
            clearImportError();
            clearExportError();
          }}
        >
          {error?.message || operationError?.message || importError?.message || exportError?.message}
        </Alert>
      )}

      {/* Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={filters.language_id || ''}
            onChange={(e) => handleFilterChange('language_id', e.target.value || undefined)}
            label="Language"
          >
            <MenuItem value="">All Languages</MenuItem>
            {languages.map((lang) => (
              <MenuItem key={lang.id} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value || undefined)}
            label="Level"
          >
            <MenuItem value="">All Levels</MenuItem>
            {QUIZ_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.is_active === undefined ? '' : filters.is_active.toString()}
            onChange={(e) => handleFilterChange('is_active', 
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshQuizzes}
          disabled={loading}
        >
          Refresh
        </Button>

        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => setImportDialogOpen(true)}
        >
          Import
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => handleExport()}
          disabled={exportLoading}
        >
          Export All
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Quiz
        </Button>
      </Box>

      {/* Loading Progress */}
      {(loading || operationLoading || importLoading || exportLoading) && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Import Progress */}
      {importLoading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Importing quizzes... {importProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={importProgress} />
        </Box>
      )}

      {/* Quiz Grid */}
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {quiz.title.en}
                  </Typography>
                  <Switch
                    checked={quiz.is_active}
                    onChange={() => handleToggleActive(quiz.id)}
                    size="small"
                  />
                </Box>

                {quiz.description?.en && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {quiz.description.en}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={quiz.level} size="small" color="primary" />
                  {quiz.language && (
                    <Chip label={quiz.language.name} size="small" color="secondary" />
                  )}
                  <Chip 
                    label={`${quiz.questions_count} questions`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${quiz.attempts_count} attempts`} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(quiz.created_at).toLocaleDateString()}
                  </Typography>
                  
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicateQuiz(quiz.id)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination.total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.last_page}
            page={pagination.current_page}
            onChange={(_, page) => goToPage(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Create Quiz Dialog */}
      <QuizFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateQuiz}
        languages={languages}
        title="Create New Quiz"
      />

      {/* Edit Quiz Dialog */}
      <QuizFormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedQuiz(null);
        }}
        onSubmit={(data) => selectedQuiz && handleUpdateQuiz(selectedQuiz.id, data)}
        languages={languages}
        title="Edit Quiz"
        initialData={selectedQuiz}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
        languages={languages}
      />
    </Box>
  );
};

// Quiz Form Dialog Component
interface QuizFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuizRequest | UpdateQuizRequest) => void;
  languages: Array<{ id: number; name: string; code: string }>;
  title: string;
  initialData?: Quiz | null;
}

const QuizFormDialog: React.FC<QuizFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  languages,
  title,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '', es: '' },
    description: { en: '', ar: '', es: '' },
    level: 'A1' as QuizLevel,
    language_id: undefined as number | undefined,
    is_active: true,
    duration_minutes: undefined as number | undefined,
    passing_score: 70,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || { en: '', ar: '', es: '' },
        level: initialData.level,
        language_id: initialData.language_id,
        is_active: initialData.is_active,
        duration_minutes: initialData.duration_minutes,
        passing_score: initialData.passing_score,
      });
    } else {
      setFormData({
        title: { en: '', ar: '', es: '' },
        description: { en: '', ar: '', es: '' },
        level: 'A1',
        language_id: undefined,
        is_active: true,
        duration_minutes: undefined,
        passing_score: 70,
      });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title (English)"
            value={formData.title.en}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              title: { ...prev.title, en: e.target.value }
            }))}
            required
            fullWidth
          />

          <TextField
            label="Description (English)"
            value={formData.description.en}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: { ...prev.description, en: e.target.value }
            }))}
            multiline
            rows={3}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as QuizLevel }))}
                label="Level"
              >
                {QUIZ_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={formData.language_id || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  language_id: e.target.value ? Number(e.target.value) : undefined 
                }))}
                label="Language"
              >
                <MenuItem value="">Select Language</MenuItem>
                {languages.map((lang) => (
                  <MenuItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={formData.duration_minutes || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                duration_minutes: e.target.value ? Number(e.target.value) : undefined 
              }))}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Passing Score (%)"
              type="number"
              value={formData.passing_score}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                passing_score: Number(e.target.value) 
              }))}
              inputProps={{ min: 0, max: 100 }}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
            }
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Import Dialog Component
interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File, languageId?: number) => void;
  languages: Array<{ id: number; name: string; code: string }>;
}

const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  onImport,
  languages,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [languageId, setLanguageId] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (file) {
      onImport(file, languageId);
      setFile(null);
      setLanguageId(undefined);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Quizzes</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <FormControl fullWidth>
            <InputLabel>Language (Optional)</InputLabel>
            <Select
              value={languageId || ''}
              onChange={(e) => setLanguageId(e.target.value ? Number(e.target.value) : undefined)}
              label="Language (Optional)"
            >
              <MenuItem value="">Auto-detect from CSV</MenuItem>
              {languages.map((lang) => (
                <MenuItem key={lang.id} value={lang.id}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!file}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizManagement;