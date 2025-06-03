"use client"

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Time } from '@/types/time';

interface TeamSelectorProps {
    times: Time[];
    selectedTeams: { time1Id?: number; time2Id?: number };
    onSelectTeam: (position: 'time1Id' | 'time2Id', teamId: number) => void;
    onSwapTeams: () => void;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
    times,
    selectedTeams,
    onSelectTeam,
    onSwapTeams
}) => {
    const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-lg p-4">
                    <label className="block mb-2 font-bold">Time 1</label>
                    <select
                        value={selectedTeams.time1Id || ''}
                        onChange={(e) => onSelectTeam('time1Id', Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione um time</option>
                        {times.map((time) => (
                            <option
                                key={time.id}
                                value={time.id}
                                disabled={time.id === selectedTeams.time2Id}
                            >
                                {time.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-lg p-4">
                    <label className="block mb-2 font-bold">Time 2</label>
                    <select
                        value={selectedTeams.time2Id || ''}
                        onChange={(e) => onSelectTeam('time2Id', Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione um time</option>
                        {times.map((time) => (
                            <option
                                key={time.id}
                                value={time.id}
                                disabled={time.id === selectedTeams.time1Id}
                            >
                                {time.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {teamsSelected && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onSwapTeams}
                        className="bg-[#373740] hover:opacity-80 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Inverter Times
                    </button>
                </div>
            )}
        </div>
    );
};