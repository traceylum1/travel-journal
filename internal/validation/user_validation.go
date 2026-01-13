package validation

import "regexp"

var (
	usernameAllowed = regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	passwordSpecial = regexp.MustCompile(`[ -/:-@[-` + "`" + `{-~]`)
)

func IsUsernameValid(username string) bool {
	if len(username) < 5 || len(username) > 15 {
		return false
	}
	return usernameAllowed.MatchString(username)
}

func IsPasswordValid(password string) bool {
	if len(password) < 8 || len(password) > 20 {
		return false
	}
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := passwordSpecial.MatchString(password)

	return hasLower && hasUpper && hasDigit && hasSpecial
}