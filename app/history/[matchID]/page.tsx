import { FullMatchDetails } from '@/app/ui/matchHistory/fullMatchDetails';

type Props = {
  params: Promise<{ matchID: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const matchID = params.matchID;

  return (
    <div>
      <FullMatchDetails matchID={matchID} />
    </div>
  );
}
