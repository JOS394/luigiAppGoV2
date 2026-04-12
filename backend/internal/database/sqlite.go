package database

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func Connect(path string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", path+"?_journal=WAL&_foreign_keys=on")
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	return db, db.Ping()
}

// SetupDatabase lee el archivo .sql y crea la estructura
func SetupDatabase(db *sql.DB) error {
	// Leemos el archivo schema.sql
	script, err := os.ReadFile("sql/schema.sql")
	if err != nil {
		return err
	}

	// Ejecutamos todo el script
	_, err = db.Exec(string(script))
	if err != nil {
		return err
	}

	return nil
}
