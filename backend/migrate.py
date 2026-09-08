import sqlite3

conn = sqlite3.connect('pawcare.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE pets ADD COLUMN current_medications VARCHAR;")
except sqlite3.OperationalError:
    pass

try:
    cursor.execute("ALTER TABLE pets ADD COLUMN vaccination_status VARCHAR;")
except sqlite3.OperationalError:
    pass

try:
    cursor.execute("ALTER TABLE pets ADD COLUMN previous_medical_history VARCHAR;")
except sqlite3.OperationalError:
    pass

conn.commit()
conn.close()
print("Migration done")
