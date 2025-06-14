import React from 'react';
import Link from 'next/link';
import { TimeMercadoCardProps } from '@/types/time';
import { TeamLogo } from '../Time/TeamImage';
import { UrlService } from '@/utils/services/FormatterService';

export const TimeMercadoCard: React.FC<TimeMercadoCardProps> = ({
  timeNome,
  jogadoresEntrando,
  jogadoresSaindo
}) => {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="relative w-16 h-16">
          <TeamLogo teamName={timeNome} width={60} height={60} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold italic tracking-tight">{timeNome}</h3>
          <div className="flex gap-4 mt-1 text-sm">
            <div className="flex items-center">
              <span className="text-green-500 font-bold">{jogadoresEntrando.length}</span>
              <span className="ml-1">chegando</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 font-bold">{jogadoresSaindo.length}</span>
              <span className="ml-1">saindo</span>
            </div>
            <div className="flex items-center">
              <span className={`font-bold ${jogadoresEntrando.length - jogadoresSaindo.length > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {jogadoresEntrando.length - jogadoresSaindo.length > 0 ? '+' : ''}
                {jogadoresEntrando.length - jogadoresSaindo.length}
              </span>
              <span className="ml-1">saldo</span>
            </div>
          </div>
        </div>
      </div>

      {jogadoresEntrando.length > 0 && (
        <div className="p-4 border-b">
          <h4 className="text-sm font-bold mb-2 text-green-600">CHEGANDO</h4>
          <ul className="space-y-2">
            {jogadoresEntrando.slice(0, 5).map((jogador) => (
              <li key={`in-${jogador.id}`} className="flex justify-between">
                <span className="font-medium">{jogador.jogadorNome}</span>
                {jogador.timeOrigemNome && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span>do {jogador.timeOrigemNome}</span>
                  </div>
                )}
              </li>
            ))}
            {jogadoresEntrando.length > 5 && (
              <li className="text-sm text-green-600 font-bold text-center">
                +{jogadoresEntrando.length - 5} mais jogadores
              </li>
            )}
          </ul>
        </div>
      )}

      {jogadoresSaindo.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-bold mb-2 text-red-600">SAINDO</h4>
          <ul className="space-y-2">
            {jogadoresSaindo.slice(0, 5).map((jogador) => (
              <li key={`out-${jogador.id}`} className="flex justify-between">
                <span className="font-medium">{jogador.jogadorNome}</span>
                {jogador.timeDestinoNome && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span>para {jogador.timeDestinoNome}</span>
                  </div>
                )}
              </li>
            ))}
            {jogadoresSaindo.length > 5 && (
              <li className="text-sm text-red-600 font-bold text-center">
                +{jogadoresSaindo.length - 5} mais jogadores
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="p-3 bg-gray-50 border-t">
        <Link
          href={UrlService.getTeamUrl(timeNome)}
          className="text-center block w-full text-sm font-bold text-gray-700 hover:text-[#63E300] transition-colors"
        >
          Ver detalhes do time
        </Link>
      </div>
    </div>
  );
};

export default TimeMercadoCard;