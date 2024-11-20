import { getMatchDetails } from '@/app/lib/api/data';
import { MatchDto, ParticipantDto } from '@/app/lib/api/riot/Match5VTypes';
import { Region } from '@/app/lib/api/riot/riotTypes';
import {
  getChampionTileUrl,
  getCluster,
  getQueuesLookupTable,
  getTeamStyles,
} from '@/app/lib/helperFunctions';
import Image from 'next/image';
import { FullDate } from '../helperClient';
import { Items, SummonerSpells } from './Items';
import { DetailedPerksSelector, Perks } from './Perks';
import { Challenges } from './Statistics';
import { TeamDisplay, TeamWithParticipants } from './TeamDisplay';

export async function FullMatchDetails({ matchID }: { matchID: string }) {
  const region = matchID.split('_')[0] as Region;

  const match = await getMatchDetails(matchID, getCluster(region));

  const hasSubteamID = !match.info.participants.every(
    (e) => e.playerSubteamId === 0,
  );

  const teams: TeamWithParticipants[] = hasSubteamID
    ? getArenaTeams(match.info.participants)
    : match.info.teams.map((t) => ({
        teamId: t.teamId,
        win: t.win,
        participants: match.info.participants.filter(
          (p) => p.teamId === t.teamId,
        ),
      }));

  return (
    <div className='flex flex-col gap-4 items-center'>
      <TeamDisplay teams={teams} region={region} />
      <Match match={match} />
    </div>
  );
}

function getArenaTeams(participants: ParticipantDto[]): TeamWithParticipants[] {
  const subteamIDs = [...new Set(participants.map((p) => p.playerSubteamId))];
  const arenaTeams: TeamWithParticipants[] = subteamIDs.map((id) => ({
    teamId: id,
    win: participants.filter((p) => p.playerSubteamId === id)[0].win,
    subteamPlacement: participants.filter((p) => p.playerSubteamId === id)[0]
      .subteamPlacement,
    participants: participants.filter((p) => p.playerSubteamId === id),
  }));

  return arenaTeams;
}

async function Match({ match }: { match: MatchDto }) {
  const queueLookup = await getQueuesLookupTable();
  const queue = queueLookup.find((q) => q.id === match.info.queueId);

  const isArena = Boolean(match.info.participants[0].playerSubteamId);
  const teamsUnsorted: TeamWithParticipants[] = isArena
    ? getArenaTeams(match.info.participants)
    : match.info.teams.map((t) => ({
        teamId: t.teamId,
        win: t.win,
        bans: t.bans.map((b) => b.championId),
        participants: match.info.participants.filter(
          (p) => p.teamId === t.teamId,
        ),
      }));

  const teams = isArena
    ? teamsUnsorted.sort(
        (a, b) => (a.subteamPlacement ?? 0) - (b.subteamPlacement ?? 0),
      )
    : teamsUnsorted;

  return (
    <div className='flex flex-col items-center gap-4 w-full'>
      <div>
        <p className='text-2xl font-semibold text-primary'>
          {(queue && (queue.detailedDescription || queue.name)) ||
            `Unknown Queue - ${match.info.queueId}`}
        </p>
        <FullDate timestamp={match.info.gameCreation} />
      </div>

      <TeamList teams={teams} />
      <Challenges participants={match.info.participants} />
      <DetailedPerksSelector participants={match.info.participants} />
    </div>
  );
}

function TeamList({ teams }: { teams: TeamWithParticipants[] }) {
  return (
    <div className={`grid grid-cols-2 gap-4`}>
      {teams.map((t) => (
        <TeamPlayerList key={t.teamId} team={t} />
      ))}
    </div>
  );
}

function TeamPlayerList({ team }: { team: TeamWithParticipants }) {
  const { winText, teamColor } = getTeamStyles(team.win, team.subteamPlacement);

  return (
    <div className='bg-primary/5 p-2 rounded-3xl flex flex-col gap-2'>
      <p className={`${teamColor.text} font-semibold text-xl ml-2`}>
        {winText}
      </p>
      <div className={`flex flex-col gap-2 ${teamColor.bg} p-2 rounded-2xl`}>
        {team.participants.map((p) => (
          <Player key={p.puuid} participant={p} />
        ))}
      </div>
      {team.bans && <Bans bans={team.bans} />}
    </div>
  );
}

async function Bans({ bans }: { bans: number[] }) {
  const iconPaths = await Promise.all(
    bans.map((ban) => getChampionTileUrl(ban)),
  );
  // 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png',
  return (
    <div className='flex gap-2 justify-center items-center'>
      <p className='text-red-500'>Bans</p>
      {iconPaths.map((iconPath) => (
        <Image
          key={iconPath}
          className='rounded-2xl border-2 border-red-500 w-12 h-12 object-none'
          src={iconPath}
          alt='ban'
          width={64}
          height={64}
        />
      ))}
    </div>
  );
}

async function Player({ participant }: { participant: ParticipantDto }) {
  const championImage = await getChampionTileUrl(participant.championId);

  return (
    <div className='flex justify-between gap-2'>
      <div className='flex gap-2'>
        <div className='relative'>
          <Image
            className='rounded-lg w-16 h-full object-cover'
            src={championImage}
            alt={participant.championName}
            width={64}
            height={100}
          />

          <div className='flex items-end justify-center inset-1 absolute'>
            <div className='flex items-center justify-center w-7 h-7 bg-background/90 rounded-full'>
              <p className='text-accent font-semibold'>
                {participant.champLevel}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-around items-start'>
          <div>
            {participant.riotIdGameName ? (
              <>
                <p className='leading-5 text-nowrap'>
                  {participant.riotIdGameName}
                </p>
                <p className='leading-5 text-primary/70'>
                  #{participant.riotIdTagline}
                </p>
              </>
            ) : (
              <p>{participant.summonerName}</p>
            )}
          </div>
          <div>
            <p className='leading-5'>{participant.championName}</p>
            <p className='leading-5'>
              <span className='text-green-500'>{participant.kills}</span> /{' '}
              <span className='text-red-500'>{participant.deaths}</span> /{' '}
              <span className='text-yellow-500'>{participant.assists}</span>
            </p>
          </div>
        </div>
      </div>
      <div className='flex gap-1 shrink-0'>
        <Perks perks={participant.perks} />
        <Items
          items={[
            participant.item0,
            participant.item1,
            participant.item2,
            participant.item3,
            participant.item4,
            participant.item5,
          ].filter((i) => i !== 0)}
        />
        <SummonerSpells
          wardID={participant.item6}
          summonerSpells={[participant.summoner1Id, participant.summoner2Id]}
        />
      </div>
    </div>
  );
}
