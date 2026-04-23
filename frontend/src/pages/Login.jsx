import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../api';
import { Box, Paper, Typography, TextField, Button, Alert, Link } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={3}>
          Đăng Nhập
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            variant="outlined"
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Bắt đầu
          </Button>
        </form>
        
        <Typography align="center" variant="body2">
          Chưa có tài khoản?{' '}
          <Link component={RouterLink} to="/register" color="primary">
            Đăng ký ngay
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
