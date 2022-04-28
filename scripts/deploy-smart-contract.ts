#!/usr/bin/env node

import format from "date-fns/format";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import getMysqlConnection from "../app/data/mysql.server";
import dotenv from "dotenv";

dotenv.config();

const deploySmartContract = () => {
  const date = new Date();
  const version = format(date, "yyyy-MM-dd-mm-hh");
  const formData = new FormData();
  const artifacts = fs.readdirSync("artifacts/contracts", {
    withFileTypes: true,
  });
  return Promise.all(
    artifacts.map((a) => {
      const file = fs.readFileSync(
        `artifacts/contracts/${a.name}/${a.name.replace(/\.sol$/, ".json")}`
      );
      formData.append("files", file);
      return axios
        .post<{ Hash: string }>(
          "https://ipfs.infura.io:5001/api/v0/add",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${Buffer.from(
                `${process.env.IPFS_INFURA_ID}:${process.env.IPFS_INFURA_SECRET}`
              ).toString("base64")}`,
            },
          }
        )
        .then((r) =>
          axios
            .post(
              `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${r.data.Hash}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${Buffer.from(
                    `${process.env.IPFS_INFURA_ID}:${process.env.IPFS_INFURA_SECRET}`
                  ).toString("base64")}`,
                },
              }
            )
            .then(() => ({
              hash: r.data.Hash,
              version,
              name: a.name.replace(/\.sol$/, ""),
            }))
        );
    })
  )
    .then((records) =>
      getMysqlConnection()
        .then((con) =>
          con
            .execute(
              `INSERT INTO smart_contracts (hash, contract, version) VALUES ${records
                .map(() => `(?,?,?)`)
                .join(
                  ","
                )} ON DUPLICATE KEY UPDATE contract=contract, version=version`,
              records.flatMap((r) => [r.hash, r.name, r.version])
            )
            .then(() => con.destroy())
            .catch((e) => {
              con.destroy();
              return Promise.reject(e);
            })
        )
        .then(() =>
          records.forEach((r) =>
            console.log(
              `Uploaded contract ${r.name} version ${r.version} to ${r.hash}`
            )
          )
        )
    )
    .catch((e) => {
      console.error("Failed to deploy smart contract abis to IPFS");
      if (e.response?.data) {
        console.error(e.response.data);
      } else {
        console.error(e);
      }
    });
};

deploySmartContract();
