import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, getTopics, updateArticle } from '../api';
import { Box, Typography, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [topics, setTopics] = useState([]);
  
  // Edit Modal State
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', topic: '', is_public: true });

  const currentUser = localStorage.getItem('username');

  const fetchArticle = async () => {
    try {
      const data = await getArticle(id);
      setArticle(data);
      setFormData({
        title: data.title,
        content: data.content,
        topic: data.topic || '',
        is_public: data.is_public
      });
    } catch (e) {
      console.error(e);
      alert("Không thể tải bài viết hoặc bài viết đã bị ẩn!");
      navigate('/articles');
    }
  };

  useEffect(() => {
    fetchArticle();
    getTopics().then(setTopics).catch(console.error);
  }, [id]);

  const handleUpdate = async () => {
    if (!formData.title || !formData.content) return alert("Nhập đủ tiêu đề và nội dung!");
    try {
      await updateArticle(id, formData);
      setOpenEdit(false);
      fetchArticle();
    } catch (e) {
      alert("Cập nhật thất bại!");
    }
  };

  if (!article) return <Typography sx={{ p: 4, textAlign: 'center' }}>Đang tải...</Typography>;

  const isOwner = article.creator_name === currentUser;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">{article.title}</Typography>
          {isOwner && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpenEdit(true)}>
              Chỉnh sửa
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {article.topic_name && <Chip label={article.topic_name} color="secondary" size="small" />}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon fontSize="inherit" /> Tác giả: {article.creator_name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon fontSize="inherit" /> Ngày đăng: {new Date(article.created_at).toLocaleDateString('vi-VN')}
          </Typography>
          {!article.is_public && (
            <Chip label="Riêng tư" size="small" color="error" variant="outlined" />
          )}
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {article.content}
        </Typography>
      </Paper>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold" color="primary">Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Chủ đề (Tùy chọn)" value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} sx={{ mt: 1, mb: 2 }}>
            <MenuItem value="">-- Không chọn --</MenuItem>
            {topics.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </TextField>
          <TextField margin="dense" label="Tiêu đề bài viết" fullWidth required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Nội dung" fullWidth required multiline rows={12} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
          <FormControlLabel
            control={<Switch checked={formData.is_public} onChange={e => setFormData({ ...formData, is_public: e.target.checked })} color="primary" />}
            label="Công khai bài viết"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleUpdate} variant="contained">Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
