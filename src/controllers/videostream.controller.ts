import { Controller, Get, HttpService, Render, Req, Res } from '@nestjs/common';
import * as fs from 'fs';

@Controller('videostream')
export class VideostreamController {
  constructor(private http: HttpService) {}

  @Get()
  @Render('index')
  async getVideoStream(@Res() res) {
    return { message: 'video stream' };
  }

  @Get('video')
  async getVideo(@Res() res, @Req() req) {
    const link = __dirname + '../../assets/sample.mp4';
    const stat = fs.statSync(link);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(link, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(link).pipe(res);
    }
  }
}
