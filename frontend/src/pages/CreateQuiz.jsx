import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz, getCategories, getBanks, getBankQuestions } from '../api';
import { Box, Paper, Typography, TextField, Button, MenuItem, Grid, IconButton, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useHeader } from '../App';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const { setHeaderExtra } = useHeader();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    time_limit: 30,
    passing_score: 50,
    is_published: true
  });
  
  const [questions, setQuestions] = useState([
    { text: '', points: 1, bank_id: '', answers: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }
  ]);
  
  const [existingQuestionIds, setExistingQuestionIds] = useState([]);
  const [selectedExistingQs, setSelectedExistingQs] = useState([]); // Objects for display

  // Bank import modal state
  const [openBankModal, setOpenBankModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [bankQuestions, setBankQuestions] = useState([]);
  const [modalSelectedQIds, setModalSelectedQIds] = useState([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data ? res.data : res)).catch(() => {});
    getBanks().then(res => setBanks(res.data ? res.data : res)).catch(() => {});
  }, []);

  useEffect(() => {
    setHeaderExtra(
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => document.getElementById('submit-quiz-btn').click()}>
        Lưu Đề Thi
      </Button>
    );
    return () => setHeaderExtra(null);
  }, [setHeaderExtra]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addQuestion = () => setQuestions([...questions, { text: '', points: 1, bank_id: '', answers: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }]);
  const updateQuestion = (index, field, value) => {
    const newQ = [...questions];
    newQ[index][field] = value;
    setQuestions(newQ);
  };
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const addAnswer = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].answers.push({ text: '', is_correct: false });
    setQuestions(newQ);
  };
  const updateAnswer = (qIndex, aIndex, field, value) => {
    const newQ = [...questions];
    if (field === 'is_correct' && value === true) {
      newQ[qIndex].answers.forEach(a => a.is_correct = false);
    }
    newQ[qIndex].answers[aIndex][field] = value;
    setQuestions(newQ);
  };
  const removeAnswer = (qIndex, aIndex) => {
    const newQ = [...questions];
    newQ[qIndex].answers = newQ[qIndex].answers.filter((_, i) => i !== aIndex);
    setQuestions(newQ);
  };

  const handleFetchBankQuestions = async (e) => {
    const bid = e.target.value;
    setSelectedBankId(bid);
    if(bid) {
      const res = await getBankQuestions(bid);
      setBankQuestions(res.data ? res.data : res);
    } else {
      setBankQuestions([]);
    }
  };

  const toggleModalQSelection = (id) => {
    setModalSelectedQIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleImportBankQuestions = () => {
    const newlySelected = bankQuestions.filter(q => modalSelectedQIds.includes(q.id));
    setSelectedExistingQs([...selectedExistingQs, ...newlySelected]);
    setExistingQuestionIds([...existingQuestionIds, ...modalSelectedQIds]);
    setOpenBankModal(false);
    setSelectedBankId('');
    setBankQuestions([]);
    setModalSelectedQIds([]);
  };

  const removeExistingQ = (id) => {
    setSelectedExistingQs(selectedExistingQs.filter(q => q.id !== id));
    setExistingQuestionIds(existingQuestionIds.filter(x => x !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('access_token')) return navigate('/login');
    try {
      const payload = { ...formData, questions, existing_question_ids: existingQuestionIds };
      await createQuiz(payload);
      alert('Tạo đề thi thành công!');
      navigate('/');
    } catch (err) {
      alert('Lỗi: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2, mb: 8 }}>
      <form onSubmit={handleSubmit}>
        <button id="submit-quiz-btn" type="submit" style={{ display: 'none' }} />
        {/* Thông tin chung */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>1. Thông tin chung</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Tên Đề Thi" name="title" value={formData.title} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth required label="Danh mục" name="category" value={formData.category} onChange={handleChange}>
                {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label="Thời gian làm bài (phút)" name="time_limit" value={formData.time_limit} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label="Điểm đỗ (%)" name="passing_score" value={formData.passing_score} onChange={handleChange} />
            </Grid>
          </Grid>
        </Paper>

        {/* Nguồn từ Ngân hàng */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">2. Lấy từ Ngân hàng câu hỏi</Typography>
            <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={() => setOpenBankModal(true)}>
              Chọn câu hỏi từ Ngân hàng
            </Button>
          </Box>
          
          {selectedExistingQs.length > 0 && (
            <List>
              {selectedExistingQs.map((q, idx) => (
                <ListItem key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1, borderRadius: 2 }} secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => removeExistingQ(q.id)}><DeleteIcon /></IconButton>
                }>
                  <ListItemText primary={`[Từ ngân hàng] ${q.text}`} secondary={`${q.answers?.length || 0} đáp án`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Tạo câu hỏi mới */}
        <Typography variant="h6" fontWeight="bold" mb={2}>3. Viết câu hỏi mới</Typography>
        {questions.map((q, qIndex) => (
          <Paper elevation={2} key={qIndex} sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: '4px solid #3b82f6' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography fontWeight="bold">Câu mới {qIndex + 1}</Typography>
              <IconButton color="error" onClick={() => removeQuestion(qIndex)}><DeleteIcon /></IconButton>
            </Box>
            
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth required label="Nội dung câu hỏi" value={q.text} onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Lưu vào ngân hàng (Tuỳ chọn)" value={q.bank_id} onChange={(e) => updateQuestion(qIndex, 'bank_id', e.target.value)}>
                  <MenuItem value="">-- Không lưu --</MenuItem>
                  {banks.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            
            <Box pl={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>Các đáp án:</Typography>
              {q.answers.map((a, aIndex) => (
                <Box key={aIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FormControlLabel control={<Checkbox checked={a.is_correct} onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)} />} label="Đúng" />
                  <TextField size="small" fullWidth required placeholder={`Đáp án ${aIndex + 1}`} value={a.text} onChange={(e) => updateAnswer(qIndex, aIndex, 'text', e.target.value)} />
                  <IconButton color="error" onClick={() => removeAnswer(qIndex, aIndex)}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              ))}
              <Button size="small" startIcon={<AddCircleIcon />} onClick={() => addAnswer(qIndex)}>Thêm đáp án</Button>
            </Box>
          </Paper>
        ))}

        <Button variant="outlined" fullWidth startIcon={<AddCircleIcon />} onClick={addQuestion} sx={{ mb: 4, py: 1.5, borderStyle: 'dashed' }}>
          Tạo thêm câu hỏi mới
        </Button>
      </form>

      {/* Modal chọn từ ngân hàng */}
      <Dialog open={openBankModal} onClose={() => setOpenBankModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chọn từ Ngân hàng câu hỏi</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Chọn Ngân Hàng" value={selectedBankId} onChange={handleFetchBankQuestions} sx={{ mt: 2, mb: 2 }}>
            <MenuItem value="">-- Chọn một ngân hàng --</MenuItem>
            {banks.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
          </TextField>
          
          <List>
            {bankQuestions.map(bq => {
              const isSelected = modalSelectedQIds.includes(bq.id) || existingQuestionIds.includes(bq.id);
              const isAlreadyAdded = existingQuestionIds.includes(bq.id);
              return (
                <ListItem key={bq.id} secondaryAction={<Checkbox edge="end" checked={isSelected} disabled={isAlreadyAdded} onChange={() => toggleModalQSelection(bq.id)} />}>
                  <ListItemText primary={bq.text} secondary={isAlreadyAdded ? "Đã được chọn" : ""} />
                </ListItem>
              );
            })}
            {selectedBankId && bankQuestions.length === 0 && <Typography color="text.secondary">Ngân hàng này chưa có câu hỏi nào.</Typography>}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBankModal(false)}>Hủy</Button>
          <Button onClick={handleImportBankQuestions} variant="contained" disabled={modalSelectedQIds.length === 0}>
            Nhập ({modalSelectedQIds.length}) câu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
