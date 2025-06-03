"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamComparisonHeaderProps {
    time1: any;
    time2: any;
}

export const TeamComparisonHeader: React.FC<TeamComparisonHeaderProps> = ({ time1, time2 }) => {
    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href={`/${time1.nome}`} className="block">
                <div
                    className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
                    style={{ backgroundColor: time1.cor }}
                >
                    <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time1.nome}</h2>
                    <div className="w-32 h-32 relative">
                        <Image
                            src={`/assets/times/logos/${normalizeForFilePath(time1.nome)}.png`}
                            fill
                            sizes="128px"
                            alt={`Logo ${time1.nome}`}
                            className="object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/times/logos/default-logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-4 text-xl font-bold">{time1.sigla}</div>
                </div>
            </Link>

            <Link href={`/${time2.nome}`} className="block">
                <div
                    className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
                    style={{ backgroundColor: time2.cor }}
                >
                    <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time2.nome}</h2>
                    <div className="w-32 h-32 relative">
                        <Image
                            src={`/assets/times/logos/${normalizeForFilePath(time2.nome)}.png`}
                            fill
                            sizes="128px"
                            alt={`Logo ${time2.nome}`}
                            className="object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/times/logos/default-logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-4 text-xl font-bold">{time2.sigla}</div>
                </div>
            </Link>
        </div>
    );
};