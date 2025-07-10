import { useState } from 'react';

const PersonalMeetings = () => {
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Личные встречи</h2>

      <button style={styles.createButton}>+ Создать встречу</button>

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
  },
};

export default PersonalMeetings;
