import ISeeder from "./core/interfaces/InterfaceSeeder"

import UserTypeSeeder from "./features/user/seeders/UserTypeseeder"

export const SEEDERS: Array<ISeeder> = [new UserTypeSeeder()]
