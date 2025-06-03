import { Jogador } from "@/types/jogador"
import { TeamInfo } from "@/hooks/useTeamInfo"
import { ProcessedPlayer } from "@/types/processedPlayer"
import { BaseStatCalculator, calculateStat, compareValues, shouldIncludePlayer, StatsCalculator } from "./StatsServices"
import { CategoryKey } from "../categoryThresholds"
import { Time } from "@/types/time"
import { StatConfig } from "@/types/teamComparison"
import { normalizeForFilePath, StatsFormatter } from "./FormatterService"
import { StatResult } from "../constants/statMappings"
import { StatKey } from "@/types/Stats"

export function createProcessedPlayer(player: Jogador, statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo): ProcessedPlayer | null {
    const stats = player.estatisticas[statMapping.category]
    if (!stats) return null

    const statValue = StatsCalculator.calculate(stats, statMapping.key)
    if (statValue === null || statValue === 0 || (typeof statValue === 'number' && statValue < 0)) return null

    const baseStat = BaseStatCalculator.calculate(stats, statMapping.category as CategoryKey)
    const formattedValue = StatsFormatter.format(statValue, statMapping);

    const average = typeof statValue === 'string' && statValue.includes('/')
        ? Number(statValue.split('/')[0]) // Usa apenas o número de acertos para média
        : Number(statValue);

    return { player, average, baseStat, teamInfo: getTeamInfo(player.timeId), value: formattedValue }
}

export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer { return player !== null }

export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
    if (typeof a.value === 'string' && typeof b.value === 'string' &&
        a.value.includes('/') && b.value.includes('/')) {
        const [acertosA, tentativasA] = a.value.split('/').map(Number)
        const [acertosB, tentativasB] = b.value.split('/').map(Number)

        const proporcaoA = acertosA / tentativasA;
        const proporcaoB = acertosB / tentativasB;

        if (proporcaoA === proporcaoB) return acertosB - acertosA

        return proporcaoB - proporcaoA
    }
    return b.average - a.average
}

export interface ProcessedStatCard {
    title: string;
    category: string;
    players: Array<{
        id: number;
        name: string;
        team: string;
        value: string;
        camisa: string;
        teamColor?: string;
        teamLogo?: string;
        isFirst?: boolean;
    }>;
}

export const processPlayerStats = (
    players: Jogador[],
    times: Time[],
    stats: Array<{ key: StatKey; title: string }>,
    categoryTitle: string
): ProcessedStatCard[] => {
    // Normaliza o caminho do arquivo
    

    // Obtém informações do time
    const getTeamInfo = (timeId: number) => {
        const team = times.find((t) => t.id === timeId);
        return {
            nome: team?.nome || "Time Desconhecido",
            cor: team?.cor || "#CCCCCC",
        };
    };

    return stats.map((stat) => {
        const filteredPlayers = players
            .filter((player) => shouldIncludePlayer(player, stat.key, categoryTitle))
            .sort((a, b) => {
                const aValue = calculateStat(a, stat.key);
                const bValue = calculateStat(b, stat.key);
                return compareValues(aValue, bValue);
            })
            .slice(0, 5);

        return {
            title: stat.title,
            category: categoryTitle,
            players: filteredPlayers.map((player, playerIndex) => {
                const teamInfo = getTeamInfo(player.timeId);
                const value = calculateStat(player, stat.key);

                // Normaliza o valor para exibição
                const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
                    if (value === null) return "N/A";

                    if (typeof value === "string") return value;

                    const percentageStats = ["passes_percentual", "extra_points", "field_goals"];
                    const averageStats = [
                        "jardas_media",
                        "jardas_corridas_media",
                        "jardas_recebidas_media",
                        "jardas_retornadas_media",
                        "jardas_punt_media",
                    ];

                    if (percentageStats.includes(statKey)) {
                        return `${Math.round(value)}%`;
                    } else if (averageStats.includes(statKey)) {
                        return value.toFixed(1);
                    }

                    return Math.round(value).toString();
                };

                return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome,
                    value: normalizeValue(value, stat.key),
                    camisa: player.camisa,
                    teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`,
                    isFirst: playerIndex === 0,
                };
            }),
        };
    });
};

export const compareStatValues = (a: StatResult, b: StatResult): number => {
    if (a.value === null && b.value === null) return 0
    if (a.value === null) return 1
    if (b.value === null) return -1
    return b.value - a.value
}