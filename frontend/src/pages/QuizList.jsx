import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getQuizzes } from '../api';
import { Typography, Grid, Card, CardContent, CardActions, Button, Chip, Skeleton, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useHeader } from '../App';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setHeaderExtra } = useHeader();

  useEffect(() => {
    getQuizzes().then(res => {
      setQuizzes(res.data ? res.data : res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setHeaderExtra(
      <Button variant="contained" component={RouterLink} to="/create-quiz" startIcon={<AddIcon />}>
        Tạo Đề Mới
      </Button>
    );
    return () => setHeaderExtra(null);
  }, [setHeaderExtra]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 4 }}>

      <Grid container spacing={3}>
        {loading ? (
          [1, 2, 3].map((n) => (
            <Grid xs={12} sm={6} md={4} key={n}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 4 }} />
            </Grid>
          ))
        ) : (
          quizzes.map((quiz) => (
            <Grid xs={12} sm={6} md={4} key={quiz.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={quiz.category_name || 'Tổng hợp'} color="primary" variant="outlined" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {quiz.description || 'Không có mô tả chi tiết.'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" /> Tác giả: {quiz.creator_name || 'Hệ thống'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" /> {quiz.time_limit} phút
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleOutlineIcon fontSize="small" /> {quiz.passing_score}% điểm đỗ
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormatListBulletedIcon fontSize="small" /> {quiz.questions?.length || 0} câu hỏi
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button component={RouterLink} to={`/quiz/${quiz.id}`} variant="contained" color="primary" fullWidth>
                    Bắt đầu làm bài
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
