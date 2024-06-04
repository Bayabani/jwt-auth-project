export class authPayloadDto {
    username: string;
    password: string;
    email: string;
    roles?: string[]; // Optional for now
}