// controllers/messageController.js

const Message = require('../models/Message');
const Class = require('../models/Class');

exports.sendBroadcastMessage = async (req, res) => {
  try {
    const tutorId = req.user.userId;
    const role = req.user.role;

    if (role !== 'tutor') {
      return res.status(403).json({ message: 'Access denied. Only tutors can send broadcast messages.' });
    }

    const { classId, content } = req.body;

    if (!classId || !content) {
      return res.status(400).json({ message: 'Class ID and message content are required.' });
    }

    // Verify the class exists and belongs to the tutor
    const classInfo = await Class.findOne({ _id: classId, tutor: tutorId }).populate('studentsEnrolled');

    if (!classInfo) {
      return res.status(404).json({ message: 'Class not found or you do not have permission to send messages to this class.' });
    }

    const recipientIds = classInfo.studentsEnrolled.map(student => student._id);

    if (recipientIds.length === 0) {
      return res.status(400).json({ message: 'No students enrolled in this class to send a message to.' });
    }

    // Create a new message
    const message = new Message({
      sender: tutorId,
      recipients: recipientIds,
      classId: classId,
      content: content,
    });

    await message.save();

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending broadcast message:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.getStudentMessages = async (req, res) => {
    try {
      const studentId = req.user.userId;
      const role = req.user.role;
  
      if (role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Only students can access their inbox.' });
      }
  
      const messages = await Message.find({ recipients: studentId })
        .populate('sender', 'firstName lastName email')
        .populate('classId', 'subject title')
        .sort({ sentAt: -1 });
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching student messages:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  