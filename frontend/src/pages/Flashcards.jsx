import { useState, useEffect } from 'react';
import { getFlashcardSets, createFlashcardSet } from '../api';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StyleIcon from '@mui/icons-material/Style';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Flashcards() {
  const [sets, setSets] = useState([]);
  const [open, setOpen] = useState(false);
  const [studySet, setStudySet] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', description: '', is_public: true });
  const [cardsData, setCardsData] = useState([{ front_text: '', back_text: '' }]);

  const fetchSets = async () => setSets(await getFlashcardSets());
  useEffect(() => { fetchSets(); }, []);

  const handleAddCard = () => setCardsData([...cardsData, { front_text: '', back_text: '' }]);
  const handleRemoveCard = (idx) => setCardsData(cardsData.filter((_, i) => i !== idx));
  const updateCard = (idx, field, value) => {
    const newCards = [...cardsData];
    newCards[idx][field] = value;
    setCardsData(newCards);
  };

  const handleCreate = async () => {
    if(!formData.title) return alert("Nhập tiêu đề bộ thẻ!");
    if(cardsData.some(c => !c.front_text || !c.back_text)) return alert("Mặt trước và sau của thẻ không được để trống!");
    
    await createFlashcardSet({ ...formData, cards_data: cardsData });
    setOpen(false);
    setFormData({ title: '', description: '', is_public: true });
    setCardsData([{ front_text: '', back_text: '' }]);
    fetchSets();
  };

  const startStudy = (set) => {
    setStudySet(set);
    setCurrentCardIdx(0);
    setIsFlipped(false);
  };

  if (studySet) {
    const currentCard = studySet.cards[currentCardIdx];
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Button onClick={() => setStudySet(null)} sx={{ mb: 4 }}>Thoát chế độ học</Button>
        <Typography variant="h5" fontWeight="bold" mb={2}>{studySet.title}</Typography>
        <Typography mb={4}>{currentCardIdx + 1} / {studySet.cards.length}</Typography>

        <Box sx={{ perspective: '1000px', width: '100%', height: '300px', cursor: 'pointer', mb: 4 }} onClick={() => setIsFlipped(!isFlipped)}>
          <Box sx={{
            width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            {/* Front */}
            <Paper elevation={4} sx={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: 4, bgcolor: 'primary.light', color: 'primary.contrastText'
            }}>
              <Typography variant="h4" fontWeight="bold">{currentCard.front_text}</Typography>
            </Paper>
            {/* Back */}
            <Paper elevation={4} sx={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: 4, bgcolor: 'secondary.light', color: 'secondary.contrastText'
            }}>
              <Typography variant="h5">{currentCard.back_text}</Typography>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" disabled={currentCardIdx === 0} onClick={() => { setCurrentCardIdx(prev => prev - 1); setIsFlipped(false); }}>Câu trước</Button>
          <Button variant="contained" disabled={currentCardIdx === studySet.cards.length - 1} onClick={() => { setCurrentCardIdx(prev => prev + 1); setIsFlipped(false); }}>Câu tiếp theo</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="secondary">Kho Flashcards</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Tạo Bộ Thẻ Mới</Button>
      </Box>

      <Grid container spacing={4}>
        {sets.map(set => (
          <Grid xs={12} sm={6} md={4} key={set.id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }, cursor: 'pointer' }} onClick={() => startStudy(set)}>
              <CardContent sx={{ textAlign: 'center', flexGrow: 1, py: 4 }}>
                <StyleIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1}>{set.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{set.description}</Typography>
                <Typography variant="button" color="secondary" fontWeight="bold">{set.cards.length} Thẻ</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {sets.length === 0 && <Typography p={4} color="text.secondary">Chưa có bộ flashcard nào.</Typography>}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold" color="secondary">Tạo Bộ Flashcard</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Tên bộ thẻ" fullWidth required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} sx={{ mt: 1, mb: 2 }} />
          <TextField margin="dense" label="Mô tả" fullWidth value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} sx={{ mb: 4 }} />
          
          <Typography variant="h6" mb={2}>Danh sách thẻ:</Typography>
          {cardsData.map((c, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography fontWeight="bold">{idx + 1}.</Typography>
              <TextField label="Mặt trước (Câu hỏi/Từ vựng)" fullWidth required value={c.front_text} onChange={e => updateCard(idx, 'front_text', e.target.value)} />
              <TextField label="Mặt sau (Định nghĩa/Đáp án)" fullWidth required value={c.back_text} onChange={e => updateCard(idx, 'back_text', e.target.value)} />
              <IconButton color="error" onClick={() => handleRemoveCard(idx)}><DeleteIcon /></IconButton>
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddCard} sx={{ mb: 2 }}>Thêm thẻ</Button>
          <Box>
            <FormControlLabel 
              control={<Switch checked={formData.is_public} onChange={e => setFormData({...formData, is_public: e.target.checked})} color="secondary" />}
              label="Công khai bộ thẻ này cho mọi người cùng học"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreate} variant="contained" color="secondary">Tạo Bộ Thẻ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
