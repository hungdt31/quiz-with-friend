import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArticleIcon from '@mui/icons-material/Article';
import StyleIcon from '@mui/icons-material/Style';
import QuizList from './pages/QuizList';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateQuiz from './pages/CreateQuiz';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import MyHistory from './pages/MyHistory';
import Profile from './pages/Profile';
import BankDetails from './pages/BankDetails';
import Articles from './pages/Articles';
import ArticleDetails from './pages/ArticleDetails';
import Flashcards from './pages/Flashcards';
import { logoutUser } from './api';
import './index.css';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
    ...(mode === 'dark' ? {
      background: { default: '#0f172a', paper: '#1e293b' },
    } : {
      background: { default: '#f8fafc', paper: '#ffffff' },
    }),
  },
  typography: { fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
  }
});

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    const handleAuthChange = () => setUser(localStorage.getItem('username'));
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={0} sx={{ borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent' }}>
          <Toolbar>
            <FlashOnIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: mode === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>
              H<span style={{ color: '#3b82f6' }}>Quiz</span>
            </Typography>

            <IconButton onClick={toggleTheme} sx={{ mr: 2, color: mode === 'dark' ? '#fff' : '#000' }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button component={RouterLink} to="/articles" sx={{ color: 'text.primary' }} startIcon={<ArticleIcon />}>Forum</Button>
                <Button component={RouterLink} to="/flashcards" sx={{ color: 'text.primary' }} startIcon={<StyleIcon />}>Flashcards</Button>
                <Button component={RouterLink} to="/create-quiz" sx={{ color: 'text.primary' }} startIcon={<AddCircleIcon />}>
                  Tạo Đề Thi
                </Button>
                <Button component={RouterLink} to="/history" sx={{ color: 'text.primary' }} startIcon={<HistoryIcon />}>
                  Lịch sử
                </Button>
                <Button component={RouterLink} to="/profile" sx={{ color: 'text.primary' }} startIcon={<PersonIcon />}>
                  {user}
                </Button>
                <Button variant="outlined" color="primary" onClick={handleLogout} startIcon={<LogoutIcon />}>
                  Đăng xuất
                </Button>
              </Box>
            ) : (
              <Button component={RouterLink} to="/login" variant="outlined" color="primary">
                Đăng nhập
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:id" element={<ArticleDetails />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/history" element={<MyHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bank/:id" element={<BankDetails />} />
            <Route path="/quiz/:id" element={<QuizAttempt />} />
            <Route path="/quiz/:id/result" element={<QuizResult />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
