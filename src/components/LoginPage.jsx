import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: API 연결
    if (id === 'admin' && password === '1234') {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/?tab=customer');   
    } else {
      alert('아이디나 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">로그인</h2>
        <input className="border w-full mb-4 p-2 rounded" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
        <input className="border w-full mb-4 p-2 rounded" placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">로그인</button>
      </form>
    </div>
  );
}
