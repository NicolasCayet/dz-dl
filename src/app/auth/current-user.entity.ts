import {AccountEntity} from "../entities/account.entity";
export interface CurrentUserEntity {
    id: number;
    nickname: string;
    account: AccountEntity;
}
