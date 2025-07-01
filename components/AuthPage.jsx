import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [form, setForm] = useState({
    id: '',
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: loginId,
        password: loginPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    const result = await response.json();

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user_id', result.user_id);
    navigate('/?tab=customer');
  } catch (err) {
    console.error(err);
    alert('아이디나 비밀번호가 올바르지 않습니다.');
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  setError('');

  if (form.password !== form.passwordConfirm) {
    setError('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (!form.agree) {
    setError('개인정보 제공에 동의해주세요.');
    return;
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: form.id,
        password: form.password,
        email: form.email,
        phone: form.phone,
      }),
    });

    if (!response.ok) {
      throw new Error('회원가입 실패');
    }

    alert('회원가입 성공! 로그인 화면으로 이동합니다.');
    navigate('/login');
  } catch (err) {
    console.error(err);
    setError('회원가입 중 문제가 발생했습니다.');
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
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === 'login' ? 'border-blue-600 text-blue-600' : ''
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === 'signup' ? 'border-blue-600 text-blue-600' : ''
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 로그인 폼 */}
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

        {/* 회원가입 폼 */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input name="id" type="text" placeholder="아이디" className="w-full border px-3 py-2 rounded" value={form.id} onChange={handleFormChange} required />
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
