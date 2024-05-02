const DatabaseConnection = require("../db/connectDatabase");

const db = new DatabaseConnection();

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
    const SQL =
      "BEGIN insert_customers_dat(:type, :name, :birth, :identifier, :address, :email, :phone, :p_err_code, :p_err_param); END;";

    const binds = {
      type,
      name,
      birth,
      identifier,
      address,
      email,
      phone,
    };
    const response = await db.execute_proc(SQL, binds);
    console.log(response)
    return res.status(200).json({
      success: response.Errorcode,
      message: response.ErrorMessage
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

    const SQL = `
      BEGIN update_customers_dat(
        :id, :type, :name, :birth, :identifier, :address, :email, :phone, :p_err_code, :p_err_param
      );END;
    `;
    const binds = {
      id,
      type,
      name,
      birth,
      identifier,
      address,
      email,
      phone,
    };
    const response = await db.execute_proc(SQL, binds);
    return res.status(200).json({
      success: response.Errorcode,
      message: response.ErrorMessage
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const SQL = `BEGIN get_detail_user_dat(:p_err_code, :p_err_param, :p_REFCURSOR, :p_user_id );END;`;
    const binds = { p_user_id: id };
    const response = await db.execute_proc(SQL, binds);
    return res.status(200).json({
      success: response ? true : false,
      message: response.ErrorMessage,
      data: response.Data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const SQL =
      "BEGIN delete_customers_dat(:id, :p_err_code, :p_err_param);END;";
    const binds = {
      id,
    };
    const response = await db.execute_proc(SQL, binds);
    console.log(response);
    return res.status(200).json({
      success: response ? true : false,
      message: response.ErrorMessage,
      data: response ? response : null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (req, res) => {
  try {
    const SQL = `BEGIN get_all_user_dat(:p_err_code, :p_err_param, :p_REFCURSOR );END;`;
    const binds = {};
    const response = await db.execute_proc(SQL, binds);
    console.log(response);
    return res.status(200).json({
      success: response ? true : false,
      message: response.ErrorMessage,
      data: response.Data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const test = async (req, res) => {
  try {
    const response = await db.execute("SELECT * FROM customers_dat");
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response.rows : null,
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
  getDetailUser,
  test,
};
