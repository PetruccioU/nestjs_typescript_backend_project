import {ApiProperty} from "@nestjs/swagger";

export class CreateTextBlockDto{

    @ApiProperty({example: 'main-hero-text', description : 'The unique title' })
    uniqueNameForSearch: string;

    @ApiProperty({example: 'hero', description : 'Text title' })
    name: string;

    @ApiProperty({example: '.jpg', description : 'Text block picture' })
    image: string;

    @ApiProperty({example: 'Content', description : 'Text block content' })
    text: string;

    @ApiProperty({example: 'main-page', description : 'Text block group' })
    group: string;

}


