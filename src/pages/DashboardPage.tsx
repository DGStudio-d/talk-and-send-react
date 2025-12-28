import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

// Mock data - in real app this would come from API
const mockStats = {
  totalQuizzes: 156,
  totalUsers: 2847,
  totalLanguages: 12,
  activeQuizzes: 134,
  completedAttempts: 15420,
  averageScore: 78.5,
};

const mockRecentActivity = [
  { id: 1, user: 'John Doe', action: 'completed', quiz: 'English A1 Grammar', score: 85, time: '2 hours ago' },
  { id: 2, user: 'Maria Garcia', action: 'started', quiz: 'Spanish B2 Vocabulary', score: null, time: '3 hours ago' },
  { id: 3, user: 'Ahmed Hassan', action: 'completed', quiz: 'Arabic A2 Reading', score: 92, time: '5 hours ago' },
  { id: 4, user: 'Lisa Chen', action: 'completed', quiz: 'Chinese B1 Listening', score: 76, time: '1 day ago' },
];

const mockPopularQuizzes = [
  { id: 1, title: 'English A1 Grammar Basics', attempts: 1250, avgScore: 82 },
  { id: 2, title: 'Spanish Vocabulary Builder', attempts: 980, avgScore: 75 },
  { id: 3, title: 'French Pronunciation Guide', attempts: 756, avgScore: 88 },
  { id: 4, title: 'German Grammar Essentials', attempts: 642, avgScore: 79 },
];

interface DashboardPageProps {
  userRole?: 'admin' | 'teacher' | 'student' | 'public';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ userRole = 'public' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
  }> = ({ title, description, icon, onClick, color = 'primary.main' }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56, mx: 'auto', mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <DashboardIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            Loading Dashboard...
          </Typography>
          <LinearProgress sx={{ width: 200, mx: 'auto' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {userRole === 'admin' ? 'Admin Dashboard' : 
           userRole === 'teacher' ? 'Teacher Dashboard' :
           userRole === 'student' ? 'Student Dashboard' : 'Platform Overview'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your language learning platform.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Quizzes"
            value={mockStats.totalQuizzes}
            icon={<QuizIcon />}
            color="primary.main"
            subtitle={`${mockStats.activeQuizzes} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={mockStats.totalUsers.toLocaleString()}
            icon={<PeopleIcon />}
            color="success.main"
            subtitle="Registered learners"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Languages"
            value={mockStats.totalLanguages}
            icon={<LanguageIcon />}
            color="info.main"
            subtitle="Available languages"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Score"
            value={`${mockStats.averageScore}%`}
            icon={<AssessmentIcon />}
            color="warning.main"
            subtitle="Platform average"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  title="Browse Quizzes"
                  description="Explore available quizzes"
                  icon={<QuizIcon />}
                  onClick={() => navigate('/quizzes')}
                />
              </Grid>
              {userRole === 'admin' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="Manage Users"
                      description="User administration"
                      icon={<PeopleIcon />}
                      onClick={() => navigate('/admin/users')}
                      color="success.main"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="Quiz Management"
                      description="Create and edit quizzes"
                      icon={<AdminIcon />}
                      onClick={() => navigate('/admin/quizzes')}
                      color="error.main"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="Languages"
                      description="Manage languages"
                      icon={<LanguageIcon />}
                      onClick={() => navigate('/admin/languages')}
                      color="info.main"
                    />
                  </Grid>
                </>
              )}
              {userRole === 'teacher' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="My Quizzes"
                      description="Manage your quizzes"
                      icon={<SchoolIcon />}
                      onClick={() => navigate('/teacher/quizzes')}
                      color="success.main"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="Students"
                      description="View student progress"
                      icon={<PeopleIcon />}
                      onClick={() => navigate('/teacher/students')}
                      color="info.main"
                    />
                  </Grid>
                </>
              )}
              {(userRole === 'student' || userRole === 'public') && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="Take Quiz"
                      description="Start a new quiz"
                      icon={<StarIcon />}
                      onClick={() => navigate('/quizzes')}
                      color="success.main"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                      title="My Progress"
                      description="View your results"
                      icon={<TrendingUpIcon />}
                      onClick={() => navigate('/progress')}
                      color="info.main"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {/* Popular Quizzes */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Popular Quizzes
            </Typography>
            <List>
              {mockPopularQuizzes.map((quiz, index) => (
                <React.Fragment key={quiz.id}>
                  <ListItem
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={quiz.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Chip 
                            label={`${quiz.attempts} attempts`} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={`${quiz.avgScore}% avg`} 
                            size="small" 
                            color="success" 
                            variant="outlined" 
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockPopularQuizzes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Recent Activity
              </Typography>
            </Box>
            
            <List>
              {mockRecentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{activity.user}</strong> {activity.action} 
                          <em> {activity.quiz}</em>
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                          {activity.score && (
                            <Chip 
                              label={`${activity.score}%`} 
                              size="small" 
                              color={activity.score >= 80 ? 'success' : activity.score >= 60 ? 'warning' : 'error'}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockRecentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/activity')}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 4, p: 4, bgcolor: 'primary.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ready to start learning?
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Explore our collection of interactive language quizzes and improve your skills today!
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/quizzes')}
        >
          Browse Quizzes
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;