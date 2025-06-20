import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerTab from './CustomerTab';

export default function MainPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  return (
    <div className="p-6">
      {tab === 'customer' && <CustomerTab />}
      {!tab && <div>기본 홈 화면입니다. 좌측 메뉴나 탭을 선택하세요.</div>}
    </div>
  );
}
