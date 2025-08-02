import { useMemo } from 'react';
import { secureImageUrl } from '../util/imageUtils';

/**
 * Hook para usar imagens com URLs seguras (HTTPS)
 * @param imageUrl - URL da imagem
 * @returns URL segura ou null
 */
export const useSecureImage = (imageUrl: string | null | undefined) => {
    return useMemo(() => {
        return secureImageUrl(imageUrl);
    }, [imageUrl]);
};

/**
 * Hook para criar source seguro para componente Image
 * @param imageUrl - URL da imagem
 * @returns Objeto source seguro
 */
export const useSecureImageSource = (imageUrl: string | null | undefined) => {
    return useMemo(() => {
        const secureUrl = secureImageUrl(imageUrl);
        return secureUrl ? { uri: secureUrl } : null;
    }, [imageUrl]);
}; 