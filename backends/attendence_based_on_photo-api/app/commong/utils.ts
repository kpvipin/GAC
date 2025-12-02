// Returns today's date as 'YYYY-MM-DD' in tenant timezone
export const getTodaysDateInTenantTZ = (tenantId) => {
    const tenantTimezone = getTenantTimeZone(tenantId);
    const now = new Date();
    const tzString = now.toLocaleString("en-US", { timeZone: tenantTimezone });
    const tzDate = new Date(tzString);
    const todayDateStr = tzDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    return todayDateStr;
}

// Returns the start of today (00:00:00) in tenant timezone
export const getTodaysStartOfDateInTenantTZ = (tenantId) => {
    const tenantTimezone = getTenantTimeZone(tenantId);
    const now = new Date();
    const tzString = now.toLocaleString("en-US", { timeZone: tenantTimezone });
    const tzDate = new Date(tzString);
    const startOfDay = new Date(
        tzDate.getFullYear(),
        tzDate.getMonth(),
        tzDate.getDate(),
        0, 0, 0, 0
    );
    return startOfDay;
}

export const getCurrentDateTimeInTenantTZ = (tenantId) => {
    const tenantTimezone = getTenantTimeZone(tenantId);
    const now = new Date();
    const options = { timeZone: tenantTimezone };
    // Convert to string in tenant TZ
    const tzString = now.toLocaleString("en-US", options);
    // Convert back to Date object
    return new Date(tzString);
}

const getTenantTimeZone = (tenantId) => {
    return "Asia/Kolkata"; //TODO: Get timezone of Tenant
}