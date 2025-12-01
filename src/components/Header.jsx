import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/');
  };

return (
    <header className={`header ${isLoginPage ? 'header-login' : ''}`}>
        <div className="header-content">
            <div className="logo">
                <img src="src/assets/logo.png" alt="Logo Cantinho Fraterno" className="logo" />
            </div>
            {!isLoginPage && (
                <button
                    className="settings-button"
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: "#fff" }} />
                    Sair
                </button>
            )}
        </div>
    </header>
);
}

export default Header;