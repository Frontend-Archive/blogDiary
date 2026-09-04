nanum-pen-kr.woff2

Nanum Pen Script (나눔손글씨 펜) — Copyright (c) 2010 NHN Corporation.
SIL Open Font License 1.1: https://scripts.sil.org/OFL
원본: https://github.com/google/fonts/tree/main/ofl/nanumpenscript

한글 음절 전체(AC00–D7A3)와 라틴·기호만 남긴 서브셋입니다(약 448KB).
힌팅과 쓰지 않는 글리프를 걷어내 원본 3.2MB에서 줄였습니다.
`font-display: swap` 이라 폰트가 오기 전에는 시스템 글꼴로 먼저 보입니다.

다시 뽑으려면:

  pyftsubset NanumPenScript-Regular.ttf \
    --text-file=chars.txt --output-file=nanum-pen-kr.woff2 \
    --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize
