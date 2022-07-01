import { useOutletContext } from "remix";
import CreatorSigned from "~/emails/CreatorSigned"

const PreviewCreatorSigned = () => {
  const data = useOutletContext<Parameters<typeof CreatorSigned>[0]>();
  return <CreatorSigned {...data} />;
};

export default PreviewCreatorSigned;
