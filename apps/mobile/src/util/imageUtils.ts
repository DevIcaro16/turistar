/**
 * Converte URLs HTTP para HTTPS para compatibilidade com Android
 * @param imageUrl - URL da imagem (pode ser HTTP ou HTTPS)
 * @returns URL HTTPS
 */
export const secureImageUrl = (imageUrl: string | null | undefined): string | null => {

    if (!imageUrl) return null;

    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return null;

    }

    // Se já é HTTPS, retorna como está
    if (imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // Se é HTTP, converte para HTTPS
    if (imageUrl.startsWith('http://')) {
        return imageUrl.replace('http://', 'https://');
    }



    // Se não tem protocolo, adiciona HTTPS
    if (!imageUrl.startsWith('http')) {
        return `https://${imageUrl}`;
    }

    return imageUrl;
};

/**
 * Gera URL de avatar padrão baseado no nome do usuário
 * @param name - Nome do usuário
 * @param size - Tamanho da imagem (padrão: 90)
 * @returns URL do avatar
 */
export const getDefaultAvatarUrl = (name: string | null | undefined, size = 90): string => {
    const userName = name || 'User';
    // Remove caracteres especiais e pega apenas as primeiras letras de cada palavra
    const initials = userName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);

    const encodedName = encodeURIComponent(initials || 'U');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=007AFF&color=fff&size=${size}`;
}; 