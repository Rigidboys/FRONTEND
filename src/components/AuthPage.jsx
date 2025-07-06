import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [form, setForm] = useState({
    name: '',
    userId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    agree: false,
  });

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: loginId,
          password: loginPassword,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || '로그인 실패');
        return;
      }


      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/app');
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!form.agree) {
      setError('개인정보 제공에 동의해주세요.');
      return;
    }

    try {
      console.log("회원가입 데이터:", form);

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.userId,
          password: form.password,
          email: form.email,
          phone: form.phone,
          name: form.name,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log("응답 결과:", data);

      if (!response.ok) {
        alert(data.message || '회원가입 실패');
        return;
      }

      alert('회원가입 성공!');
      navigate('/login');
      setActiveTab('login');
    } catch (error) {
      console.error("fetch 오류 발생:", error);
      alert('서버 오류가 발생했습니다.');
    }

  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <div className="flex justify-around border-b mb-4">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'login' ? 'border-blue-600 text-blue-600' : ''
              }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'signup' ? 'border-blue-600 text-blue-600' : ''
              }`}
          >
            회원가입
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="아이디"
              className="w-full border px-3 py-2 rounded"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full border px-3 py-2 rounded"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
              로그인
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input name="userId" type="text" placeholder="아이디" className="w-full border px-3 py-2 rounded" value={form.userId} onChange={handleFormChange} required />
            <input name="name" type="text" placeholder="이름" className="w-full border px-3 py-2 rounded" value={form.name} onChange={handleFormChange} required />
            <input name="password" type="password" placeholder="비밀번호" className="w-full border px-3 py-2 rounded" value={form.password} onChange={handleFormChange} required />
            <input name="passwordConfirm" type="password" placeholder="비밀번호 확인" className="w-full border px-3 py-2 rounded" value={form.passwordConfirm} onChange={handleFormChange} required />
            <input name="email" type="email" placeholder="이메일" className="w-full border px-3 py-2 rounded" value={form.email} onChange={handleFormChange} required />
            <input name="phone" type="tel" placeholder="연락처" className="w-full border px-3 py-2 rounded" value={form.phone} onChange={handleFormChange} required />
            <label className="flex items-center">
              <input type="checkbox" name="agree" className="mr-2" checked={form.agree} onChange={handleFormChange} />
              개인정보 제공에 동의합니다
            </label>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded">
              회원가입
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
