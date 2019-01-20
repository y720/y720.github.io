#!/bin/sh
cat ../json/y7words.json | jq -r '.[][1]' | awk -f y7filter1.awk

