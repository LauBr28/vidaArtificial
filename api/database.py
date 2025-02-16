from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from databases import Database

# Configuración de la base de datos SQLite
DATABASE_URL = "sqlite:///./interactions.db"  # La base de datos se guardará en un archivo llamado interactions.db

# Crear el motor de la base de datos
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata = MetaData()

# Definir la tabla de interacciones
interactions = Table(
    "interactions",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("model_name", String(50)),  # Nombre del modelo (ej: "sentiment-analysis")
    Column("input_text", Text),        # Texto de entrada
    Column("output_text", Text),       # Texto de salida (resultado del modelo)
    Column("created_at", DateTime, default=func.now()),  # Fecha y hora de la interacción
)

# Crear la base de datos y la tabla (si no existen)
metadata.create_all(engine)

# Configurar la conexión asíncrona
database = Database(DATABASE_URL)
