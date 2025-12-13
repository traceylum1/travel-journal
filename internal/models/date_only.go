package models

import (
    "time"
    "fmt"
    "database/sql/driver"
)


type DateOnly time.Time

func (d DateOnly) MarshalJSON() ([]byte, error) {
    t := time.Time(d)
    return []byte(`"` + t.Format("2006-01-02") + `"`), nil
}

func (d *DateOnly) UnmarshalJSON(b []byte) error {
    t, err := time.Parse(`"2006-01-02"`, string(b))
    if err != nil {
        return err
    }
    *d = DateOnly(t)
    return nil
}

// 🔑 REQUIRED FOR POSTGRES INSERTS
func (d DateOnly) Value() (driver.Value, error) {
    t := time.Time(d)
    return time.Date(
        t.Year(), t.Month(), t.Day(),
        0, 0, 0, 0,
        time.UTC,
    ), nil
}

// 🔑 REQUIRED FOR POSTGRES SELECTS
func (d *DateOnly) Scan(value any) error {
    t, ok := value.(time.Time)
    if !ok {
        return fmt.Errorf("cannot scan %T into DateOnly", value)
    }
    *d = DateOnly(t)
    return nil
}