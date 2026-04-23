import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBankDetails, getBankQuestions, createQuestion, deleteQuestion } from '../api';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BankDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // Create question modal state
  const [open, setOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', is_correct: true },
    { text: '', is_correct: false }
  ]);

  useEffect(() => {
    getBankDetails(id).then(res => setBank(res.data ? res.data : res)).catch(() => {});
    fetchQuestions();
  }, [id]);

  const fetchQuestions = () => {
    getBankQuestions(id).then(res => setQuestions(res.data ? res.data : res)).catch(() => {});
  };

  const handleAddAnswer = () => setAnswers([...answers, { text: '', is_correct: false }]);
  const handleRemoveAnswer = (idx) => setAnswers(answers.filter((_, i) => i !== idx));
  const handleUpdateAnswer = (idx, field, value) => {
    const newA = [...answers];
    if (field === 'is_correct' && value === true) {
      newA.forEach(a => a.is_correct = false); // single choice logic
    }
    newA[idx][field] = value;
    setAnswers(newA);
  };

  const handleCreateQuestion = async () => {
    if (!qText.trim()) return alert("Vui lòng nhập nội dung câu hỏi!");
    if (answers.length < 2) return alert("Phải có ít nhất 2 đáp án!");
    if (!answers.some(a => a.is_correct)) return alert("Phải chọn ít nhất 1 đáp án đúng!");
    
    try {
      await createQuestion({
        bank: id,
        text: qText,
        points: 1,
        answers_data: answers
      });
      setOpen(false);
      setQText('');
      setAnswers([{ text: '', is_correct: true }, { text: '', is_correct: false }]);
      fetchQuestions();
    } catch (e) {
      alert("Lỗi khi tạo câu hỏi!");
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này khỏi ngân hàng?")) {
      await deleteQuestion(qId);
      fetchQuestions();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/profile')} sx={{ mb: 2 }}>
        Quay lại trang cá nhân
      </Button>
      
      <Typography variant="h4" mb={2} fontWeight="bold" color="primary">
        Ngân hàng: {bank ? bank.name : 'Đang tải...'}
      </Typography>
      <Typography color="text.secondary" mb={4}>{bank?.description}</Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Danh sách câu hỏi ({questions.length})</Typography>
          <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => setOpen(true)}>
            Thêm câu hỏi
          </Button>
        </Box>

        {questions.length === 0 ? (
          <Typography align="center" color="text.secondary" py={4}>
            Ngân hàng này chưa có câu hỏi nào.
          </Typography>
        ) : (
          <List disablePadding>
            {questions.map((q, idx) => (
              <Paper key={q.id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography fontWeight="bold" mb={1}>Câu {idx + 1}: {q.text}</Typography>
                  <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(q.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box pl={2}>
                  {q.answers?.map(a => (
                    <Typography key={a.id} variant="body2" color={a.is_correct ? 'success.main' : 'text.primary'} fontWeight={a.is_correct ? 'bold' : 'normal'}>
                      {a.is_correct ? '✓' : '•'} {a.text}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            ))}
          </List>
        )}
      </Paper>

      {/* Modal Tạo Câu Hỏi */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold" color="primary">Thêm câu hỏi mới vào ngân hàng</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nội dung câu hỏi" fullWidth multiline rows={2} required value={qText} onChange={e => setQText(e.target.value)} sx={{ mb: 3, mt: 1 }} />
          
          <Typography variant="subtitle2" mb={1}>Các đáp án:</Typography>
          {answers.map((a, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FormControlLabel 
                control={<Checkbox checked={a.is_correct} onChange={e => handleUpdateAnswer(idx, 'is_correct', e.target.checked)} />} 
                label="Đúng" 
              />
              <TextField size="small" fullWidth placeholder={`Đáp án ${idx + 1}`} value={a.text} onChange={e => handleUpdateAnswer(idx, 'text', e.target.value)} />
              <IconButton color="error" onClick={() => handleRemoveAnswer(idx)}><DeleteIcon fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<AddCircleIcon />} onClick={handleAddAnswer}>Thêm đáp án khác</Button>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreateQuestion} variant="contained">Lưu câu hỏi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
