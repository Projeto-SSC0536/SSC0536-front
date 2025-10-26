import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

return (
    <header className={`header ${isLoginPage ? 'header-login' : ''}`}>
        <div className="header-content">
            <div className="logo">
                <img src="src/assets/logo.png" alt="Logo Cantinho Fraterno" className="logo" />
            </div>
            {!isLoginPage && (
                <button className="settings-button" onClick={() => console.log('Settings clicked')}>
                    <FontAwesomeIcon icon={faGear} style={{color: "#fff",}} />
                    Configurações
                </button>
            )}
        </div>
    </header>
);
}

export default Header;