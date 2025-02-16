export function validateId(id: string) {
    // Allow hex strings up to 60 characters with optional 0x prefix
    return /^(0x)?[0-9a-fA-F]{1,60}$/.test(id);
}

