import { useState, useEffect } from 'react';

const PersonalMeetings = () => {
  const [fetchedMeetings, setFetchedMeetings] = useState([]);

  const [genderFilter, setGenderFilter] = useState('any');
  const [minAgeFilter, setMinAgeFilter] = useState(null);
  const [maxAgeFilter, setMaxAgeFilter] = useState(null);

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

  let defaultavatar = 'https://randomuser.me/api/portraits/lego/2.jpg'

  const fetchMeetings = async () => {
    try {
      const params = new URLSearchParams();

      if (genderFilter) params.append('gender', genderFilter);
      if (minAgeFilter) params.append('minAge', minAgeFilter);
      if (maxAgeFilter) params.append('maxAge', maxAgeFilter);

      const res = await fetch(`https://dating-in-tg.com/single/all?${params.toString()}`);
      const data = await res.json();
      setFetchedMeetings(data);
    } catch (err) {
      console.error('❌ Ошибка загрузки встреч:', err);
    }
  };

  useEffect(() => {

    fetchMeetings();
  }, [genderFilter, minAgeFilter, maxAgeFilter]);

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

      if (data?.error) {
        setStatusMessage(data.error);
      } else if (data?.status) {
        setStatusMessage(data.status);
        setShowCreateModal(false);
        fetchMeetings();
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
      <h2 style={styles.heading}>Личные встречи</h2>

      <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>
        + Создать встречу
      </button>

      <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>Искать встречи, где люди ищут:</div>


      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {/* Пол */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          style={{
            flex: '1',
            padding: '6px 8px',
            fontSize: 14,
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#fff',
            maxWidth: 120,
          }}
        >
          <option value="">Пол</option>
          <option value="male">Парни</option>
          <option value="female">Девушки</option>
        </select>

        {/* Мин возраст*/}
        <input
          type="number"
          placeholder="Мин. возраст"
          value={maxAgeFilter}
          onChange={(e) => setMaxAgeFilter(e.target.value)}
          style={{
            width: 90,
            padding: '6px 8px',
            fontSize: 14,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
          min={18}
          max={99}
        />

        {/* Макс возраст */}
        <input
          type="number"
          placeholder="Макс. возраст"
          value={minAgeFilter}
          onChange={(e) => setMinAgeFilter(e.target.value)}
          style={{
            width: 90,
            padding: '6px 8px',
            fontSize: 14,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
          min={18}
          max={99}
        />
      </div>

      <div style={styles.sectionTitle}>Доступные встречи</div>

      {fetchedMeetings.map((meet) => {
        const creatorPhoto =
          meet.creatorProfile?.photos?.find((p) => !!p) || defaultavatar;
        return (
          <div key={meet._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <img src={creatorPhoto} alt="avatar" style={styles.avatar} />
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
            <button
              style={styles.joinButton}
              onClick={async () => {
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
                if (!telegramId) return alert('❌ Нет Telegram ID');

                try {
                  const res = await fetch('https://dating-in-tg.com/single/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      meetingId: meet._id,
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
        )
      }
      )
      }

      {showCreateModal && (
        <div style={styles.modal}>
          <h3>Создать встречу</h3>
          <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>Дата встречи</div>
          <input
            type="date"
            value={newMeeting.date}
            onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            style={styles.input}
          />
          <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>Время встречи</div>
          <input
            type="time"
            value={newMeeting.time}
            onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Место встречи"
            value={newMeeting.location}
            onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
            style={styles.input}
          />
          <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '12px', marginTop: '12px', marginBottom: '6px' }}>Кто может откликаться на встречу</div>
          <select
            value={newMeeting.gender}
            onChange={(e) => setNewMeeting({ ...newMeeting, gender: e.target.value })}
            style={styles.input}
          >
            <option value="any">Любой пол</option>
            <option value="male">Парни</option>
            <option value="female">Девушки</option>
          </select>

          {/* 🎚️ Ползунок минимального возраста */}
          <label style={{ fontSize: 14, marginTop: 10, display: 'block' }}>
            Мин. возраст: {newMeeting.minAge || 18}
          </label>
          <input
            type="range"
            min="18"
            max="80"
            value={newMeeting.minAge || 18}
            onChange={(e) =>
              setNewMeeting({ ...newMeeting, minAge: e.target.value })
            }
            style={{ width: '95%', marginBottom: 8 }}
          />

          {/* 🎚️ Ползунок максимального возраста */}
          <label style={{ fontSize: 14, marginTop: 10, display: 'block' }}>
            Макс. возраст: {newMeeting.maxAge || 80}
          </label>
          <input
            type="range"
            min="18"
            max="80"
            value={newMeeting.maxAge || 80}
            onChange={(e) =>
              setNewMeeting({ ...newMeeting, maxAge: e.target.value })
            }
            style={{ width: '95%', marginBottom: 8 }}
          />

          {/* 🎚️ Ползунок минимального веса */}
          {/* <label style={{ fontSize: 14, marginTop: 10, display: 'block' }}>
            Мин. вес (кг): {newMeeting.minWeight || 40}
          </label>
          <input
            type="range"
            min="40"
            max="150"
            value={newMeeting.minWeight || 40}
            onChange={(e) =>
              setNewMeeting({ ...newMeeting, minWeight: e.target.value })
            }
            style={{ width: '95%', marginBottom: 8 }}
          /> */}

          {/* 🎚️ Ползунок максимального веса */}
          {/* <label style={{ fontSize: 14, marginTop: 10, display: 'block' }}>
            Макс. вес (кг): {newMeeting.maxWeight || 150}
          </label>
          <input
            type="range"
            min="40"
            max="150"
            value={newMeeting.maxWeight || 150}
            onChange={(e) =>
              setNewMeeting({ ...newMeeting, maxWeight: e.target.value })
            }
            style={{ width: '95%', marginBottom: 8 }}
          /> */}

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
    top: '3%',
    left: '5%',
    right: '5%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  input: {
    width: '95%',
    padding: 8,
    fontSize: 12,
    marginBottom: 8,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
};

export default PersonalMeetings;
