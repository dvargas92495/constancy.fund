import type { Handler as GetHandler } from "../functions/creator-profile/get";
import axios from "axios";

export type Props = Awaited<ReturnType<GetHandler>>;

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{ props: Props }> => {
  return axios
    .get<Props>(`${process.env.API_URL}/creator-profile?id=${id}`)
    .then((r) => ({
      props: r.data,
    }));
};

export default getStaticProps;
