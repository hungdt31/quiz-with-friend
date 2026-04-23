import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Tooltip, Avatar, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArticleIcon from '@mui/icons-material/Article';
import StyleIcon from '@mui/icons-material/Style';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
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
    primary: { main: '#6c63ff' },
    secondary: { main: '#8b5cf6' },
    ...(mode === 'dark' ? {
      background: { default: '#0f172a', paper: '#1e293b' },
    } : {
      background: { default: '#f0f2f5', paper: '#ffffff' },
    }),
  },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.07)',
        }
      }
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
  }
});

const NAV_ITEMS = [
  { icon: <DashboardIcon />, label: 'Đề Thi', to: '/' },
  { icon: <ArticleIcon />, label: 'Forum', to: '/articles' },
  { icon: <StyleIcon />, label: 'Flashcards', to: '/flashcards' },
  { icon: <AddCircleIcon />, label: 'Tạo Đề', to: '/create-quiz' },
  { icon: <HistoryIcon />, label: 'Lịch Sử', to: '/history' },
  { icon: <PersonIcon />, label: 'Cá Nhân', to: '/profile' },
];

const PAGE_TITLES = {
  '/': 'Đề Thi',
  '/articles': 'Diễn Đàn Học Tập',
  '/flashcards': 'Kho Flashcards',
  '/create-quiz': 'Tạo Đề Thi',
  '/history': 'Lịch Sử Làm Bài',
  '/profile': 'Trang Cá Nhân',
  '/login': 'Đăng Nhập',
  '/register': 'Đăng Ký',
};

const HeaderContext = createContext();
export const useHeader = () => useContext(HeaderContext);

function TopBar({ onToggleSidebar }) {
  const { headerExtra } = useHeader();
  const location = useLocation();
  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] || 'FlashQuiz';

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 3,
      py: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      position: 'sticky',
      top: 0,
      bgcolor: 'background.paper',
      zIndex: 10,
      borderRadius: '16px 16px 0 0',
    }}>
      <Box
        onClick={onToggleSidebar}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 2,
          cursor: 'pointer', color: 'text.secondary',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
        }}
      >
        <MenuIcon fontSize="small" />
      </Box>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {headerExtra}
      </Box>
    </Box>
  );
}

function Sidebar({ mode, onToggleTheme, user, onLogout, expanded, onToggle }) {
  const W = expanded ? 220 : 80;
  const location = useLocation();

  const navItemSx = (active) => ({
    width: expanded ? `calc(100% - 16px)` : 52,
    mx: expanded ? 1 : 0,
    height: 48,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: expanded ? 'flex-start' : 'center',
    gap: 1.5,
    px: expanded ? 1.5 : 0,
    color: active ? 'primary.main' : 'text.secondary',
    background: active ? 'action.selected' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
    '&:hover': { background: 'action.hover', color: 'text.primary' },
    overflow: 'hidden',
    flexShrink: 0,
    cursor: 'pointer',
  });

  return (
    // Outer wrapper: sticky, no overflow hidden, so toggle button can escape
    <Box sx={{
      position: 'sticky',
      top: 0,
      height: '100vh',
      width: W,
      flexShrink: 0,
      zIndex: 100,
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Inner sidebar — has overflow hidden to clip its own content */}
      <Box sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: expanded ? 'flex-start' : 'center',
        py: 3,
        gap: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
      }}>
        {/* Logo */}
        <Box sx={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          px: expanded ? 2 : 0, mb: 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', minWidth: 0 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2.5, flexShrink: 0,
              bgcolor: 'primary.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FlashOnIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            {expanded && (
              <Typography sx={{ color: 'text.primary', fontWeight: 800, fontSize: 18, whiteSpace: 'nowrap' }}>
                Flash<span style={{ color: '#6c63ff' }}>Quiz</span>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Nav Items */}
        {user && NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          const navBox = (
            <Box component={RouterLink} to={item.to} key={item.to} sx={navItemSx(active)}>
              <Box sx={{ flexShrink: 0, display: 'flex' }}>{item.icon}</Box>
              {expanded && (
                <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', color: 'inherit' }}>
                  {item.label}
                </Typography>
              )}
            </Box>
          );
          return expanded
            ? navBox
            : <Tooltip title={item.label} placement="right" key={item.to}>{navBox}</Tooltip>;
        })}

        <Box sx={{ flex: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={expanded ? '' : (mode === 'dark' ? 'Chế độ sáng' : 'Chế độ tối')} placement="right">
          <Box onClick={onToggleTheme} sx={{
            ...navItemSx(false),
            height: 44,
          }}>
            {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            {expanded && (
              <Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: 'inherit', fontWeight: 500 }}>
                {mode === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {/* User */}
        {user ? (
          <Tooltip title={expanded ? '' : `${user} — Đăng xuất`} placement="right">
            <Box onClick={onLogout} sx={{ ...navItemSx(false), height: 50, mt: 1 }}>
              <Avatar sx={{
                width: 36, height: 36, flexShrink: 0,
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                fontSize: 15, fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
                {user.charAt(0).toUpperCase()}
              </Avatar>
              {expanded && (
                <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    Đăng xuất
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>
        ) : (
          <Tooltip title={expanded ? '' : 'Đăng nhập'} placement="right">
            <Box component={RouterLink} to="/login" sx={{
              ...navItemSx(false),
              height: 46, mt: 1,
            }}>
              <PersonIcon fontSize="small" sx={{ flexShrink: 0 }} />
              {expanded && (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit', whiteSpace: 'nowrap' }}>
                  Đăng nhập
                </Typography>
              )}
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [headerExtra, setHeaderExtra] = useState(null);

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
      <HeaderContext.Provider value={{ headerExtra, setHeaderExtra }}>
        <Router>
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', p: { xs: 1, sm: 1.5 }, gap: 1.5 }}>
            <Sidebar mode={mode} onToggleTheme={toggleTheme} user={user} onLogout={handleLogout} expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(p => !p)} />

            {/* Main content wrapped in a large card */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <TopBar onToggleSidebar={() => setSidebarExpanded(p => !p)} />
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Routes>
                  <Route path="/" element={<QuizList user={user} />} />
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
              </Box>
            </Paper>
          </Box>
        </Router>
      </HeaderContext.Provider>
    </ThemeProvider>
  );
}

export default App;
