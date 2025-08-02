import Constants from 'expo-constants';

// Interface para tipagem das configurações
interface AppConfig {
    backendApi: string;
    frontedApi: string;
    stripePublishableKey: string;
    stripeSecretKey: string;
}

// Função para obter configurações de forma segura
export const getConfig = (): AppConfig => {
    const extra = Constants.expoConfig?.extra as AppConfig;

    if (!extra) {
        throw new Error('Configurações não encontradas. Verifique se o app.config.ts está configurado corretamente.');
    }

    return {
        backendApi: extra.backendApi || 'https://www.turistarturismo.shop/api/',
        frontedApi: extra.frontedApi || 'https://www.turistarturismo.shop/',
        stripePublishableKey: extra.stripePublishableKey || '',
        stripeSecretKey: extra.stripeSecretKey || ''
    };
};

// Exportar configurações diretamente para facilitar o uso
export const config = getConfig(); 