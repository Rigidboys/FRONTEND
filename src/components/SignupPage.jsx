import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    agree: false,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!form.agree) {
      setError('개인정보 제공에 동의해주세요.');
      return;
    }

    // 여기에 실제 회원가입 API 요청 코드 추가 예정
    alert('회원가입 성공!');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="id"
          type="text"
          placeholder="아이디"
          className="w-full border rounded p-2"
          value={form.id}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          className="w-full border rounded p-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="passwordConfirm"
          type="password"
          placeholder="비밀번호 확인"
          className="w-full border rounded p-2"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="이메일"
          className="w-full border rounded p-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="연락처"
          className="w-full border rounded p-2"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="mr-2"
          />
          개인정보 제공에 동의합니다
        </label>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
