const Squad = require('../models/Squad');

const createSquad = async (leaderId, { name, description, skills }) => {
  return Squad.create({
    name,
    description,
    skills,
    leader: leaderId,
    members: [{ user: leaderId, role: 'leader' }],
  });
};

const getSquads = async () => {
  return Squad.find({ status: 'active' })
    .populate('leader', 'fullName email')
    .populate('members.user', 'fullName email');
};

const getSquadById = async (id) => {
  const squad = await Squad.findById(id)
    .populate('leader', 'fullName email')
    .populate('members.user', 'fullName email');
  if (!squad) {
    const error = new Error('الفريق مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return squad;
};

const joinSquad = async (squadId, userId, role = 'member') => {
  const squad = await Squad.findById(squadId);
  if (!squad) {
    const error = new Error('الفريق مش موجود');
    error.statusCode = 404;
    throw error;
  }

  const alreadyMember = squad.members.some((m) => m.user.toString() === userId);
  if (alreadyMember) {
    const error = new Error('انت عضو في الفريق ده أصلاً');
    error.statusCode = 400;
    throw error;
  }

  squad.members.push({ user: userId, role });
  await squad.save();
  return squad;
};

const leaveSquad = async (squadId, userId) => {
  const squad = await Squad.findById(squadId);
  if (!squad) {
    const error = new Error('الفريق مش موجود');
    error.statusCode = 404;
    throw error;
  }

  squad.members = squad.members.filter((m) => m.user.toString() !== userId);
  await squad.save();
  return squad;
};

const disbandSquad = async (squadId) => {
  const squad = await Squad.findByIdAndUpdate(squadId, { status: 'disbanded' }, { new: true });
  if (!squad) {
    const error = new Error('الفريق مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return squad;
};

module.exports = { createSquad, getSquads, getSquadById, joinSquad, leaveSquad, disbandSquad };
