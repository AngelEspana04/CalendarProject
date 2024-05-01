import pandas as pd  # Importing pandas library for working with Excel files
import pymysql  # Importing pymysql library for database connectivity

# Function to connect to the MySQL database
def connect_to_db(host, user, password, database):
    return pymysql.connect(host=Localhost, user=postgres, password=Imthebest29, database=calendar)

# Function to insert an event into the database
def insert_event(conn, event_name, start_time, end_time, location):
    cursor = conn.cursor()  # Create a cursor object to execute SQL queries
    sql = "INSERT INTO events (event_name, start_time, end_time, location) VALUES (%s, %s, %s, %s)"  # SQL query to insert data into 'events' table
    cursor.execute(sql, (event_name, start_time, end_time, location))  # Execute the SQL query with provided data
    conn.commit()  # Commit the transaction to save changes in the database
    cursor.close()  # Close the cursor

# Function to prompt the user to input event details
def prompt_user_for_event():
    event_name = input("Enter event name: ")  # Prompt user to input event name
    start_time = input("Enter start time (YYYY-MM-DD HH:MM): ")  # Prompt user to input start time
    end_time = input("Enter end time (YYYY-MM-DD HH:MM): ")  # Prompt user to input end time
    location = input("Enter location: ")  # Prompt user to input event location
    return event_name, start_time, end_time, location  # Return the inputted event details

# Main function
def main():
    host = "Localhost"  # Database host
    user = "postgres"  # Database username
    password = "Imthebest29"  # Database password
    database = "calendar"  # Database name

    conn = connect_to_db(host, user, password, database)  # Connect to the database

    event_name, start_time, end_time, location = prompt_user_for_event()  # Prompt user for event details
    insert_event(conn, event_name, start_time, end_time, location)  # Insert event into the database

    conn.close()  # Close database connection
    print("Event successfully added to the database.")  # Print success message

if __name__ == "__main__":
    main()  # Call the main function if the script is executed directly
