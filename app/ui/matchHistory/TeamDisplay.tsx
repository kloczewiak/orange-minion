import { ParticipantDto } from '@/app/lib/api/riot/Match5VTypes';
import { Region } from '@/app/lib/api/riot/riotTypes';
import { getTeamStyles } from '@/app/lib/helperFunctions';
import {
  SummonerProfileCardWithChampion,
  SummonerProfileCardWithChampionSkeleton,
} from '../summonerProfileCardWithChampion';
import { Suspense } from 'react';

export type TeamWithParticipants = {
  teamId: number;
  win: boolean;
  subteamPlacement?: number;
  bans?: number[];
  participants: ParticipantDto[];
};

export type PlayerWithChampion = {
  puuid: string;
  championId: number;
};

export function TeamDisplay({
  teams,
  region,
}: {
  teams: TeamWithParticipants[];
  region: Region;
}) {
  const isArena = Boolean(teams[0].subteamPlacement);

  const normalStyles = 'flex flex-col';
  const arenaStyles = 'grid grid-cols-2';

  return (
    <div className={`${isArena ? arenaStyles : normalStyles} gap-4`}>
      {teams.map((t) => (
        <SingleTeamDisplay key={t.teamId} team={t} region={region} />
      ))}
    </div>
  );
}

export function SingleTeamDisplay({
  team,
  region,
}: {
  team: TeamWithParticipants;
  region: Region;
}) {
  const { winText, teamColor } = getTeamStyles(team.win, team.subteamPlacement);

  return (
    <div className='flex flex-col items-center gap-1'>
      <p className={`text-3xl font-semibold ${teamColor.text}`}>{winText}</p>
      <div className={`p-2 rounded-[20px] ${teamColor.bgBright}`}>
        <PlayerDisplay players={team.participants} region={region} />
      </div>
    </div>
  );
}

export function PlayerDisplay({
  players,
  region,
}: {
  players: PlayerWithChampion[];
  region: Region;
}) {
  return (
    <div className='flex gap-2'>
      {players.map((p) => (
        <Suspense
          key={p.puuid}
          fallback={<SummonerProfileCardWithChampionSkeleton />}
        >
          <SummonerProfileCardWithChampion
            puuid={p.puuid}
            championId={p.championId}
            region={region}
          />
        </Suspense>
      ))}
    </div>
  );
}
