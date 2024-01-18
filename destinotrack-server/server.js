const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI from the .env file
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(cors());

const database = client.db('unitrack');
const UsersCollection = database.collection('users');
const studentsCollection = database.collection('students');
const attendanceCollection = database.collection('attendance');
const emailsCollection = database.collection('emails');

async function connectToMongo() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB!");

    // Return the database object for further use
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

app.get('/', async (req, res) => {
  try {
    const db = await connectToMongo();
    res.send(`Hello, this is your Express server! Message from MongoDB`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password, username } = req.body;

  if (username) {
    // Signup logic
    try {
      const existingUser = await UsersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UsersCollection.insertOne({ email, username, password: hashedPassword });

      return res.status(200).json({ message: 'Signup successful!' });
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Login logic
    try {
      const user = await UsersCollection.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Email not found.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return res.status(200).json({ message: 'Login successful!' });
      } else {
        return res.status(401).json({ error: 'Incorrect password.' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.post('/submitForm', async (req, res) => {
  const { roll, sessionYear } = req.body;

  try {
    // Check if student with the same roll and session year already exists
    const existingStudent = await studentsCollection.findOne({ roll, sessionYear });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this roll and session year already exists.' });
    }

    // Insert new student data
    await studentsCollection.insertOne(req.body);

    return res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/checkAttendance', async (req, res) => {
  const { rolls, clubName, userEmail } = req.body;

  try {
    // Check attendance against the students database
    const mismatchedRolls = await Promise.all(
      rolls.map(async (roll) => {
        const student = await studentsCollection.findOne({
          roll,
          'clubsToJoin': clubName,
          userEmail
        });


        return student ? null : roll;
      })
    );

    // Filter out null values (rolls matched) and keep only mismatched rolls
    const mismatchedRollsFiltered = mismatchedRolls.filter((roll) => roll !== null);

    if (mismatchedRollsFiltered.length === 0) {
      res.send('Rolls matched');
    } else {
      res.json({ mismatchedRolls: mismatchedRollsFiltered });
    }
  } catch (error) {
    console.error('Error checking attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addToAttendance', async (req, res) => {
  try {
    const { rolls, clubName, userEmail } = req.body;

    // Ensure rolls is an array
    if (Array.isArray(rolls)) {
      // Check if any rolls do not exist in the studentsCollection
      const allStudents = await studentsCollection.find({ clubsToJoin: clubName, userEmail }).toArray();
      const allRolls = allStudents.map((student) => student.roll);

      const absentRolls = allRolls.filter((roll) => !rolls.includes(roll));
      const presentRolls = rolls;

      // Proceed with adding to attendanceCollection
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      await attendanceCollection.insertOne({ presentRolls, absentRolls, clubName, date: formattedDate, userEmail });

      return res.status(200).json({ message: 'Added to attendance successfully!' });
    } else {
      return res.status(400).json({ error: 'Invalid rolls format' });
    }
  } catch (error) {
    console.error('Error adding to attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/sendMail', async (req, res) => {
  const { recipient, subject, messageToSend, userEmail, fromEmail, smtpKey } = req.body;

  try {
    let recipients = [];

    if (recipient === 'All Students') {
      // Get all students' emails
      const allStudents = await studentsCollection.find({userEmail: userEmail}).toArray();
      recipients = allStudents.map((student) => student.email);
    } else {
      // Get emails based on the club
      const clubStudents = await studentsCollection.find({ 'clubsToJoin': recipient, userEmail: userEmail }).toArray();
      recipients = clubStudents.map((student) => student.email);
    }

    // Send email to each recipient
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: fromEmail, 
        pass: smtpKey,
      },
    });

    for (const recipientEmail of recipients) {
      if(recipientEmail === undefined) {
        continue;
      }
        const mailOptions = {
          from: fromEmail, // replace with your email
          to: recipientEmail,
          subject: subject,
          text: messageToSend,
        };
  
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
    }

    const dataToInsert = {
      userEmail: userEmail,
      recipient: recipient,
      subject: subject,
      message: messageToSend,
      from: fromEmail
    }

    await emailsCollection.insertOne(dataToInsert);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.log(error)
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Error sending email' });
  }
});


app.get('/getUserByEmail', async (req, res) => {
  const userEmail = req.query.email;

  try {
    const user = await UsersCollection.findOne({ email: userEmail });

    if (user) {
      // Send the user data as a response
      res.json(user);
    } else {
      // If the user is not found, send a 404 status
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    // Send a 500 status for internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updateUser', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await UsersCollection.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    const updateFields = {};

    if (username) {
      updateFields.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    await UsersCollection.findOneAndUpdate({ email }, { $set: updateFields });

    return res.status(200).json({ message: 'User profile updated successfully!' });
  } catch (error) {
    console.error('Error during user profile update:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/allStudents', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const students = await studentsCollection.find({ userEmail: userEmail }).toArray();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteStudent/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    await studentsCollection.findOneAndDelete({ _id: new ObjectId(studentId) });

    return res.status(200).json({ message: 'Student data deleted!' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/allAttendance', async (req, res) => {
  const userEmail = req.query.userEmail;
  try {
    const attendanceList = await attendanceCollection.find({userEmail: userEmail}).toArray();
    res.json(attendanceList);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteAttendance/:id', async (req, res) => {
  const attendanceId = req.params.id;

  try {
    const deletedAttendance = await attendanceCollection.findOneAndDelete({ _id: new ObjectId(attendanceId) });

    return res.status(200).json({ message: 'Attendance data deleted!' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/allMails', async (req, res) => {
  const { userEmail } = req.query;

  try {
    const mails = await emailsCollection.find({ userEmail: userEmail }).toArray();
    res.json(mails);
  } catch (error) {
    console.error('Error fetching mails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteMail/:id', async (req, res) => {
  const mailId = req.params.id;

  try {
    const deletedMail = await emailsCollection.findOneAndDelete({ _id: new ObjectId(mailId) });
    res.json(deletedMail);
  } catch (error) {
    console.error('Error deleting mail:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getStudentById', async (req, res) => {
  const studentId = req.query.id;

  try {
    const student = await studentsCollection.find({_id: new ObjectId(studentId)}).toArray();
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateStudent', async (req, res) => {
  const studentId = req.query.id;
  const updatedStudentData = req.body;

  try {
    // Exclude _id from the update operation
    delete updatedStudentData._id;

    await studentsCollection.findOneAndUpdate(
      { _id: new ObjectId(studentId) },
      { $set: updatedStudentData }
    );
    res.json({ message: 'Student details updated successfully' });
  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteUser', async (req, res) => {
  try {
    const userEmail = req.query.email;

    // Check if the email parameter is provided
    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required for account deletion.' });
    }

    // Find the user by email and remove it
    const deletedUser = await UsersCollection.findOneAndDelete({ email: userEmail });
    await studentsCollection.deleteMany({ userEmail });
    await attendanceCollection.deleteMany({ userEmail });
    await emailsCollection.deleteMany({ userEmail });
    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Respond with success message
    return res.json({ message: 'Account successfully deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Close the MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
