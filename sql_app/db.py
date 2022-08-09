import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

DEFAULT_DATABASE_URL = 'sqlite:///{}'.format(os.path.join(basedir, 'sqlite3.db.heroku'))
SQLALCHEMY_DATABASE_URL = DEFAULT_DATABASE_URL

# PG_DB_USER = 'root'
# PG_DB_NAME = 'quickstart_fastapi'
# PG_DB_PASSWORD = 'password'
# PG_DB_HOST = 'localhost'
# PG_DB_PORT = '5432'
# SQLALCHEMY_DATABASE_URL = "postgresql://{user}:{password}@{host}:{port}/{db_name}".format(
#                                         user=PG_DB_USER,
#                                         password=PG_DB_PASSWORD,
#                                         host=PG_DB_HOST,
#                                         port=PG_DB_PORT,
#                                         db_name=PG_DB_NAME)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
