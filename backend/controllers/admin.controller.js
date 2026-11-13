export const getAdminWorkspace = (role) => (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
      workspace: role,
    },
  });
};
