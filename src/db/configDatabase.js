const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const db = async(result) => {

  let connection;

  try {
    connection = await oracledb.getConnection({
      user          : "TRAINING",
      password      : "training123",
      connectString : "192.168.1.188:1521/db"
    });
    console.log(result)
    const response = await connection.execute(
      result
    );

    const commit = await connection.execute("commit")
    
    return response
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports =  db;
