import ISeeder from "./core/interfaces/InterfaceSeeder"

import UserSeeder from "./features/user/seeders/UserSeeder"
import UserTypeSeeder from "./features/user/seeders/UserTypeseeder"

export const SEEDERS: Array<ISeeder> = [new UserTypeSeeder(), new UserSeeder()]
