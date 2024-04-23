import mysql.connector
from icalendar import Calendar, Event as iEvent
from datetime import datetime, timedelta

def export_to_ics(host, user, password, database, output_file, student_date_input):
    # Connect to MySQL server
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )
    cursor = conn.cursor()
 
    # Select events from MySQL database
    cursor.execute("SELECT * FROM events")
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
 
    # Close MySQL connection
    conn.close()
 
    # Write the events to an .ics file using the provided function
    with open(output_file, 'wb') as f:
        f.write(cal.to_ical())

    # Create .ics file from the database using provided function
    create_ics_file(host, user, password, database, output_file, student_date_input)

# Example usage:
export_to_ics("localhost", "your_username", "your_password", "your_database", "calendar.ics", "2024-04-23")
