# ffmpeg

FFmpeg — набор свободных библиотек с открытым исходным кодом, которые позволяют записывать,
конвертировать и передавать цифровые аудио- и видеозаписи в различных форматах.

### Сжать видео в хорошем качестве

3.6 Gb to 556 Mb, great quality 1st_place_medal.

```shell
ffmpeg -i input.mp4 -vcodec h264 -acodec mp2 out.mp4
```

### Сжать видео в среднем качестве

3.6 Gb to 62 Mb, quality "good enough"/acceptable.

```shell
ffmpeg -i input.mp4 -s 1280x720 -acodec copy -y output.mp4
```

### Сжать видео в плохом качестве

3.6 Gb to 30 Mb, very shitty quality hankey.

```shell
ffmpeg -i input.mp4 -vcodec h264 -b:v 1000k -acodec mp3 output.mp4
```

## Источники

* [https://gist.github.com/lukehedger](https://gist.github.com/lukehedger/277d136f68b028e22bed)
* [StackOverFlow](https://stackoverflow.com/questions/44510765/gpu-accelerated-video-processing-with-ffmpeg)
