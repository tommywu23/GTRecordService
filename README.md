
[![Build Status](./assets/logo.jpg)](./assets/logo.jpg)

 [![Build Status](https://travis-ci.org/tommywu23/GTRecordService.svg)](https://travis-ci.org/tommywu23/GTRecordService)
 [![Dependency Status](https://img.shields.io/gemnasium/tommywu23/GTRecordService.svg)](https://gemnasium.com/tommywu23/GTRecordService)

===============

## Installation

A control of MTS service,via RESTFul

MTS - Streaming Media Transmission Server

===============

## API

## 1. Start Command

client request to start record of a group of SM(Streaming Media)

## POST /Recording

Content-type: application/json

Encoding: utf8

## Content:
[{"name":“GT01","type":"camera","address":"rtsp://192.168.16.141:8554/stream.smp?address=192.168.16.214"},
{"name":"GT02","type":"camera","address":"rtsp://192.168.16.141:8554/192.168.16.140:8554/stream.smp?address=192.168.16.211"}]

##Key Description:
name - signal name to record

type - signal type(camera)

address - url for record

## Response:
HTTP /1.1 200 OK

Content-Type: application/json

{"recording":
[{"name":“GT01","type":"camera","address":"rtsp://192.168.16.141:8554/stream.smp?address=192.168.16.214"},
{"name":"GT02","type":"camera","address":"rtsp://192.168.16.141:8554/192.168.16.140:8554/stream.smp?address=192.168.16.211"}]
,"result":OK}

## Error:

## 2. Stop Command

client request stop record of a group of SM(Streaming Media)

## DELETE /Recording

Content-type: application/json

Encoding: utf8

Content:
ditto


## Response:
ditto

## Error:
ditto


## 3. Get current record of running status

client request to get record status of all SM(Streaming Media)

GET /Recording

Content-type: application/json

Encoding: utf8

##Response:

HTTP /1.1 200 OK

Content-Type: application/json

##Json Data:
[{"id":"1","name":"encoder1","url":"rtsp://192.168.1.200/id=0","state":"off","seconds":0,"count":0,"file":""},
{"id":"3","name":"encoder3","url":"rtsp://192.168.1.201/id=0","state":"off","seconds":0,"count":0,"file":""}]

##Key Description:

id - MTS Unique identification

name - Encoder Name

url - Streaming Media link address

state - Record state(on|off)

seconds - Record time(Units: seconds)

file - Record file path

##Error:


