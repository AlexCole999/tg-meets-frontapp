import { useState, useEffect } from 'react';

const Profile = () => {
  const [showRequests, setShowRequests] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showAcceptedMeetings, setShowAcceptedMeetings] = useState(false);

  const [myGroupMeetings, setMyGroupMeetings] = useState([]);

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

  const [myMeetings, setMyMeetings] = useState([]);
  const [myAcceptedMeetings, setMyAcceptedMeetings] = useState([]);

  useEffect(() => {
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!telegramId) return;

    const fetchAll = async () => {
      try {
        // 1. Загружаем профиль
        const profileRes = await fetch('https://dating-in-tg.com/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId }),
        });

        if (!profileRes.ok) {
          setStatusMessage('❌ Ошибка загрузки профиля');
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData.user);
        setStatusMessage(profileData.status === 'добавлен' ? '🆕 Пользователь добавлен' : '📂 Пользователь загружен');

        // 2. Загружаем встречи, созданные пользователем
        const meetingsRes = await fetch('https://dating-in-tg.com/single/myCreatedMeets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId }),
        });

        const meetingsData = await meetingsRes.json();
        setMyMeetings(meetingsData.meetings || []);

        // 3. Загружаем групповые встречи, созданные пользователем
        const groupMeetingsRes = await fetch('https://dating-in-tg.com/many/mine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId }),
        });
        const groupMeetingsData = await groupMeetingsRes.json();
        setMyGroupMeetings(groupMeetingsData.meetings || []);

        // 4. Загружаем встречи, где пользователь принят
        const acceptedRes = await fetch('https://dating-in-tg.com/single/myAcceptedMeets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId }),
        });
        const acceptedData = await acceptedRes.json();
        setMyAcceptedMeetings(acceptedData.meetings || []);

      } catch (err) {
        console.error('❌ Ошибка сети:', err);
        setStatusMessage('⚠️ Ошибка сети');
      }
    };

    fetchAll();
  }, []);

  const handleAcceptCandidate = async (meetId, telegramId) => {
    const res = await fetch('https://dating-in-tg.com/single/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetId, telegramId }),
    });
    const data = await res.json();

    if (data.status === '✅ Принят') {
      setMyMeetings((prev) =>
        prev.map((m) =>
          m._id === meetId
            ? {
              ...m,
              candidateProfiles: m.candidateProfiles.map((c) =>
                c.telegramId === telegramId
                  ? { ...c, status: 'accepted' }
                  : { ...c, status: 'rejected' }
              ),
            }
            : m
        )
      );
    } else {
      alert(data.error || 'Ошибка при принятии');
    }
  };

  const handleRejectCandidate = async (meetId, telegramId) => {
    const res = await fetch('https://dating-in-tg.com/single/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetId, telegramId }),
    });
    const data = await res.json();

    if (data.status === '✅ Отклонён') {
      setMyMeetings((prev) =>
        prev.map((m) =>
          m._id === meetId
            ? {
              ...m,
              candidateProfiles: m.candidateProfiles.map((c) =>
                c.telegramId === telegramId
                  ? { ...c, status: 'rejected' }
                  : c
              ),
            }
            : m
        )
      );
    } else {
      alert(data.error || 'Ошибка при отклонении');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Профиль</h2>

      <div style={styles.sectionCard}>
        {statusMessage && (
          <div style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
            {statusMessage}
          </div>
        )}
        <ProfileLine label="Имя" value={profile?.name ? profile?.name : '-'} />
        <ProfileLine label="Пол" value={profile?.gender ? profile?.gender : '-'} />
        <ProfileLine label="Возраст" value={`${profile?.age ? profile?.age : '-'}`} />
        <ProfileLine label="Рост" value={`${profile?.height ? profile?.height : '-'} см`} />
        <ProfileLine label="Вес" value={`${profile?.weight ? profile?.weight : '-'} кг`} />
        <ProfileLine label="Город" value={`${profile?.city ? profile?.city : '-'}`} />
        <ProfileLine label="Tg ID" value={tginit} />

        {/* <button
          onClick={async () => {
            const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
            const message = `👋 Привет! У тебя новая встреча в TG Meets.${userId}`

            await fetch('https://dating-in-tg.com/log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: 6820478433, message }),
            });
          }}
          style={styles.editBtn}>ТЕСТ</button> */}
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

      </div>

      <div style={styles.section}>
        <div
          style={styles.toggleRow}
          onClick={() => setShowMeetings(!showMeetings)}
        >
          <span>Созданные встречи 1-1</span>
          <span
            style={{ transform: showMeetings ? 'rotate(90deg)' : 'none' }}
          >
            ▶
          </span>
        </div>

        {showMeetings &&
          myMeetings.map((m) => (
            <div key={m._id} style={styles.meetingCard}>
              <div style={styles.meetingContent}>
                <div style={styles.meetingText}>
                  <div style={styles.meetingType}>💬 Формат: 1-на-1</div>
                  <div style={styles.meetingInfo}>🕒 {new Date(m.time).toLocaleString()}</div>
                  <div style={styles.meetingInfo}>📍 {m.location}</div>
                  <div style={styles.meetingInfo}>
                    🔍 Ищет: {m.gender === 'male' ? 'Мужчину' : m.gender === 'female' ? 'Женщину' : 'Кого угодно'}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!window.confirm('Удалить встречу?')) return;

                    const res = await fetch('https://dating-in-tg.com/single/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ meetingId: m._id }),
                    });

                    const data = await res.json();
                    if (data.status === '✅ Удалено') {
                      setMyMeetings((prev) => prev.filter((item) => item._id !== m._id));
                    } else {
                      alert(data.error || 'Ошибка удаления');
                    }
                  }}
                  style={styles.deleteBtn}
                >
                  🗑 Удалить
                </button>

              </div>
              {m.candidateProfiles?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Заявки:</div>
                  {m.candidateProfiles.map((cand) => (
                    <div key={cand.telegramId} style={styles.requestCard}>
                      <div style={styles.profileLine}>
                        <strong>{cand.name || 'Без имени'}</strong> — {cand.age} лет, {cand.city}, {cand.gender}
                      </div>
                      <div style={styles.profileLine}>
                        Статус:{' '}
                        <strong>
                          {{
                            pending: '⏳ Ожидает',
                            accepted: '✅ Принят',
                            rejected: '❌ Отклонён',
                          }[cand.status] || '❓'}
                        </strong>
                      </div>
                      <div style={styles.photoRow}>
                        {cand.photos?.map((url, i) => (
                          <div key={i} style={styles.photoBox}>
                            <img src={url} alt="Фото" style={styles.photo} />
                          </div>
                        ))}
                      </div>
                      {cand.status === 'pending' && (
                        <div style={styles.buttonRow}>
                          <button
                            style={styles.acceptBtn}
                            onClick={() => handleAcceptCandidate(m._id, cand.telegramId)}
                          >
                            Принять
                          </button>
                          <button
                            style={styles.rejectBtn}
                            onClick={() => handleRejectCandidate(m._id, cand.telegramId)}
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}


        {showEdit && editableProfile && (
          <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
              <h3 style={modalStyles.title}>Редактировать профиль</h3>

              {['name', 'gender', 'age', 'height', 'weight', 'city'].map((field) => (
                <div key={field} style={modalStyles.inputBlock}>
                  <label style={modalStyles.label}>
                    {{
                      name: 'Имя',
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

        <div style={styles.section}>
          <div
            style={styles.toggleRow}
            onClick={() => setShowRequests(!showRequests)}
          >
            <span>Созданные групповые встречи</span>
            <span style={{ transform: showRequests ? 'rotate(90deg)' : 'none' }}>▶</span>
          </div>

          {showRequests &&
            myGroupMeetings.map((m) => (
              <div key={m._id} style={styles.meetingCard}>
                <div style={styles.meetingContent}>
                  <div style={styles.meetingText}>
                    <div style={styles.meetingType}>👥 Формат: групповая</div>
                    <div style={styles.meetingInfo}>🕒 {new Date(m.time).toLocaleString()}</div>
                    <div style={styles.meetingInfo}>📍 {m.location}</div>
                    <div style={styles.meetingInfo}>
                      🔍 Ищет: {m.gender === 'male' ? 'Мужчин' : m.gender === 'female' ? 'Женщин' : 'Кого угодно'}
                    </div>
                    <div style={styles.meetingInfo}>👤 Участников: до {m.maxParticipants}</div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!window.confirm('Удалить встречу?')) return;

                      const res = await fetch('https://dating-in-tg.com/many/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ meetingId: m._id }),
                      });

                      const data = await res.json();
                      if (data.status === '✅ Удалено') {
                        setMyGroupMeetings((prev) => prev.filter((item) => item._id !== m._id));
                      } else {
                        alert(data.error || 'Ошибка удаления');
                      }
                    }}
                    style={styles.deleteBtn}
                  >
                    🗑 Удалить
                  </button>
                </div>

                {m.candidateProfiles?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Заявки:</div>
                    {m.candidateProfiles.map((cand) => (
                      <div key={cand.telegramId} style={styles.requestCard}>
                        <div style={styles.profileLine}>
                          <strong>{cand.name || 'Без имени'}</strong> — {cand.age} лет, {cand.city}
                        </div>
                        <div style={styles.profileLine}>
                          Статус:{' '}
                          <strong>
                            {{
                              pending: '⏳ Ожидает',
                              accepted: '✅ Принят',
                              rejected: '❌ Отклонён',
                            }[cand.status] || '❓'}
                          </strong>
                        </div>
                        <div style={styles.photoRow}>
                          {cand.photos?.map((url, i) => (
                            <div key={i} style={styles.photoBox}>
                              <img src={url} alt="Фото" style={styles.photo} />
                            </div>
                          ))}
                        </div>
                        {cand.status === 'pending' && (
                          <div style={styles.buttonRow}>
                            <button
                              style={styles.acceptBtn}
                              onClick={async () => {
                                const res = await fetch('https://dating-in-tg.com/many/accept', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ meetId: m._id, telegramId: cand.telegramId }),
                                });
                                const data = await res.json();
                                if (data.status === '✅ Принят') {
                                  setMyGroupMeetings((prev) =>
                                    prev.map((mm) =>
                                      mm._id === m._id
                                        ? {
                                          ...mm,
                                          candidateProfiles: mm.candidateProfiles.map((c) =>
                                            c.telegramId === cand.telegramId
                                              ? { ...c, status: 'accepted' }
                                              : c
                                          ),
                                        }
                                        : mm
                                    )
                                  );
                                } else alert(data.error || 'Ошибка при принятии');
                              }}
                            >
                              Принять
                            </button>
                            <button
                              style={styles.rejectBtn}
                              onClick={async () => {
                                const res = await fetch('https://dating-in-tg.com/many/reject', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ meetId: m._id, telegramId: cand.telegramId }),
                                });
                                const data = await res.json();
                                if (data.status === '✅ Отклонён') {
                                  setMyGroupMeetings((prev) =>
                                    prev.map((mm) =>
                                      mm._id === m._id
                                        ? {
                                          ...mm,
                                          candidateProfiles: mm.candidateProfiles.map((c) =>
                                            c.telegramId === cand.telegramId
                                              ? { ...c, status: 'rejected' }
                                              : c
                                          ),
                                        }
                                        : mm
                                    )
                                  );
                                } else alert(data.error || 'Ошибка при отклонении');
                              }}
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        <div style={styles.section}>
          <div
            style={styles.toggleRow}
            onClick={() => setShowAcceptedMeetings(!showAcceptedMeetings)}
          >
            <span>Встречи, где вы приняты</span>
            <span style={{ transform: showAcceptedMeetings ? 'rotate(90deg)' : 'none' }}>▶</span>
          </div>

          {showAcceptedMeetings &&
            myAcceptedMeetings.map((m) => (
              <div key={m._id} style={styles.meetingCard}>
                <div style={styles.meetingContent}>
                  <div style={styles.meetingText}>
                    <div style={styles.meetingType}>💬 Формат: 1-на-1</div>
                    <div style={styles.meetingInfo}>🕒 {new Date(m.time).toLocaleString()}</div>
                    <div style={styles.meetingInfo}>📍 {m.location}</div>
                    <div style={styles.meetingInfo}>
                      👤 Организатор: <strong>{m.creatorProfile?.name || 'Без имени'}</strong> —{' '}
                      {m.creatorProfile?.age} лет, {m.creatorProfile?.gender}, {m.creatorProfile?.city}
                    </div>
                    <div style={styles.photoRow}>
                      {m.creatorProfile?.photos?.map((url, i) => (
                        <div key={i} style={styles.photoBox}>
                          {url ? <img src={url} alt="Фото" style={styles.photo} /> : <div style={styles.photoPlaceholder}>+</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

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
  deleteBtn: {
    marginTop: 8,
    padding: '8px 12px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    cursor: 'pointer',
  }
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
