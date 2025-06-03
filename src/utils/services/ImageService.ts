
export class ImageService {

  static normalizeForFilePath(input: string): string {
    if (!input) return '';

    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')  
      .normalize('NFD')      
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9-]/g, '');   
  }

  static getTeamLogo(teamName: string): string {
    const normalized = this.normalizeForFilePath(teamName);
    return `/assets/times/logos/${normalized}.png`;
  }

   static getTeamHelmet(teamName: string, customHelmet?: string): string {
    if (customHelmet) {
      return `/assets/times/capacetes/${customHelmet}`;
    }
    const normalized = this.normalizeForFilePath(teamName);
    return `/assets/times/capacetes/capacete-${normalized}.png`;
  }

   static getPlayerShirt(teamName: string, shirtCode: string): string {
    if (!teamName || !shirtCode) {
      return '/assets/times/camisas/camisa-default.png';
    }
    
    const normalizedTeam = this.normalizeForFilePath(teamName);
    return `/assets/times/camisas/${normalizedTeam}/${shirtCode}`;
  }

  static getStateBanner(bannerCode: string): string {
    if (!bannerCode) return '';
    return `/assets/bandeiras/${bannerCode}`;
  }

   static getNationalityFlag(flagCode: string): string {
    if (!flagCode) return '';
    return `/assets/bandeiras/${flagCode}`;
  }

   static handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackSrc: string,
    debugInfo?: string
  ): void {
    const target = event.currentTarget;
    
    if (target.src === fallbackSrc) return;
    
    if (debugInfo && process.env.NODE_ENV === 'development') {
      console.warn(`Failed to load image: ${debugInfo}`);
    }
    
    target.src = fallbackSrc;
  }

    static handleTeamLogoError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string
  ) => {
    this.handleImageError(
      event,
      '/assets/times/logos/default-logo.png',
      `Team logo for: ${teamName}`
    );
  };

  static handleTeamHelmetError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string
  ) => {
    this.handleImageError(
      event,
      '/assets/times/capacetes/capacete-default.png',
      `Team helmet for: ${teamName}`
    );
  };

  static handlePlayerShirtError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string,
    shirtCode: string
  ) => {
    this.handleImageError(
      event,
      '/assets/times/camisas/camisa-default.png',
      `Player shirt for: ${teamName}/${shirtCode}`
    );
  };
}

export class UrlService {

  static getTeamUrl(teamName: string, params?: Record<string, string>): string {
    const normalized = ImageService.normalizeForFilePath(teamName);
    let url = `/${normalized}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  static getPlayerStatsUrl(category: string, statTitle: string): string {
    const categoryLower = category ? category.toLowerCase() : '';
    const normalizedTitle = ImageService.normalizeForFilePath(statTitle);
    return `/ranking/stats?stat=${categoryLower}-${normalizedTitle}`;
  }

    static getTeamStatsUrl(category: string, statTitle: string): string {
    const categoryLower = category ? category.toLowerCase() : '';
    const normalizedTitle = ImageService.normalizeForFilePath(statTitle);
    return `/ranking/times/stats?stat=${categoryLower}-${normalizedTitle}`;
  }

  static getPlayerUrl(teamName: string, playerName: string, params?: Record<string, string>): string {
    const normalizedTeam = ImageService.normalizeForFilePath(teamName);
    const normalizedPlayer = ImageService.normalizeForFilePath(playerName);
    let url = `/${normalizedTeam}/${normalizedPlayer}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }
}


export const normalizeForFilePath = ImageService.normalizeForFilePath;
export const formatValue = (value: string | number, title: string): string => {
  if (typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.,]/g, '')))) {
    const isPercentage = title.includes('(%)') || ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    if (isPercentage) {
      const numValue = Number(value.replace(/[^0-9.,]/g, ''));
      return `${Math.round(numValue)}%`;
    }
  }

  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    const isPercentage = title.includes('(%)') || ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    if (isPercentage) {
      return `${Math.round(numValue)}%`;
    }
    return numValue.toLocaleString('pt-BR');
  }

  return String(value);
};