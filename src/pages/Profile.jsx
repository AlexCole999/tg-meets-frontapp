import { useState, useEffect } from 'react';

const Profile = () => {
  const [showRequests, setShowRequests] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);

  const [statusMessage, setStatusMessage] = useState('none');

  const [showEdit, setShowEdit] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);

  const tginit = window.Telegram?.WebApp?.initDataUnsafe?.user?.id

  const [profile, setProfile] = useState(null);

  const incomingRequests = [
    {
      telegramId: 1,
      gender: 'Женщина',
      age: 25,
      city: 'Самарканд',
      photos: [
        'https://randomuser.me/api/portraits/women/65.jpg',
        'https://randomuser.me/api/portraits/women/65.jpg',
        'https://randomuser.me/api/portraits/women/65.jpg',
      ],
    },
    {
      telegramId: 2,
      gender: 'Мужчина',
      age: 30,
      city: 'Бухара',
      photos: [
        'https://randomuser.me/api/portraits/men/44.jpg',
        'https://randomuser.me/api/portraits/men/44.jpg',
        'https://randomuser.me/api/portraits/men/44.jpg',
      ],
    },
  ];

  const myMeetings = [
    {
      id: 1,
      type: '1-на-1',
      info: 'Сегодня, 18:00 — Мята, с Алина (25)',
      avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
    },
    {
      id: 2,
      type: 'Группа',
      info: 'Завтра, 14:00 — Коворкинг “WorkSpace”',
      avatar: 'https://randomuser.me/api/portraits/men/73.jpg',
    },
  ];

  useEffect(() => {
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!telegramId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('https://dating-in-tg.com/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId }),
        });

        if (res.ok) {
          const data = await res.json();

          if (data.user) {
            setProfile(data.user); // 💾 загрузка профиля в стейт
          }

          if (data.status === 'добавлен') {
            setStatusMessage('🆕 Пользователь добавлен');
          } else {
            setStatusMessage('📂 Пользователь загружен');
          }
        } else {
          setStatusMessage('❌ Ошибка загрузки профиля');
        }
      } catch (err) {
        setStatusMessage('⚠️ Ошибка сети');
      }
    };

    fetchProfile();
  }, []);


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Профиль</h2>

      <div style={styles.sectionCard}>
        {statusMessage && (
          <div style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
            {statusMessage}
          </div>
        )}
        <ProfileLine label="Пол" value={profile?.gender ? profile?.gender : '-'} />
        <ProfileLine label="Возраст" value={`${profile?.age ? profile?.age : '-'}`} />
        <ProfileLine label="Рост" value={`${profile?.height ? profile?.height : '-'} см`} />
        <ProfileLine label="Вес" value={`${profile?.weight ? profile?.weight : '-'} кг`} />
        <ProfileLine label="Город" value={`${profile?.city ? profile?.city : '-'}`} />
        <ProfileLine label="Tg ID" value={tginit} />

        <button
          onClick={async () => {
            const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
            const message = `👋 Привет! У тебя новая встреча в TG Meets.${userId}`

            await fetch('https://dating-in-tg.com/log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: 6820478433, message }),
            });
          }}
          style={styles.editBtn}>ТЕСТ</button>
        <button
          onClick={() => {
            setEditableProfile({ ...profile });
            setShowEdit(true);
          }}
          style={{ ...styles.editBtn, backgroundColor: '#1976d2' }}
        >
          РЕДАКТИРОВАТЬ
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.subheading}>Фото</div>
        <div style={styles.photoRow}>
          {profile?.photos?.map((photo, i) => (
            <div key={i} style={styles.photoBox}>
              {photo ? (
                <img src={photo} alt={`Фото ${i + 1}`} style={styles.photo} />
              ) : (
                <div style={styles.photoPlaceholder}>+</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div
          style={styles.toggleRow}
          onClick={() => setShowRequests(!showRequests)}
        >
          <span>Заявки на участие</span>
          <span style={styles.badge}>{incomingRequests.length}</span>
        </div>

        {showRequests &&
          incomingRequests.map((applicant, i) => (
            <div key={i} style={styles.requestCard}>
              <div style={styles.profileLine}>
                <strong>Telegram ID:</strong> {applicant.telegramId}
              </div>
              <div style={styles.profileLine}>
                <strong>Пол:</strong> {applicant.gender}
              </div>
              <div style={styles.profileLine}>
                <strong>Возраст:</strong> {applicant.age}
              </div>
              <div style={styles.profileLine}>
                <strong>Город:</strong> {applicant.city}
              </div>

              <div style={styles.photoRow}>
                {applicant.photos.map((url, idx) => (
                  <div key={idx} style={styles.photoBox}>
                    <img src={url} alt="Фото" style={styles.photo} />
                  </div>
                ))}
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.acceptBtn}>Принять</button>
                <button style={styles.rejectBtn}>Отклонить</button>
              </div>
            </div>
          ))}
      </div>

      <div style={styles.section}>
        <div
          style={styles.toggleRow}
          onClick={() => setShowMeetings(!showMeetings)}
        >
          <span>Мои встречи</span>
          <span
            style={{ transform: showMeetings ? 'rotate(90deg)' : 'none' }}
          >
            ▶
          </span>
        </div>

        {showMeetings &&
          myMeetings.map((m) => (
            <div key={m.id} style={styles.meetingCard}>
              <div style={styles.meetingContent}>
                <div style={styles.meetingText}>
                  <div style={styles.meetingType}>{m.type}</div>
                  <div style={styles.meetingInfo}>{m.info}</div>
                </div>
                <img
                  src={m.avatar}
                  alt="avatar"
                  style={styles.meetingAvatar}
                />
              </div>
            </div>
          ))}

        {showEdit && editableProfile && (
          <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
              <h3 style={modalStyles.title}>Редактировать профиль</h3>

              {['gender', 'age', 'height', 'weight', 'city'].map((field) => (
                <div key={field} style={modalStyles.inputBlock}>
                  <label style={modalStyles.label}>
                    {{
                      gender: 'Пол',
                      age: 'Возраст',
                      height: 'Рост',
                      weight: 'Вес',
                      city: 'Город',
                    }[field]}
                  </label>
                  <input
                    type={['age', 'height', 'weight'].includes(field) ? 'number' : 'text'}
                    value={editableProfile[field] || ''}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    style={modalStyles.input}
                  />
                </div>
              ))}

              <div style={modalStyles.buttonRow}>
                <button
                  onClick={() => setShowEdit(false)}
                  style={modalStyles.cancelBtn}
                >
                  Отмена
                </button>
                <button
                  onClick={async () => {
                    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
                    if (!telegramId) return;

                    const res = await fetch('https://dating-in-tg.com/profileEdit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ telegramId, ...editableProfile }),
                    });

                    if (res.ok) {
                      const data = await res.json();
                      setStatusMessage('✅ Профиль обновлён');
                      setShowEdit(false);
                      setProfile(data.user); // 🔄 перерендер с новыми данными
                    } else {
                      setStatusMessage('❌ Ошибка при обновлении');
                    }
                  }}
                  style={modalStyles.saveBtn}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ProfileLine = ({ label, value }) => (
  <div style={styles.profileLine}>
    <strong>{label}:</strong> <span style={{ marginLeft: 6 }}>{value}</span>
  </div>
);

const styles = {
  container: {
    padding: 16,
    paddingBottom: 80,
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#fafafa',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  subheading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  section: {
    marginBottom: 28,
  },
  sectionCard: {
    marginBottom: 28,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    cursor: 'pointer',
    color: '#333',
  },
  badge: {
    backgroundColor: '#e53935',
    color: 'white',
    borderRadius: 12,
    padding: '2px 8px',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileLine: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
  editBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#4fc3f7',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    width: '100%',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  photoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
  },
  photoBox: {
    width: '32%',
    aspectRatio: '1 / 1',
    backgroundColor: '#eee',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    fontSize: 32,
    color: '#bbb',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  buttonRow: {
    display: 'flex',
    gap: 10,
    marginTop: 12,
  },
  acceptBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
  },
  rejectBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
  },
  meetingCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  meetingType: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  meetingInfo: {
    fontSize: 14,
    color: '#222',
  },
  meetingContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetingText: {
    flex: 1,
    marginRight: 10,
  },
  meetingAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  inputBlock: {
    marginBottom: 12,
  },
  label: {
    display: 'block',
    marginBottom: 4,
    fontSize: 14,
    color: '#444',
  },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: 8,
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 8,
  },
};

export default Profile;
