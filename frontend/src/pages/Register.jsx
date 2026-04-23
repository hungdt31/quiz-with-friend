import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser } from '../api';
import { Box, Paper, Typography, TextField, Button, Alert, Link } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password, email);
      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError('Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={3}>
          Đăng Ký
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleRegister}>
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
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            startIcon={<PersonAddIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Tham gia
          </Button>
        </form>
        
        <Typography align="center" variant="body2">
          Đã có tài khoản?{' '}
          <Link component={RouterLink} to="/login" color="primary">
            Đăng nhập
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
