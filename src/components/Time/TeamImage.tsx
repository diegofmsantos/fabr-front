// src/components/common/TeamImage.tsx
import React from 'react';
import Image from 'next/image';
import { ImageService } from '@/utils/services/ImageService';

interface TeamImageProps {
  teamName: string;
  type: 'logo' | 'helmet' | 'shirt';
  shirtCode?: string;
  customHelmet?: string;
  width: number;
  height: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
}

export const TeamImage: React.FC<TeamImageProps> = ({
  teamName,
  type,
  shirtCode,
  customHelmet,
  width,
  height,
  className = '',
  alt,
  priority = false,
  quality = 100,
  sizes,
  fill = false
}) => {
  const getSrc = (): string => {
    switch (type) {
      case 'logo':
        return ImageService.getTeamLogo(teamName);
      case 'helmet':
        return ImageService.getTeamHelmet(teamName, customHelmet);
      case 'shirt':
        return ImageService.getPlayerShirt(teamName, shirtCode || '');
      default:
        return '';
    }
  };

  const getAlt = (): string => {
    if (alt) return alt;
    
    switch (type) {
      case 'logo':
        return `Logo do time ${teamName}`;
      case 'helmet':
        return `Capacete do ${teamName}`;
      case 'shirt':
        return `Camisa do ${teamName}`;
      default:
        return `Imagem do ${teamName}`;
    }
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    switch (type) {
      case 'logo':
        ImageService.handleTeamLogoError(event, teamName);
        break;
      case 'helmet':
        ImageService.handleTeamHelmetError(event, teamName);
        break;
      case 'shirt':
        ImageService.handlePlayerShirtError(event, teamName, shirtCode || '');
        break;
    }
  };

  const imageProps = {
    src: getSrc(),
    alt: getAlt(),
    className,
    onError: handleError,
    priority,
    quality,
    ...(fill ? {} : { width, height }),
    ...(fill && { fill: true }),
    ...(sizes && { sizes })
  };

  return <Image {...imageProps} />;
};

export const TeamLogo: React.FC<Omit<TeamImageProps, 'type'>> = (props) => (
  <TeamImage {...props} type="logo" />
);

export const TeamHelmet: React.FC<Omit<TeamImageProps, 'type'>> = (props) => (
  <TeamImage {...props} type="helmet" />
);

export const PlayerShirt: React.FC<Omit<TeamImageProps, 'type'>> = (props) => (
  <TeamImage {...props} type="shirt" />
);

interface BannerImageProps {
  bannerCode: string;
  type: 'state' | 'nationality';
  width: number;
  height: number;
  className?: string;
  alt?: string;
}

export const BannerImage: React.FC<BannerImageProps> = ({ bannerCode, type, width, height, className = '', alt }) => {
  const src = type === 'state' 
    ? ImageService.getStateBanner(bannerCode)
    : ImageService.getNationalityFlag(bannerCode);

  const defaultAlt = type === 'state' 
    ? `Bandeira do estado`
    : `Bandeira de nacionalidade`;

  return (
    <Image
      src={src}
      alt={alt || defaultAlt}
      width={width}
      height={height}
      className={className}
      onError={(e) => ImageService.handleBannerError(e, bannerCode)}
      quality={100}
    />
  );
};