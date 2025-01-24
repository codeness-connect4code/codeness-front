import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/icons/Codeness_logo.png'
import './Header.css';

const Header = () => {
  const history = useHistory();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('jwtToken');

  const handleLogoClick = () => {
    history.push('/');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const goToMyPage = () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'ADMIN') {
        history.push('/admin/mypage/mentor-request');
      } else {
        history.push('/mypage/profile');
      }
    } catch (error) {
      history.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    history.push('/login');
  };

  return (
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img
              src={logo}
              alt="CodeNess 로고"
              className="h-10 w-auto mr-4"
          />
        </div>

        <nav className="flex space-x-6">
          <Link
              to="/community"
              className="text-gray-800 hover:text-blue-600 transition duration-300"
          >
            커뮤니티
          </Link>

          <Link
              to="/mentoring"
              className="text-gray-800 hover:text-blue-600 transition duration-300"
          >
            멘토링
          </Link>

          <Link
              to="/news"
              className="text-gray-800 hover:text-blue-600 transition duration-300"
          >
            뉴스
          </Link>

          <div className="relative">
            <button
                onClick={toggleUserDropdown}
                className="text-gray-800 hover:text-blue-600 transition duration-300 flex items-center"
            >
              {isLoggedIn ? '마이페이지' : '로그인'}
              <i className="ml-2 fas fa-chevron-down"></i>
            </button>
            {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                  {isLoggedIn ? (
                      <>
                        <button
                            onClick={goToMyPage}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                        >
                          마이페이지
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                        >
                          로그아웃
                        </button>
                      </>
                  ) : (
                      <>
                        <Link
                            to="/login"
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                        >
                          로그인
                        </Link>
                        <Link
                            to="/signup"
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                        >
                          회원가입
                        </Link>
                      </>
                  )}
                </div>
            )}
          </div>
        </nav>
      </header>
  );
};

export default Header;