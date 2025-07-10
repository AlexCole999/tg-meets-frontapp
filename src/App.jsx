import { useState } from 'react';
import BottomNav from './components/BottomNav';
import Profile from './pages/Profile';
import PersonalMeetings from './pages/PersonalMeetings';
import GroupMeetings from './pages/GroupMeetings';

const App = () => {
  const [currentPage, setCurrentPage] = useState('profile');

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile />;
      case 'personal':
        return <PersonalMeetings />;
      case 'group':
        return <GroupMeetings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {renderPage()}
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
