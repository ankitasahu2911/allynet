import Connection from "../models/Connection.js";

export const sendRequest = async (req, res) => {
  const { id: alumniId } = req.params;
  const studentId = req.user._id;

  const alreadyRequested = await Connection.findOne({ studentId, alumniId });
  if (alreadyRequested) return res.status(400).json({ msg: "Already requested" });

  const request = await Connection.create({ studentId, alumniId });
  res.status(201).json(request);
};

export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await Connection.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) return res.status(404).json({ msg: "Request not found" });

  res.json(updated);
};

export const getMyConnections = async (req, res) => {
  const userId = req.user._id;

  const connections = await Connection.find({
    $or: [{ studentId: userId }, { alumniId: userId }],
    status: 'accepted',
  }).populate('studentId alumniId', 'name email profilePhoto');

  res.json(connections);
};
