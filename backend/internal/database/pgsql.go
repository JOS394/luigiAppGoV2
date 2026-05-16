package database

import (
	"database/sql"
	"os"

	// Importamos el driver stdlib de pgx para usarlo con database/sql
	_ "github.com/jackc/pgx/v5/stdlib"
)

// Connect ahora recibe un DSN (Data Source Name) en lugar de un path de archivo
func Connect(dsn string) (*sql.DB, error) {
	// Cambiamos "sqlite3" por "pgx"
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	// El pool de conexiones es VITAL en Postgres, lo configuramos un poco más alto
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)

	// Verificamos que la conexión a Postgres sea exitosa
	return db, db.Ping()
}

// SetupDatabase se mantiene exactamente igual (la ventaja de usar database/sql)
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
