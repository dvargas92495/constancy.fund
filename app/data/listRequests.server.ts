import AWS from "aws-sdk";
import verifyAdminUser from "./verifyAdminUser.server";

const regions = [
  "eu-north-1",
  "ap-south-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "ca-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
];

const listRequests = (userId: string) =>
  verifyAdminUser(userId).then(() => {
    const cw = new AWS.CloudWatchLogs();
    return Promise.all(
      regions.map((r) =>
        cw
          .describeLogGroups({
            logGroupNamePrefix: `/aws/lambda/${r}.${process.env.ORIGIN?.replace(
              /\./g,
              "-"
            ).replace(/^https:\/\//, "")}`,
          })
          .promise()
          .then((lg) => (lg.logGroups || []).map((g) => ({ ...g, region: r })))
      )
    )
      .then((groups) => groups.flat())
      .then((groups) =>
        Promise.all(
          groups.map((g) =>
            cw
              .describeLogStreams({
                logGroupName: g.logGroupName || "",
                orderBy: "LastEventTime",
                descending: true,
              })
              .promise()
              .then((r) =>
                (r.logStreams || []).map((s) => ({
                  region: g.region,
                  arn: s.arn || "",
                  creationTime: s.creationTime || 0,
                  lastEventTimestamp: s.lastEventTimestamp || 0,
                  logStreamName: s.logStreamName || "",
                }))
              )
          )
        ).then((streams) =>
          streams
            .flat()
            .sort((a, b) => b.lastEventTimestamp - a.lastEventTimestamp)
        )
      )
      .then((streams) => ({ streams }));
  });

export default listRequests;
