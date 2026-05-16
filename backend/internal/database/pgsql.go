package database

import (
	"database/sql"
	"fmt"
	"log"

	// Driver para PostgreSQL
	_ "github.com/jackc/pgx/v5/stdlib"
	
	// Golang-migrate
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// Connect ahora recibe un DSN (Data Source Name)
func Connect(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	// El pool de conexiones es VITAL en Postgres
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)

	// Verificamos que la conexión a Postgres sea exitosa
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

// RunMigrations ejecuta las migraciones de golang-migrate
func RunMigrations(db *sql.DB) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("could not create database driver: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres", driver)
	if err != nil {
		return fmt.Errorf("could not create migration instance: %v", err)
	}

	// Ejecutar migraciones
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not run up migrations: %v", err)
	}

	if err == migrate.ErrNoChange {
		log.Println("✅ No hay nuevas migraciones para aplicar")
	} else {
		log.Println("🚀 Migraciones aplicadas con éxito")
	}

	return nil
}
