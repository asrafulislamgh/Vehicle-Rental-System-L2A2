const Role = {
    admin: "admin",
    customer: "customer",
} as const;

const Status = {
    available: "available",
    booked: "booked",
    cancelled: "cancelled",
    returned: "returned",
    active: "active",
} as const;

export { Role, Status };