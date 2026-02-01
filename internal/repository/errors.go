package repository

import "errors"

var (
	ErrInternal				= errors.New("internal error")
	ErrUserAlreadyExists	= errors.New("user already exists")
	ErrUserNotFound			= errors.New("user not found")
)