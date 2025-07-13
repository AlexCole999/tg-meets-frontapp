import { useState, useEffect } from 'react';

const PersonalMeetings = () => {
  const [fetchedMeetings, setFetchedMeetings] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    location: '',
    gender: 'any',
    minAge: '',
    maxAge: '',
    minWeight: '',
    maxWeight: '',
    date: '',
    time: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      date: 'Сегодня, 18:00',
      location: 'Кофейня “Мята”',
      requirements: 'Девушки, 20-30 лет',
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
    {
      id: 2,
      date: 'Завтра, 12:00',
      location: 'ЦУМ, вход №2',
      requirements: 'Парни, 25-35 лет',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
  ]);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('https://dating-in-tg.com/single/all');
      const data = await res.json();
      setFetchedMeetings(data);
    } catch (err) {
      console.error('❌ Ошибка загрузки встреч:', err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async () => {
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!telegramId) return alert('Нет Telegram ID');

    const fullDate = new Date(`${newMeeting.date}T${newMeeting.time}`);

    try {
      const res = await fetch('https://dating-in-tg.com/single/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          time: fullDate,
          location: newMeeting.location,
          gender: newMeeting.gender,
          minAge: newMeeting.minAge,
          maxAge: newMeeting.maxAge,
          minWeight: newMeeting.minWeight,
          maxWeight: newMeeting.maxWeight,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage('✅ Встреча добавлена');
        setShowCreateModal(false);
        fetchMeetings();
      } else {
        setStatusMessage(data || '❌ Ошибка создания');
      }
    } catch (e) {
      setStatusMessage('❌ Ошибка сети');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Личные встречи</h2>

      <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>
        + Создать встречу
      </button>

      <div style={styles.filters}>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Пол</option>
          <option value="male">Парни</option>
          <option value="female">Девушки</option>
        </select>
        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Возраст</option>
          <option value="18-25">18–25</option>
          <option value="26-35">26–35</option>
          <option value="36-45">36–45</option>
        </select>
      </div>

      <div style={styles.sectionTitle}>Доступные встречи</div>

      {meetings.map((meet) => (
        <div key={meet.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <img src={meet.avatar} alt="avatar" style={styles.avatar} />
            <div>
              <div style={styles.whenWhere}><strong>{meet.date}</strong></div>
              <div style={styles.location}>{meet.location}</div>
            </div>
          </div>

          <div style={styles.requirements}>
            <strong>Кого ищут:</strong> {meet.requirements}
          </div>

          <button style={styles.joinButton}>Участвовать</button>
        </div>
      ))}

      {fetchedMeetings.map((meet) => (
        <div key={meet._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.whenWhere}>
                <strong>{new Date(meet.time).toLocaleString()}</strong>
              </div>
              <div style={styles.location}>{meet.location}</div>
            </div>
          </div>
          <div style={styles.requirements}>
            <strong>Кого ищут:</strong>{' '}
            {(meet.gender === 'any' ? 'Любой пол' : meet.gender === 'male' ? 'Парни' : 'Девушки') +
              (meet.minAge || meet.maxAge ? `, ${meet.minAge || '?'}–${meet.maxAge || '?'}` : '')}
          </div>
          <button style={styles.joinButton}>Участвовать</button>
        </div>
      ))}

      {showCreateModal && (
        <div style={styles.modal}>
          <h3>Создать встречу</h3>
          <input
            type="date"
            value={newMeeting.date}
            onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            style={styles.input}
          />
          <input
            type="time"
            value={newMeeting.time}
            onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Локация"
            value={newMeeting.location}
            onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
            style={styles.input}
          />
          <select
            value={newMeeting.gender}
            onChange={(e) => setNewMeeting({ ...newMeeting, gender: e.target.value })}
            style={styles.input}
          >
            <option value="any">Любой пол</option>
            <option value="male">Парни</option>
            <option value="female">Девушки</option>
          </select>
          <input
            placeholder="Мин. возраст"
            value={newMeeting.minAge}
            onChange={(e) => setNewMeeting({ ...newMeeting, minAge: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Макс. возраст"
            value={newMeeting.maxAge}
            onChange={(e) => setNewMeeting({ ...newMeeting, maxAge: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Мин. вес"
            value={newMeeting.minWeight}
            onChange={(e) => setNewMeeting({ ...newMeeting, minWeight: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Макс. вес"
            value={newMeeting.maxWeight}
            onChange={(e) => setNewMeeting({ ...newMeeting, maxWeight: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleCreate} style={styles.joinButton}>Создать</button>
          <button onClick={() => setShowCreateModal(false)} style={{ ...styles.joinButton, backgroundColor: '#ccc' }}>
            Отмена
          </button>
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 16,
    paddingBottom: 80,
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  createButton: {
    width: '100%',
    padding: 14,
    fontSize: 16,
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  filters: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
  },
  select: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  whenWhere: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  requirements: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
    color: '#444',
  },
  joinButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    marginTop: 8,
  },
  modal: {
    position: 'fixed',
    top: '10%',
    left: '5%',
    right: '5%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
};

export default PersonalMeetings;
