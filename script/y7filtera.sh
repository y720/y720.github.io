#!/bin/sh
cat ../y7zh.json | jq -r '.[][1]' | awk -f y7filtera.awk > y7filtera.bak
say -v Ting-Ting -r 100 -f y7filtera.bak -o ../mp3/y7zh.m4a

