const OracleDB = require('oracledb');

class DatabaseConnection {
  constructor() {
    this.OracleDB = OracleDB;
    this.dbConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST=${process.env.DB_HOST})(PORT = ${process.env.DB_POST}))(CONNECT_DATA =(SERVICE_NAME='${process.env.DB_SERVICE_NAME}')))`
    };
  }

  async init() {
    await this.connectWithDB();
  }

  async connectWithDB() {
    return new Promise((resolve, reject) => {
      this.OracleDB.getConnection(this.dbConfig, (err, connection) => {
        if (err) {
          reject(err.message);
        }
        console.log('Connected with Database...');
        resolve(connection);
      });
    });
  }

  async execute(SQL) {
    return new Promise((resolve, reject) => {
      this.connectWithDB().then(async (connection) => {
        await connection.execute(SQL, [], (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        });
        this.doRelease(connection);
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  }

  async execute_proc(SQL, binds) {
    return new Promise((resolve, reject) => {
      this.connectWithDB().then(async (connection) => {
        binds.p_err_code = { dir: OracleDB.BIND_OUT, type: OracleDB.STRING };
        binds.p_err_param = { dir: OracleDB.BIND_OUT, type: OracleDB.STRING };
        if (SQL.includes("p_REFCURSOR")) {
          binds.p_REFCURSOR = { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR };
        }

        console.log(SQL, binds);
        const result = await connection.execute(SQL, binds);

        if (result.outBinds.p_err_code == 0) {
          let data = [];
          if (SQL.includes("p_REFCURSOR")) {
            const rs = result.outBinds.p_REFCURSOR;
            const cols = rs.metaData;
            let row;
            while ((row = await rs.getRow())) {
              var rowdata = {};
              for (var i = 0; i < cols.length; i++) {
                rowdata[cols[i].name] = row[i];
              }
              data.push(rowdata);
            }
            await rs.close();
          }
          resolve({
            Errorcode: 0,
            ErrorMessage: "SUCCESS",
            Data: data,
            tb: result?.implicitResults ? result?.implicitResults[0] : null
          });
        } else {
          resolve({
            Errorcode: result.outBinds.p_err_code,
            ErrorMessage: result.outBinds.p_err_param
          });
        }
        this.doRelease(connection);
      }).catch(error => {
        console.log(error);
        resolve({
          Errorcode: '-1',
          ErrorMessage: "SYSTEM ERROR"
        });
      });
    });
  }

  doRelease(connection) {
    connection.release((err) => {
      if (err)
        console.error(err.message);
      console.log('connection released');
    });
  }
}

module.exports = DatabaseConnection;
