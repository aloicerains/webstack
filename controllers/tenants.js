const Tenant = require('../models/tenants');
const error = require('./errors');

export.postNew = async (req, res) => {
  const { name, house, room, phone } = req.body;
  if (!name)
    await error.400(res, "Missing name");
  const validTenant = await Tenant.findOne({name}).exec();
  if (validTenant)

