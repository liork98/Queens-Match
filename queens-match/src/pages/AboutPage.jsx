import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <div className="about-container">
        <h2>Overview</h2>
        <p>
          Queens Match is an application developed to serve the community by
          connecting mentors with mentees. The need for such a solution arose
          from genuine community requirements that were not met by existing
          platforms.
        </p>
        <p>
          The aim is to establish a robust infrastructure and develop key
          features that are tailored to meet these needs. As the project
          evolves, contributions will be welcomed similar to any open-source
          project, necessitating that we develop it in a maintainable and easily
          expandable manner.
        </p>
        <h2>Skills and Competencies</h2>
        <p>
          This project operates in a team development format, providing team
          members with not only technical skills but also teamwork and project
          synchronization experience within a complex project.
        </p>
        <h2>User Features</h2>
        <ol>
          <li>
            The application will display a list of mentors along with relevant
            details for the mentoring services they offer on a dedicated page,
            including:
            <ul>
              <li>
                Programming languages / Technologies / Fields of expertise
              </li>
              <li>Name</li>
              <li>Email (link to send an email - optional)</li>
              <li>Phone number (link to send a WhatsApp message - optional)</li>
            </ul>
          </li>
          <li>
            The page will include a search field (free text) that allows
            searching by programming languages or names.
            <ul>
              <li>
                A filter for predefined languages/technologies can also be
                added.
              </li>
            </ul>
          </li>
          <li>
            An additional page where users can express their interest in
            becoming mentors by filling in their details:
            <ul>
              <li>First and last name</li>
              <li>Email</li>
              <li>Phone number</li>
              <li>Programming languages</li>
              <li>LinkedIn profile link</li>
            </ul>
          </li>
          <li>
            A login page that requires a username and password (or just a
            username, depending on implementation).
          </li>
        </ol>
        <h2>Future Features</h2>
        <ol>
          <li>
            Search & Filters: Allows users to search for mentors by name,
            technology stack, and filter by programming languages or other
            criteria.
          </li>
          <li>
            Scheduling System: Integration with a scheduling system to set up
            mentorship sessions.
          </li>
          <li>
            Feedback System: A feedback mechanism where mentees can rate their
            sessions and mentors.
          </li>
          <li>
            Automated Thank You Messages: Automatic thank you messages sent to
            mentors after a session.
          </li>
          <li>
            Admin Interface: Provides community administrators with a dashboard
            to manage users and view mentor-mentee activities.)
          </li>
          <li>
            Admin Dashboard: Includes detailed reports on mentorship sessions
            and user activities.
          </li>
          <li>
            There will be two types of client sides: one for regular users and
            one for administrators (community managers).
          </li>
        </ol>
        <h2>Special Future Feature</h2>
        <ol>
          <li>Integration with a scheduling system.</li>
          <li>
            A feedback system regarding meetings, with reminders sent to users
            who haven’t submitted feedback within two days.
          </li>
          <li>
            The application will send an automatic thank-you message to mentors
            who have invested their time.
          </li>
          <li>
            Administrator requirements:
            <ul>
              <li>
                The application will generate a report displaying the status of
                all scheduled meetings, including a calendar view where meetings
                are color-coded based on their status.
              </li>
            </ul>
          </li>
        </ol>
        <h2>Data Management</h2>
        <p>
          A database table for users will be maintained, containing the
          necessary information for login purposes, alongside another table
          specifically for mentor details.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
