import { useState, useEffect } from 'react';

const GroupMeetings = () => {
  const [fetchedGroups, setFetchedGroups] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    location: '',
    gender: 'any',
    minAge: '',
    maxAge: '',
    maxParticipants: '',
    date: '',
    time: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  let defaultavatar = 'https://randomuser.me/api/portraits/lego/2.jpg';

  const fetchGroups = async () => {
    try {
      const res = await fetch('https://dating-in-tg.com/many/all');
      const data = await res.json();
      setFetchedGroups(data);
    } catch (err) {
      console.error('❌ Ошибка загрузки встреч:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async () => {
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!telegramId) return alert('Нет Telegram ID');

    const fullDate = new Date(`${newMeeting.date}T${newMeeting.time}`);

    try {
      const res = await fetch('https://dating-in-tg.com/many/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          time: fullDate,
          location: newMeeting.location,
          gender: newMeeting.gender,
          minAge: newMeeting.minAge,
          maxAge: newMeeting.maxAge,
          maxParticipants: newMeeting.maxParticipants,
        }),
      });

      const data = await res.json();

      if (data?.error) {
        setStatusMessage(data.error);
      } else if (data?.status) {
        setStatusMessage(data.status);
        setShowCreateModal(false);
        fetchGroups();
      } else {
        setStatusMessage('❌ Неизвестная ошибка');
      }
    } catch (e) {
      const message = typeof e === 'string' ? e : e?.message || JSON.stringify(e);
      setStatusMessage(`${message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Групповые встречи</h2>

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

      <div style={styles.sectionTitle}>Доступные группы</div>

      {fetchedGroups.map((group) => (
        <div key={group._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <img src={defaultavatar} alt="avatar" style={styles.avatar} />
            <div>
              <div style={styles.whenWhere}>
                <strong>{new Date(group.time).toLocaleString()}</strong>
              </div>
              <div style={styles.location}>{group.location}</div>
            </div>
          </div>
          <div style={styles.requirements}>
            <strong>Кого ищут:</strong>{' '}
            {(group.gender === 'any' ? 'Любой пол' : group.gender === 'male' ? 'Парни' : 'Девушки') +
              (group.minAge || group.maxAge ? `, ${group.minAge || '?'}–${group.maxAge || '?'}` : '')}
          </div>
          <div style={styles.requirements}>
            <strong>Участники:</strong> {group?.candidates?.length || 0}/{group.maxParticipants}
          </div>
          <button
            style={styles.joinButton}
            onClick={async () => {
              const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
              if (!telegramId) return alert('❌ Нет Telegram ID');

              try {
                const res = await fetch('https://dating-in-tg.com/many/apply', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    meetingId: group._id,
                    telegramId,
                  }),
                });

                const data = await res.json();
                alert(data?.status || data?.error || '❌ Неизвестная ошибка');
              } catch (err) {
                alert('❌ Ошибка сети');
              }
            }}
          >
            Участвовать
          </button>
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
            placeholder="Макс. участников"
            value={newMeeting.maxParticipants}
            onChange={(e) => setNewMeeting({ ...newMeeting, maxParticipants: e.target.value })}
            style={styles.input}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 0 }}>
            <button onClick={handleCreate} style={styles.joinButton}>Создать</button>
            <button onClick={() => setShowCreateModal(false)} style={{ ...styles.joinButton, backgroundColor: '#ccc' }}>
              Отмена
            </button>
          </div>

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
    textAlign: 'center',
    marginBottom: 14,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  requirements: {
    fontSize: 14,
    marginTop: 6,
    color: '#444',
  },
  joinButton: {
    marginTop: 12,
    width: '100%',
    padding: 12,
    fontSize: 15,
    backgroundColor: '#00985b',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
  },
};

export default GroupMeetings;