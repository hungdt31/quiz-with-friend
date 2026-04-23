import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizDetails, submitQuiz } from '../api';
import { Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuizDetails(id).then(res => {
      setQuiz(res.data ? res.data : res);
      setLoading(false);
    }).catch(() => {
      alert("Lỗi khi tải đề thi!");
      setLoading(false);
    });
  }, [id]);

  const handleSelect = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem('access_token')) {
      alert("Vui lòng đăng nhập trước khi nộp bài!");
      navigate('/login');
      return;
    }
    
    if (Object.keys(answers).length < quiz.questions.length) {
      if(!window.confirm("Bạn chưa làm hết các câu hỏi. Vẫn muốn nộp bài?")) return;
    }

    setSubmitting(true);
    try {
      const res = await submitQuiz(id, answers);
      navigate(`/quiz/${id}/result`, { state: res.result });
    } catch (err) {
      alert("Lỗi khi nộp bài: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!quiz) return <Typography align="center" mt={8}>Không tìm thấy bài thi.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4, textAlign: 'center', background: 'linear-gradient(145deg, #1e293b, #0f172a)' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>{quiz.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Thời gian: {quiz.time_limit} phút | Điểm đỗ: {quiz.passing_score}%
        </Typography>
      </Paper>

      {quiz.questions?.map((q, index) => (
        <Paper elevation={2} key={q.id} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Câu {index + 1}: {q.text}
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={answers[q.id] || ''} onChange={(e) => handleSelect(q.id, Number(e.target.value))}>
              {q.answers?.map(a => (
                <FormControlLabel 
                  key={a.id} 
                  value={a.id} 
                  control={<Radio />} 
                  label={a.text} 
                  sx={{ 
                    mb: 1, p: 1, borderRadius: 2, 
                    border: '1px solid',
                    borderColor: answers[q.id] === a.id ? 'primary.main' : 'divider',
                    bgcolor: answers[q.id] === a.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    transition: '0.2s'
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      <Box textAlign="center" mt={6} mb={4}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={handleSubmit} 
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ px: 6, py: 1.5, borderRadius: 8, fontSize: '1.1rem' }}
        >
          {submitting ? 'Đang chấm điểm...' : 'Nộp bài ngay'}
        </Button>
      </Box>
    </Box>
  );
}
