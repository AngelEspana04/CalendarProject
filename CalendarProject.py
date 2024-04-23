# Import the necessary data for connecting to the database
import pymysql
from datetime import datetime

# Function to create a .ics file from the database
def create_ics_file(host, user, password, database, output_file, student_date_input):

    # Connect to the database using provided credentials
    conn = pymysql.connect(host=host, user=user, password=password, database=database)
    cursor = conn.cursor()

    # Fetch data from the 'events' table in the database
    cursor.execute("SELECT event_name, start_time, end_time, location FROM events")
    events = cursor.fetchall()

    # Parse student's input date
    student_date = datetime.strptime(student_date_input, "%Y-%m-%d")
    # Convert to UTC Date-Time Format
    utc_date_time_format = student_date.strftime("%Y%m%dT000000Z")

    # Create the .ics file and write the header information
    with open(output_file, 'w') as f:

        # Start the calendar
        f.write("BEGIN: VCALENDAR\n")
        # Version of the iCalendar format
        f.write("VERSION 2.0\n")
        # Identifier for the software that created the calendar
        f.write("PRODID:-//Angel Espana del Rio//Calendar Program//EN\n") 
        # Calendar scale 
        f.write("CALSCALE: GREGORIAN\n")
        # Method used to publish the calendar
        f.write("METHOD:PUBLISH\n")
        # Name of the calendar 
        f.write("X-WR-CALNAME: Tennis Calendar\n")

        # Iterate through each event and add them to the .ics file
        for event in events:
            event_name, start_time, end_ime, location = event

            # Convert start_time and end_time to UTC format
            start_time_utc = convert_to_utc(start_time).strftime("%Y%m%dT%H%M%SZ")
            end_time_utc = convert_to_utc(end_time).strftime("%Y%m%dT%H%M%SZ")

            # Start of an event
            f.write("BEGIN:VEVENT\n")
            # Unique identifier for the event
            f.write(f"UID:{start_time_utc}-{event_name.replace(' ', '_')}@example.com\n")
            # Date and time the event was created (in UTC)
            f.write(f"DTSTAMP:{utc_date_time_format}\n")
            # Start date and time of the event (in UTC)
            f.write(f"DTSTART:{start_time_utc}\n")
            # End date and time of the event (in UTC)
            f.write(f"DTEND:{end_time_utc}\n")
            # Summary or title of the event
            f.write(f"SUMMARY:{event_name}\n")
            # Description of the event
            f.write(f"DESCRIPTION:{location}\n")
            # End of the event
            f.write("END:VEVENT\n")

        # End of the calendar
        f.write("END:VCALENDAR/n")
    
    # Print a message indicating the .ics file was created
    print("The .ICS file was succesfully created", output_file)

    # Close the database connection
    conn.close()




