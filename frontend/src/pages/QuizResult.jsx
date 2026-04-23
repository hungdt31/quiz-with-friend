import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function QuizResult() {
  const location = useLocation();
  const result = location.state;

  if (!result) return <Typography align="center" mt={8}>Không có kết quả để hiển thị.</Typography>;

  const isPassed = result.passed;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <Box sx={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', filter: 'blur(50px)', zIndex: 0 }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {isPassed ? (
            <EmojiEventsIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
          ) : (
            <CancelIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          )}
          
          <Typography variant="h3" fontWeight="bold" color={isPassed ? 'success.main' : 'error.main'} gutterBottom>
            {isPassed ? 'CHÚC MỪNG!' : 'RẤT TIẾC!'}
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" mb={4}>
            {isPassed ? 'Bạn đã vượt qua bài thi xuất sắc.' : 'Bạn chưa đạt đủ điểm để qua bài thi này.'}
          </Typography>

          <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 4, borderRadius: 4, mb: 4 }}>
            <Typography variant="h1" fontWeight="bold" color="primary.main" lineHeight={1}>
              {result.percentage}%
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mt={1}>
              Tổng điểm: {result.score} / {result.total_possible}
            </Typography>
          </Paper>

          <Button component={RouterLink} to="/" variant="outlined" color="primary" fullWidth size="large" startIcon={<ArrowBackIcon />}>
            Về trang chủ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
