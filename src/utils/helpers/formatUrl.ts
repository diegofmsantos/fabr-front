import { Jogador } from "@/types/jogador"
import { StatKey } from "@/types/Stats"
import { Time } from "@/types/time"

export const createSlug = (text: string): string => {
    if (!text) return ''

    const charMap = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ý': 'y', 'ÿ': 'y',
        'ñ': 'n',
        'ç': 'c',
        'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
        'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
        'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
        'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
        'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
        'Ý': 'Y',
        'Ñ': 'N',
        'Ç': 'C',
    }

    const normalized = text
        .split('')
        .map(char => charMap[char as keyof typeof charMap] || char)
        .join('')
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return normalized
        .split('-')
        .map(word => {
            if (word.length === 2 && word.toUpperCase() === word) {
                return word.toUpperCase()
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join('-')
}

export const getTeamSlug = (teamName: string | undefined): string => {
    if (!teamName) return ''
    return createSlug(teamName)
}

export const getPlayerSlug = (playerName: string | undefined): string => {
    if (!playerName) return ''
    return createSlug(playerName)
}

export const getOriginalName = (teams: Time[], slug: string): string | null => {
    if (!slug) return null
    const normalizedSlug = createSlug(slug)
    const team = teams.find(team => getTeamSlug(team.nome) === normalizedSlug)
    return team?.nome || null
}

export const findPlayerBySlug = (
    jogadores: Jogador[],
    playerSlug: string,
    timeSlug: string,
    times: Time[]
): Jogador | null => {
    if (!playerSlug || !timeSlug) return null;

    const normalizedPlayerSlug = createSlug(playerSlug);
    const normalizedTeamSlug = createSlug(timeSlug);

    const jogadorNoTimeAtual = jogadores.find(jogador => {
        const playerMatches = getPlayerSlug(jogador.nome) === normalizedPlayerSlug;

        const playerTeam = times.find(t => t.id === jogador.timeId);
        const teamMatches = playerTeam && getTeamSlug(playerTeam.nome) === normalizedTeamSlug;

        return playerMatches && teamMatches;
    });

    if (jogadorNoTimeAtual) {
        return jogadorNoTimeAtual;
    }

    return jogadores.find(jogador =>
        getPlayerSlug(jogador.nome) === normalizedPlayerSlug
    ) || null;
}

export const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
    if (value === null) return 'N/A'

    if (['fg_11_20', 'fg_21_30', 'fg_31_40', 'fg_41_50'].includes(statKey as string)) return String(value)

    if (typeof value === 'string') return value

    const percentageStats = ['passes_percentual', 'extra_points', 'field_goals']
    const averageStats = ['jardas_media', 'jardas_corridas_media', 'jardas_recebidas_media', 'jardas_retornadas_media', 'jardas_punt_media']

    if (percentageStats.includes(statKey as string)) {
        return `${Math.round(value)}%`;
    } else if (averageStats.includes(statKey as string)) {
        return value.toFixed(1);
    }
    return Math.round(value).toString();
}

export const formatStatValue = (value: number | null, statKey: string, title: string): string => {
    if (value === null) return 'N/A';

    if (
        statKey.includes('percentual') ||
        statKey === 'field_goals' ||
        statKey === 'extra_points' ||
        title.includes('(%)') ||
        title === 'FG(%)' ||
        title === 'XP(%)'
    ) {
        return `${Math.round(value)}%`;
    }

    if (
        statKey.includes('media') ||
        title.includes('(AVG)')
    ) {
        return value.toFixed(1).replace('.', ',');
    }

    return Math.round(value).toLocaleString('pt-BR');
};