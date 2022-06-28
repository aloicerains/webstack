// error handles

exports.400 = async (res, msg) => {
  res.status(400).json({error: msg});
  return;
};
