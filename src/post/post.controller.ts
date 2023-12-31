import {BadRequestException, Body, Controller, Get, Param, Post, Query, Session} from "@nestjs/common";
import {PostService} from "./post.service";
import {CreatePostDto} from "./dto/create-post.dto";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async save(@Body() dto: CreatePostDto): Promise<void> {
        const {title, sentence} = dto;
        await this.postService.save(title, sentence);
    }

    @Get()
    async getPost(@Query("page") page: number = 1, @Query("list_num") list_num: number = 100) {
        return await this.postService.getPost(page, list_num);
    }

    @Get("/:id")
    async incrementHit(@Param("id") id: string, @Session() session: Record<string, any>) {
        if (!session.hitsCount) {
            session.hitsCount = [];
        }
        if (!session.hitsCount.includes(id)) {
            session.hitsCount.push(id);
            return await this.postService.incrementHit(id);
        }
        throw new BadRequestException("이미 hits를 누른 게시글입니다.");
    }
}
