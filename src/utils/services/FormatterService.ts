import { StatConfig, StatResult } from "../constants/statMappings";

export class StatsFormatter {
    static format(value: number | string | null, config: StatConfig): string {
        if (value === null) return 'N/A'

        if (typeof value === 'string' && value.includes('/')) {
            return value; 
        }

        if (config.isCalculated && config.key.includes('media')) {
            return typeof value === 'number' ? value.toFixed(1).replace('.', ',') : 'N/A'
        }

        if (config.isCalculated && (
            config.key.includes('percentual') ||
            config.key === 'field_goals' ||
            config.key === 'extra_points'
        )) {
            return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
        }

        return typeof value === 'number' ? Math.round(value).toLocaleString('pt-BR') : 'N/A'
    }
}

export const formatValue = (value: string | number, title: string): string => {
    if (typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.,]/g, '')))) {
        const isPercentage =
            title.includes('(%)') ||
            ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);

        if (isPercentage) {
            const numValue = Number(value.replace(/[^0-9.,]/g, ''));
            return `${Math.round(numValue)}%`;
        }
    }

    if (!isNaN(Number(value))) {
        const numValue = Number(value);

        const isPercentage =
            title.includes('(%)') ||
            ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);

        if (isPercentage) {
            return `${Math.round(numValue)}%`;
        }

        return numValue.toLocaleString('pt-BR');
    }

    return String(value);
}

export const formatStatDisplay = (statResult: StatResult, stat: StatConfig): string => {
    if (statResult.value === null) return 'N/A'

    if (stat.isCalculated) {
        if (
            stat.key.includes('percentual') ||
            stat.key === 'extra_points' ||
            stat.key === 'field_goals'
        ) {
            return `${Math.round(statResult.value)}%`
        }
        return statResult.value.toFixed(1)
    }

    return Math.round(statResult.value).toString()
}