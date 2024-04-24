const db = require("../db/configDatabase");
const { isEmail, isPhone, isIdentifier } = require("../helpers/validate");
const DatabaseConnection = require("../db/connectDatabase");

const db1 = new DatabaseConnection();

const created = async (req, res) => {
  try {
    const { type, name, birth, identifier, address, email, phone } = req.body;
    if (
      !name ||
      !birth ||
      !identifier ||
      !address ||
      !type ||
      !email ||
      !phone
    ) {
      return res.status(401).json({
        success: false,
        data: "missing input",
      });
    }
    if (!isPhone(phone)) {
      return res.status(401).json({
        success: false,
        data: "phone invalid",
      });
    }
    if (!isEmail(email)) {
      return res.status(401).json({
        success: false,
        data: "email invalid",
      });
    }
    if (!isIdentifier(type, identifier)) {
      return res.status(401).json({
        success: false,
        data: "identifier invalid",
      });
    }
    const SQL = "BEGIN insert_customers_dat(:type, :name, :birth, :identifier, :address, :email, :phone, :p_err_code, :p_err_param); END;"
    const binds = {
      type,
      name,
      birth,
      identifier,
      address,
      email,
      phone,
    }
    console.log(binds)
    const response = await db1.execute_proc(SQL, binds)
    return res.status(200).json({
      success: true,
      data: response ? response : null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (req, res) => {
  try {
    const response = await db1.execute("SELECT * FROM customers_dat");
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response.rows : null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = "BEGIN delete_customers_dat(:id, :p_err_code, :p_err_param);END;"
    const binds = {
      id
    }
    const response = await db1.execute_proc(SQL, binds);
    console.log(response);
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, type, identifier, address, birth } = req.body;
    if (
      !name ||
      !birth ||
      !identifier ||
      !address ||
      !type ||
      !email ||
      !phone
    ) {
      return res.status(401).json({
        success: false,
        data: "missing input",
      });
    }
    if (!isEmail(email) && email) {
      return res.status(401).json({
        success: false,
        data: "email invalid",
      });
    }
    if (!isPhone(phone) && phone) {
      return res.status(401).json({
        success: false,
        data: "phone invalid",
      });
    }
    if (!isIdentifier(type, identifier) && identifier) {
      return res.status(401).json({
        success: false,
        data: "identifier invalid",
      });
    }
    const SQL = `
      BEGIN update_customers_dat(
        :id, :type, :name, :birth, :identifier, :address, :email, :phone, :p_err_code, :p_err_param
      );END;
    `
    const binds = {
      id,
      type,
      name,
      birth,
      identifier,
      address,
      email,
      phone,
    }
    const response = await db1.execute_proc(SQL, binds);
    console.log(response);
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  created,
  getUser,
  deleteUser,
  updateUser,
};
