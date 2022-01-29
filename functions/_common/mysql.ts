import mysql from "mysql2";

const DATABASE_URL_REGEX =
  /^mysql:\/\/([a-z0-9]+):(.{16})@([a-z0-9\.-]+):(\d{3,5})\/([a-z_]+)$/;
const matches = DATABASE_URL_REGEX.exec(process.env.DATABASE_URL || "");

if (!matches) throw new Error(`Error parsing Database URL`);

const connection = mysql.createConnection({
  host: matches[3],
  user: matches[1],
  port: Number(matches[4]),
  database: matches[5],
  password: matches[2],
});

export const execute = (s: string, args: (string | number)[]) =>
  new Promise((resolve, reject) =>
    connection.execute(s, args, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    })
  );

export default connection;
