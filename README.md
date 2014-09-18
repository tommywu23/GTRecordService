
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

## 1.1 Request

POST /Recording

Content-type: application/json

Encoding: utf8

Post Body:
[{"name":“GT01","type":"camera","address":"rtsp://192.168.16.141:8554/stream.smp?address=192.168.16.214"},
{"name":"GT02","type":"camera","address":"rtsp://192.168.16.141:8554/192.168.16.140:8554/stream.smp?address=192.168.16.211"}]

Key Description:
name - signal name to record

type - signal type(camera)

address - url for record

## 1.2 Response:
HTTP /1.1 200 OK

Content-Type: application/json

Response Body:

{"recording":
[{"name":“GT01","type":"camera","address":"rtsp://192.168.16.141:8554/stream.smp?address=192.168.16.214"},
{"name":"GT02","type":"camera","address":"rtsp://192.168.16.141:8554/192.168.16.140:8554/stream.smp?address=192.168.16.211"}]
,"result":OK}

## 1.3 Error:

to be continue...

## 2 Stop Command

client request stop record of a group of SM(Streaming Media)

## 2.1 Request

DELETE /Recording

Content-type: application/json

Encoding: utf8

Post Body: ditto 1.1

## 2.2 Response: ditto 1.2

## 2.3 Error: ditto 1.3

## 3. Get current record of running status

client request to get record status of all SM(Streaming Media)

## 3.1 Request

GET /Recording

Content-type: application/json

Encoding: utf8

## 3.2 Response:

HTTP /1.1 200 OK

Content-Type: application/json

Response Body:

[{"id":"1","name":"encoder1","url":"rtsp://192.168.1.200/id=0","state":"off","seconds":0,"count":0,"file":""},
{"id":"3","name":"encoder3","url":"rtsp://192.168.1.201/id=0","state":"off","seconds":0,"count":0,"file":""}]

Key Description:

id - MTS Unique identification

name - Encoder Name

url - Streaming Media link address

state - Record state(on|off)

seconds - Record time(Units: seconds)

file - Record file path

## 3.3 Error:


