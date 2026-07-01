const Meeting = require('../models/Meeting');

const createMeeting = async (req, res) => {
  try {
    const { title, description } = req.body;
    const meeting = new Meeting({
      title,
      description,
      host: req.user._id,
      participants: [req.user._id]
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user._id }, { participants: req.user._id }]
    }).populate('host', 'name email');
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'name email')
      .populate('participants', 'name email');
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateMeetingSummary = async (req, res) => {
  try {
    const { transcript } = req.body;
    const { analyzeTranscript } = require('../utils/aiHelper');
    const result = analyzeTranscript(transcript || '');
    res.json({ summary: result.summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  generateMeetingSummary
};