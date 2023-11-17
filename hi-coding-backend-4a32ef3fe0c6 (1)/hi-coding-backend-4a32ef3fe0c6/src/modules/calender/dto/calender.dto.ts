import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCalenderEventDTO {

    @IsString()
    @IsNotEmpty()
    eventStart: string;

    @IsString()
    @IsNotEmpty()
    eventEnd: string;

    @IsString()
    @IsNotEmpty()
    eventTitle: string;

    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsOptional()
    eventType?: string;

    @IsString()
    @IsNotEmpty()
    school: string;

}

export class UpdateCalenderEventDTO {

    @IsString()
    @IsNotEmpty()
    eventStart: string;

    @IsString()
    @IsNotEmpty()
    eventEnd: string;

    @IsString()
    @IsNotEmpty()
    eventTitle: string;

    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsOptional()
    eventType?: string;

    @IsString()
    @IsNotEmpty()
    school: string;


}