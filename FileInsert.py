
import mysql.connector
from icalendar import Calendar, Event as iEvent
from datetime import datetime, timedelta

def export_to_ics(date_info):
    # Connect to MySQL server
    conn = mysql.connector.connect(
        host="localhost",
        user="your_username",
        password="your_password",
        database="your_database"
    )
    cursor = conn.cursor()
 
    # Select events from MySQL database for the given date
    cursor.execute("SELECT * FROM events WHERE event_date = %s", (date_info,))
    events = cursor.fetchall()
 
    cal = Calendar()
 
    for event in events:
        e = iEvent()
        e.add('summary', event[2])  # Event name
        e.add('dtstart', datetime.strptime(str(event[1]), '%Y-%m-%d'))
        e.add('dtend', datetime.strptime(str(event[1]), '%Y-%m-%d') + timedelta(days=1))  # Assuming events are one day
        if event[4]:  # If recurrence exists
            # Parse recurrence from string to dictionary
            recurrence = eval(event[4])
            interval = recurrence['interval']
            unit = recurrence['unit']
            if unit == 'day':
                e.add('rrule', {'freq': 'daily', 'interval': interval})
            elif unit == 'week':
                e.add('rrule', {'freq': 'weekly', 'interval': interval})
            elif unit == 'month':
                e.add('rrule', {'freq': 'monthly', 'interval': interval})
        cal.add_component(e)
 
    with open('calendar_for_date.ics', 'wb') as f:
        f.write(cal.to_ical())
 
    # Close MySQL connection
    conn.close()

# Prompt user to input date information
date_info = input("Enter the date in YYYY-MM-DD format: ")

# Example usage:
export_to_ics(date_info)
