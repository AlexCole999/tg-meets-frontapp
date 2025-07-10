import { useState } from 'react';

const GroupMeetings = () => {
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  const [groups, setGroups] = useState([
    {
      id: 1,
      title: 'Прогулка в парке',
      date: 'Сегодня, 19:00',
      location: 'Парк имени Навои',
      participants: 4,
      limit: 10,
      requirements: 'Девушки, 20-30 лет',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    {
      id: 2,
      title: 'Играем в мафию',
      date: 'Завтра, 15:00',
      location: 'Антикафе “TimeOut”',
      participants: 7,
      limit: 8,
      requirements: 'Парни и девушки, 18-25 лет',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Групповые встречи</h2>

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

      <div style={styles.sectionTitle}>Доступные группы</div>

      {groups.map((group) => (
        <div key={group.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <img src={group.avatar} alt="avatar" style={styles.avatar} />
            <div>
              <div style={styles.title}>{group.title}</div>
              <div style={styles.dateLoc}>{group.date} — {group.location}</div>
            </div>
          </div>

          <div style={styles.line}><strong>Участники:</strong> {group.participants}/{group.limit}</div>
          <div style={styles.line}><strong>Кого ищут:</strong> {group.requirements}</div>

          <button style={styles.joinButton}>Подать заявку</button>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  dateLoc: {
    fontSize: 14,
    color: '#555',
  },
  line: {
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
