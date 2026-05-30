package session

import "time"

const UserIDKey = "user_id"
const UsernameKey = "username"

type Session struct {
	createdAt		time.Time
	lastActivityAt	time.Time
	id				string
	data			map[string]any
}

func (s *Session) Get(key string) any {
	return s.data[key]
}

func (s *Session) Put(key string, value any) {
	s.data[key] = value
}

func (s *Session) Delete(key string) {
	delete(s.data, key)
}

func (s *Session) UserID() (int, bool) {
	v := s.Get(UserIDKey)
	if v == nil {
		return 0, false
	}
	id, ok := v.(int)
	return id, ok
}

func (s *Session) Username() (string, bool) {
	v := s.Get(UsernameKey)
	if v == nil {
		return "", false
	}
	name, ok := v.(string)
	return name, ok
}

