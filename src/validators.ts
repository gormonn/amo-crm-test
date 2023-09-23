import { IsOptional, IsString, MinLength } from 'class-validator';

export class LeadQueryParamDto {
  @IsOptional()
  @IsString()
  @MinLength(3) // Укажите нужную минимальную и максимальную длину
  query?: string;
}
