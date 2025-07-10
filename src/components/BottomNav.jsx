import { useState } from 'react';

const BottomNav = ({ currentPage, setCurrentPage }) => {
  const buttons = [
    { id: 'personal', label: '1-на-1' },
    { id: 'group', label: 'Группы' },
    { id: 'profile', label: 'Профиль' },
  ];

  return (
    <nav style={styles.nav}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => setCurrentPage(btn.id)}
          style={{
            ...styles.button,
            color: currentPage === btn.id ? '#fff' : '#888',
          }}
        >
          <div style={styles.innerWrap}>
            <span style={styles.label}>{btn.label}</span>
            {currentPage === btn.id && <div style={styles.activeBar} />}
          </div>
        </button>
      ))}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0e0e0e', // почти чёрный
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #1a1a1a',
    fontFamily: 'system-ui, sans-serif',
    zIndex: 100,
  },
  button: {
    flex: 1,
    height: '100%',
    background: 'none',
    border: 'none',
    outline: 'none',
    fontSize: 16,
    fontWeight: 'bold',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: '#0e0e2e'
  },
  innerWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  label: {
    pointerEvents: 'none',
  },
  activeBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 4,
    backgroundColor: '#4fc3f7',
    borderRadius: 2,
  },
};

export default BottomNav;
