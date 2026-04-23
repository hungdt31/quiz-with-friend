import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanks, createBank, getMyArticles, getMyFlashcardSets, updateArticle, updateFlashcardSet, getTopics, createArticle, createFlashcardSet } from '../api';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Switch, FormControlLabel, MenuItem, IconButton } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArticleIcon from '@mui/icons-material/Article';
import StyleIcon from '@mui/icons-material/Style';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHeader } from '../App';
import AddIcon from '@mui/icons-material/Add';

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [banks, setBanks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [topics, setTopics] = useState([]);
  const { setHeaderExtra } = useHeader();

  // Modals state
  const [open, setOpen] = useState(false); // Bank Modal
  const [openArticle, setOpenArticle] = useState(false);
  const [openFlashcard, setOpenFlashcard] = useState(false);

  // Forms state
  const [bankName, setBankName] = useState('');
  const [bankDesc, setBankDesc] = useState('');
  const [articleFormData, setArticleFormData] = useState({ title: '', content: '', topic: '', is_public: true });
  const [flashcardFormData, setFlashcardFormData] = useState({ title: '', description: '', is_public: true });
  const [cardsData, setCardsData] = useState([{ front_text: '', back_text: '' }]);

  const fetchData = async () => {
    try {
      getBanks().then(res => setBanks(res.data ? res.data : res));
      getMyArticles().then(res => setArticles(res));
      getMyFlashcardSets().then(res => setFlashcardSets(res));
      getTopics().then(res => setTopics(res));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tab === 0) {
      setHeaderExtra(<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Tạo ngân hàng mới</Button>);
    } else if (tab === 1) {
      setHeaderExtra(<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenArticle(true)}>Viết bài mới</Button>);
    } else if (tab === 2) {
      setHeaderExtra(<Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpenFlashcard(true)}>Tạo bộ thẻ mới</Button>);
    }
    return () => setHeaderExtra(null);
  }, [tab, setHeaderExtra]);

  const handleCreateBank = async () => {
    if (!bankName.trim()) return alert("Tên ngân hàng không được để trống!");
    try {
      await createBank(bankName, bankDesc);
      setOpen(false);
      setBankName('');
      setBankDesc('');
      fetchData();
    } catch (e) {
      alert("Có lỗi xảy ra khi tạo ngân hàng câu hỏi.");
    }
  };

  const handleCreateArticle = async () => {
    if (!articleFormData.title || !articleFormData.content) return alert("Nhập đủ tiêu đề và nội dung!");
    await createArticle(articleFormData);
    setOpenArticle(false);
    setArticleFormData({ title: '', content: '', topic: '', is_public: true });
    fetchData();
  };

  const handleCreateFlashcard = async () => {
    if (!flashcardFormData.title) return alert("Nhập tiêu đề bộ thẻ!");
    if (cardsData.some(c => !c.front_text || !c.back_text)) return alert("Mặt trước và sau của thẻ không được để trống!");

    await createFlashcardSet({ ...flashcardFormData, cards_data: cardsData });
    setOpenFlashcard(false);
    setFlashcardFormData({ title: '', description: '', is_public: true });
    setCardsData([{ front_text: '', back_text: '' }]);
    fetchData();
  };

  const handleToggleArticlePrivacy = async (article) => {
    await updateArticle(article.id, { is_public: !article.is_public });
    fetchData();
  };

  const handleToggleFlashcardSetPrivacy = async (set) => {
    await updateFlashcardSet(set.id, { is_public: !set.is_public });
    fetchData();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2, mb: 8 }}>

      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<AccountBalanceIcon />} label="Ngân Hàng Câu Hỏi" />
          <Tab icon={<ArticleIcon />} label="Bài Viết" />
          <Tab icon={<StyleIcon />} label="Bộ Flashcards" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Ngân hàng câu hỏi</Typography>
            </Box>

            <List>
              {banks.map((bank) => (
                <ListItem key={bank.id} divider sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} color="primary.main">
                        <AccountBalanceIcon fontSize="small" /> {bank.name}
                      </Typography>
                    }
                    secondary={bank.description || 'Không có mô tả'}
                  />
                  <Button variant="outlined" size="small" onClick={() => navigate(`/bank/${bank.id}`)}>
                    Quản lý câu hỏi
                  </Button>
                </ListItem>
              ))}
              {banks.length === 0 && (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                  Bạn chưa tạo ngân hàng câu hỏi nào.
                </Typography>
              )}
            </List>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Bài viết của tôi ({articles.length})</Typography>
            </Box>
            <List>
              {articles.map((article) => (
                <ListItem key={article.id} divider sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight="bold"
                          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                          onClick={() => navigate(`/article/${article.id}`)}
                        >
                          {article.title}
                        </Typography>
                      }
                      secondary={`Chủ đề: ${article.topic_name || 'Không có'}`}
                    />
                    <FormControlLabel
                      control={<Switch checked={article.is_public} onChange={() => handleToggleArticlePrivacy(article)} color="primary" />}
                      label={article.is_public ? "Đang Công Khai" : "Chỉ Mình Tôi"}
                      labelPlacement="start"
                    />
                  </Box>
                </ListItem>
              ))}
              {articles.length === 0 && <Typography align="center" color="text.secondary" sx={{ py: 4 }}>Chưa có bài viết nào.</Typography>}
            </List>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Bộ Flashcard của tôi ({flashcardSets.length})</Typography>
            </Box>
            <List>
              {flashcardSets.map((set) => (
                <ListItem key={set.id} divider sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <ListItemText primary={<Typography fontWeight="bold">{set.title}</Typography>} secondary={`${set.cards?.length || 0} thẻ`} />
                    <FormControlLabel
                      control={<Switch checked={set.is_public} onChange={() => handleToggleFlashcardSetPrivacy(set)} color="secondary" />}
                      label={set.is_public ? "Đang Công Khai" : "Chỉ Mình Tôi"}
                      labelPlacement="start"
                    />
                  </Box>
                </ListItem>
              ))}
              {flashcardSets.length === 0 && <Typography align="center" color="text.secondary" sx={{ py: 4 }}>Chưa có bộ flashcard nào.</Typography>}
            </List>
          </Box>
        )}
      </Paper>

      {/* MODALS */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold" color="primary">Tạo Ngân Hàng Mới</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Tên ngân hàng" fullWidth required value={bankName} onChange={e => setBankName(e.target.value)} sx={{ mb: 2, mt: 1 }} />
          <TextField margin="dense" label="Mô tả" fullWidth multiline rows={3} value={bankDesc} onChange={e => setBankDesc(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreateBank} variant="contained">Xác nhận tạo</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openArticle} onClose={() => setOpenArticle(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold" color="primary">Tạo Bài Viết Mới</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Chủ đề (Tùy chọn)" value={articleFormData.topic} onChange={e => setArticleFormData({ ...articleFormData, topic: e.target.value })} sx={{ mt: 1, mb: 2 }}>
            <MenuItem value="">-- Không chọn --</MenuItem>
            {topics.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </TextField>
          <TextField autoFocus margin="dense" label="Tiêu đề bài viết" fullWidth required value={articleFormData.title} onChange={e => setArticleFormData({ ...articleFormData, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Nội dung" fullWidth required multiline rows={8} value={articleFormData.content} onChange={e => setArticleFormData({ ...articleFormData, content: e.target.value })} />
          <FormControlLabel
            control={<Switch checked={articleFormData.is_public} onChange={e => setArticleFormData({ ...articleFormData, is_public: e.target.checked })} color="primary" />}
            label="Công khai bài viết (Ai cũng có thể xem)"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenArticle(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreateArticle} variant="contained">Đăng Bài</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFlashcard} onClose={() => setOpenFlashcard(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold" color="secondary">Tạo Bộ Flashcard</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Tên bộ thẻ" fullWidth required value={flashcardFormData.title} onChange={e => setFlashcardFormData({ ...flashcardFormData, title: e.target.value })} sx={{ mt: 1, mb: 2 }} />
          <TextField margin="dense" label="Mô tả" fullWidth value={flashcardFormData.description} onChange={e => setFlashcardFormData({ ...flashcardFormData, description: e.target.value })} sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>Danh sách thẻ:</Typography>
          {cardsData.map((c, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography fontWeight="bold">{idx + 1}.</Typography>
              <TextField label="Mặt trước (Câu hỏi)" fullWidth required value={c.front_text} onChange={e => { const n = [...cardsData]; n[idx].front_text = e.target.value; setCardsData(n); }} />
              <TextField label="Mặt sau (Đáp án)" fullWidth required value={c.back_text} onChange={e => { const n = [...cardsData]; n[idx].back_text = e.target.value; setCardsData(n); }} />
              <IconButton color="error" onClick={() => setCardsData(cardsData.filter((_, i) => i !== idx))}><DeleteIcon /></IconButton>
            </Paper>
          ))}
          <Button startIcon={<AddCircleIcon />} onClick={() => setCardsData([...cardsData, { front_text: '', back_text: '' }])} sx={{ mb: 2 }}>Thêm thẻ</Button>
          <Box>
            <FormControlLabel
              control={<Switch checked={flashcardFormData.is_public} onChange={e => setFlashcardFormData({ ...flashcardFormData, is_public: e.target.checked })} color="secondary" />}
              label="Công khai bộ thẻ này cho mọi người cùng học"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenFlashcard(false)} variant="outlined">Hủy</Button>
          <Button onClick={handleCreateFlashcard} variant="contained" color="secondary">Tạo Bộ Thẻ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
