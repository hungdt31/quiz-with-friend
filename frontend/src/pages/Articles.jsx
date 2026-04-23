import { useState, useEffect } from 'react';
import { getArticles, getTopics, createArticle } from '../api';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../App';

export default function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [open, setOpen] = useState(false);
  const { setHeaderExtra } = useHeader();

  const [formData, setFormData] = useState({ title: '', content: '', topic: '', is_public: true });

  const fetchData = async () => {
    try {
      setArticles(await getArticles());
      setTopics(await getTopics());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    setHeaderExtra(
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Đăng Bài Mới
      </Button>
    );
    return () => setHeaderExtra(null);
  }, [setHeaderExtra]);

  const handleCreate = async () => {
    if (!formData.title || !formData.content) return alert("Nhập đủ tiêu đề và nội dung!");
    await createArticle(formData);
    setOpen(false);
    setFormData({ title: '', content: '', topic: '', is_public: true });
    fetchData();
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 2, mb: 8 }}>

      <Grid container spacing={4}>
        {articles.map(article => (
          <Grid xs={12} md={6} key={article.id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">{article.title}</Typography>
                  {article.topic_name && <Chip size="small" label={article.topic_name} color="secondary" />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                  {article.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="inherit" /> {article.creator_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="inherit" /> {new Date(article.created_at).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/article/${article.id}`)}>Đọc tiếp</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {articles.length === 0 && <Typography p={4} color="text.secondary">Chưa có bài viết nào.</Typography>}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold" color="primary">Tạo Bài Viết Mới</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Chủ đề (Tùy chọn)" value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} sx={{ mt: 1, mb: 2 }}>
            <MenuItem value="">-- Không chọn --</MenuItem>
            {topics.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </TextField>
          <TextField autoFocus margin="dense" label="Tiêu đề bài viết" fullWidth required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Nội dung" fullWidth required multiline rows={8} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
          <FormControlLabel
            control={<Switch checked={formData.is_public} onChange={e => setFormData({ ...formData, is_public: e.target.checked })} color="primary" />}
            label="Công khai bài viết (Ai cũng có thể xem)"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreate} variant="contained">Đăng Bài</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
