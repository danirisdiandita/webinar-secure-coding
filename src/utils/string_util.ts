export const getInitials = (name: string): string => {
    if (!name) return '';

    // Split the name into parts
    const nameParts = name.trim().split(' ');

    // Extract the first character of each part and capitalize it
    const initials = nameParts
        .filter((part) => part) // Filter out empty parts
        .map((part) => part[0].toUpperCase())
        .join('');

    // Return only the first two initials
    return initials.slice(0, 2);
}