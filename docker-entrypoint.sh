#!/bin/bash

# Función para verificar si Postgres está listo
wait_for_postgres() {
  echo "Esperando a que PostgreSQL esté listo..."
  while ! nc -z $DB_HOST $DB_PORT; do
    sleep 1
  done
  echo "PostgreSQL está listo!"
}

# Espera a que Postgres esté disponible
wait_for_postgres

# Ejecuta las migraciones
echo "Ejecutando migraciones..."
npm run migration:run

# Inicia la aplicación
echo "Iniciando la aplicación..."
npm run start:prod