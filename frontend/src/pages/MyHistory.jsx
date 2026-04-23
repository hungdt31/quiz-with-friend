import { useState, useEffect } from 'react';
import { getMyAttempts } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, CircularProgress, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useHeader } from '../App';
import ExploreIcon from '@mui/icons-material/Explore';

export default function MyHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setHeaderExtra } = useHeader();

  useEffect(() => {
    getMyAttempts().then(data => {
      setAttempts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setHeaderExtra(
      <Button component={RouterLink} to="/" variant="contained" startIcon={<ExploreIcon />}>
        Làm bài thi mới
      </Button>
    );
    return () => setHeaderExtra(null);
  }, [setHeaderExtra]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2, mb: 8 }}>
      
      {attempts.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography color="text.secondary" mb={3}>Bạn chưa làm bài thi nào cả.</Typography>
          <Button component={RouterLink} to="/" variant="contained" color="primary">Khám phá bài thi</Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <List disablePadding>
            {attempts.map((attempt, index) => (
              <ListItem 
                key={attempt.id} 
                divider={index !== attempts.length - 1}
                sx={{ p: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: attempt.passed ? 'success.dark' : 'error.dark', width: 56, height: 56, mr: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">{attempt.quiz_title}</Typography>}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', gap: 2, mt: 1, color: 'text.secondary' }}>
                      <span>{new Date(attempt.created_at).toLocaleString('vi-VN')}</span>
                      <span>Điểm số: <Typography component="span" fontWeight="bold" color="text.primary">{attempt.score}</Typography></span>
                    </Box>
                  }
                />
                <Box>
                  <Chip 
                    icon={attempt.passed ? <EmojiEventsIcon /> : <CancelIcon />} 
                    label={attempt.passed ? "Đạt" : "Trượt"} 
                    color={attempt.passed ? "success" : "error"} 
                    variant="outlined"
                    sx={{ fontWeight: 'bold', px: 1, py: 2.5, borderRadius: 2 }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
